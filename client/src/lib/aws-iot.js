/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import * as log from 'loglevel';

import IoTClient from './iot-client';
import Config from '../config';

export const initNewClient = (awsCredentials) => {
  const options = {
    debug: Config.mqttDebugLevel,
    accessKeyId: awsCredentials.accessKeyId,
    secretKey: awsCredentials.secretAccessKey,
    sessionToken: awsCredentials.sessionToken,
  };
  const client = new IoTClient(true, options);
  log.debug(client);
};

/**
 * Update device client with AWS identity credentials after logging in.
 *
 * @param {object} awsCredentials - AWS SDK credentials
 * @param {string} awsCredentials.accessKeyId - Access Key Id
 * @param {string} awsCredentials.secretAccessKey - Secret Access Key
 * @param {string} awsCredentials.sessionToken - Session Token
 */
export const updateClientCredentials = (awsCredentials) => {
  const { accessKeyId, secretAccessKey, sessionToken } = awsCredentials;
  const client = new IoTClient();
  client.updateWebSocketCredentials(accessKeyId, secretAccessKey, sessionToken);
};

/**
 * Unsubscribe from topics
 *
 * @param {string[]} topics - List of topics to unsubscribe from
 */
export const unsubscribeFromTopics = (topics) => {
  const client = new IoTClient();
  topics.forEach((topic) => {
    client.unsubscribe(topic);
  });
};

/**
 * Attach a message handler
 */
export const attachMessageHandler = (handler) => {
  const client = new IoTClient();
  client.attachMessageHandler(handler);
};

/**
 * Attach a connect handler
 *
 * @param {AWSIoT~onConnectHandler} onConnectHandler - Callback that handles a new connection
 *
 * @callback AWSIoT~onConnectHandler
 * @param {Object} connack - Connack object
 */
export const attachConnectHandler = (onConnectHandler) => {
  const client = new IoTClient();
  client.attachConnectHandler(onConnectHandler);
};

/**
 * Attach a close handler
 *
 * @param {AWSIoT~onCloseHandler} onCloseHandler - Callback that handles closing connection
 *
 * @callback AWSIoTI~onCloseHandler
 * @param {Object} err - Connection close error
 */
export const attachCloseHandler = (handler) => {
  const client = new IoTClient();
  client.attachCloseHandler(handler);
};

/**
 * Publish to an MQTT topic
 *
 * @param {string} topic - Topic to publish to
 * @param {string} message - JSON encoded payload to send
 */
export const publish = (topic, message) => {
  const client = new IoTClient();
  client.publish(topic, message);
  log.debug('published message', topic, message);
};

/**
 * Subscribe to an MQTT topic
 *
 * @param {string} topic - Topic to subscribe to
 */
export const subscribe = (topic) => {
  const client = new IoTClient();
  client.subscribe(topic);
  log.debug('subscribed to', topic);
};

