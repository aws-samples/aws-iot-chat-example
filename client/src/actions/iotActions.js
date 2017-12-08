/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import * as ApiGateway from '../lib/api-gateway';
import * as Cognito from '../lib/aws-cognito';
import * as IoT from '../lib/aws-iot';
import {
  CONNECT_POLICY_ATTACHED,
  PUBLIC_PUBLISH_POLICY_ATTACHED,
  PUBLIC_SUBSCRIBE_POLICY_ATTACHED,
  PUBLIC_RECEIVE_POLICY_ATTACHED,
  DEVICE_CONNECTED_STATUS_CHANGED,
  IDENTITY_UPDATED,
  MESSAGE_HANDLER_ATTACHED,
} from './types';
import { handleSignOut } from './authActions';
import { newMessage } from './messageActions';

/**
 * Ask API Gateway for Iot policy whitelisting for public rooms
 * 1. Ensure we are logged in
 * 2. Fetch AWS credentials from sessionStorage, identityId and attach to a new MQTT client
 * 3. Ask for Connect, Publish, Subscribe, Receive policies
 */
export const acquirePublicPolicies = (connectCallback, closeCallback) => (
  async (dispatch, getState) => {
    const {
      connectPolicy,
      publicPublishPolicy,
      publicSubscribePolicy,
      publicReceivePolicy,
    } = getState().iot;

    const loggedIn = await Cognito.authUser();
    if (!loggedIn) {
      handleSignOut()(dispatch);
      return Promise.resolve();
    }
    const identityId = Cognito.getIdentityId();
    dispatch({ type: IDENTITY_UPDATED, identityId });
    const awsCredentials = JSON.parse(sessionStorage.getItem('awsCredentials'));

    IoT.initNewClient(awsCredentials);
    IoT.attachConnectHandler(connectCallback);
    IoT.attachCloseHandler(closeCallback);

    if (!connectPolicy) {
      ApiGateway.attachConnectPolicy().then(() =>
        dispatch({ type: CONNECT_POLICY_ATTACHED }));
    }

    if (!publicPublishPolicy) {
      ApiGateway.attachPublicPublishPolicy().then(() =>
        dispatch({ type: PUBLIC_PUBLISH_POLICY_ATTACHED }));
    }

    if (!publicSubscribePolicy) {
      ApiGateway.attachPublicSubscribePolicy().then(() =>
        dispatch({ type: PUBLIC_SUBSCRIBE_POLICY_ATTACHED }));
    }

    if (!publicReceivePolicy) {
      ApiGateway.attachPublicReceivePolicy().then(() =>
        dispatch({ type: PUBLIC_RECEIVE_POLICY_ATTACHED }));
    }

    return Promise.resolve();
  }
);

/**
 * Change device connected status
 *
 * @param {bool} status - whether the device is connected or not
 */
export const deviceConnectedStatusChanged = status => ({
  type: DEVICE_CONNECTED_STATUS_CHANGED,
  deviceConnected: status,
});

/**
 * Handler for incoming MQTT messages
 * Uses currying to bind Redux dispatch and getState and returns handler
 *
 * @params {function} dispatch - Redux dispatch
 * @params {function} getState - Redux getState
 * @returns {function}  The wrapped onNewMessage handler
 *
 * onNewMessage handler parses message and forwards to newMessage action
 * @params {string} topic - The topic that the message was published to
 * @params {string} jsonPayload - JSON payload of the message
 */
const onNewMessageWithRedux = (dispatch, getState) => (
  (topic, jsonPayload) => {
    const payload = JSON.parse(jsonPayload.toString());
    const { message } = payload;
    newMessage(message, topic)(dispatch, getState);
  }
);

export const attachMessageHandler = () => (
  (dispatch, getState) => {
    const attached = getState().iot.messageHandlerAttached;
    if (!attached) {
      IoT.attachMessageHandler(onNewMessageWithRedux(dispatch, getState));
    }
    dispatch({ type: MESSAGE_HANDLER_ATTACHED, attached: true });
    return Promise.resolve();
  }
);
