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

/**
 * Validate a topic of the form 'room/public/my-aweseome-room'
 *
 * @param {string} topic - The topic to validate
 */
const validateTopic = (topic) => {
  if (!/^room\/(public|private)\/[a-zA-Z-1-9]+$/.test(topic)) {
    log.error('Invalid topic. Expected /^room/(public|private)/[a-zA-Z-1-9]+$/');
  }
};

/**
 * Validate a topic of the form 'room/public/my-awesome-room/us-west-2:123456789abcdef'
 *
 * @param {string} topic - The topic to validate
 */
const validateNewMessageTopic = (topic) => {
  if (!/^room\/(public|private)\/[a-zA-Z-1-9]+\/[\w-]+:[0-9a-f-]+$/.test(topic)) {
    log.error('Invalid new message topic. Expected /^room/(public|private)/[a-zA-Z-1-9]+/[\\w-]+:[0-9a-f-]+$/');
  }
};

/**
 * Validate a topic of the form 'room/public/my-awesome-room/+'
 *
 * @param {string} topic - The topic to validate
 */
const validateSubscriptionTopic = (topic) => {
  if (!/^room\/(public|private)\/[a-zA-Z-1-9]+\/\+$/.test(topic)) {
    log.error('Invalid subscription topic. Expected /^room/(public|private)/[a-zA-Z-1-9]+/\\+$/');
  }
};

/**
 * Helper for generating topic name from route parameters
 *
 * @param {object} params - react-router-dom params
 * @param {string} params.roomtype - 'private' or 'public'
 * @param {string} params.roomName - name of the room
 * @returns {string} - topic of the form 'room/:roomType/:roomName
 */
export const topicFromParams = params => `room/${params.roomType}/${params.roomName}`;

/**
 * Capitalize a string
 *
 * @param {string} str - The string to capitalize
 * @returns {string} - The string with the first letter capitalized
 */
export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Format header of RoomCard. Given a room name like 'room/public/my-awesome-room', format the title
 * of the card to be 'My Awesome Room'
 *
 * @param {string} roomName - The full room name including type and name
 * @returns {string} - The formatted header
 */
export const formatRoomCardHeader = (roomName) => {
  validateTopic(roomName);
  // roomName: 'room/public/my-awesome-room'
  const roomNameEnding = roomName.split('/').pop();
  // roomNameEnding: 'my-awesome-room'
  const segments = roomNameEnding.split('-').map(segment => capitalize(segment));
  // segments: ['My', 'Awesome', 'Room']
  return segments.join(' ');
  // return: 'My Awesome Room'
};

/**
 * Given a topic of the form 'room/public/my-awesome-room/us-west:identity-id',
 * return the identity id
 *
 * @param {string} topic - The full topic including room name, type and identity id
 * @returns {string} - The identity id
 */
export const identityIdFromNewMessageTopic = (topic) => {
  validateNewMessageTopic(topic);
  return topic.substr(topic.lastIndexOf('/') + 1);
};

/**
 * Given a topic of the form 'room/public/my-awesome-room/us-west:identity-id',
 * return the topic, stripping the identity id
 *
 * @param {string} topic - The full topic including room name, type and identity id
 * @returns {string} - The topic without the identity id
 */
export const roomFromNewMessageTopic = (topic) => {
  validateNewMessageTopic(topic);
  return topic.substr(0, topic.lastIndexOf('/'));
};

/**
 * Given a topic of the form 'room/public/my-awesome-room/+', remove the trailing '/+' and return
 * 'room/public/my-awesome-room'
 *
 * @param {string} topic - The full topic including the room name, type and wildcard character
 * @returns {string} - The topic without the trailing '/+'
 */
export const topicFromSubscriptionTopic = (topic) => {
  validateSubscriptionTopic(topic);
  return topic.substr(0, topic.lastIndexOf('/'));
};
