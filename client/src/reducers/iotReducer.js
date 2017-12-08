/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import {
  CONNECT_POLICY_ATTACHED,
  PUBLIC_PUBLISH_POLICY_ATTACHED,
  PUBLIC_RECEIVE_POLICY_ATTACHED,
  PUBLIC_SUBSCRIBE_POLICY_ATTACHED,
  LOGOUT,
  DEVICE_CONNECTED_STATUS_CHANGED,
  MESSAGE_HANDLER_ATTACHED,
} from '../actions/types';

export const initialState = {
  connectPolicy: false,
  publicPublishPolicy: false,
  publicSubscribePolicy: false,
  publicReceivePolicy: false,
  deviceConnected: false,
  messageHandlerAttached: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONNECT_POLICY_ATTACHED:
      return {
        ...state,
        connectPolicy: true,
      };
    case PUBLIC_PUBLISH_POLICY_ATTACHED:
      return {
        ...state,
        publicPublishPolicy: true,
      };
    case PUBLIC_SUBSCRIBE_POLICY_ATTACHED:
      return {
        ...state,
        publicSubscribePolicy: true,
      };
    case PUBLIC_RECEIVE_POLICY_ATTACHED:
      return {
        ...state,
        publicReceivePolicy: true,
      };
    case DEVICE_CONNECTED_STATUS_CHANGED:
      return {
        ...state,
        deviceConnected: action.deviceConnected,
      };
    case MESSAGE_HANDLER_ATTACHED:
      return {
        ...state,
        messageHandlerAttached: action.attached,
      };
    case LOGOUT:
      return {
        ...initialState,
        messageHandlerAttached: state.messageHandlerAttached,
        deviceConnected: state.deviceConnected, // Leave this as connected to use same mqtt client
      };
    default:
      return state;
  }
};
