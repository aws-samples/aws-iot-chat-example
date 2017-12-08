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

import {
  MESSAGE_TO_SEND_CHANGED,
  ADD_SUBSCRIBED_TOPIC,
  FETCHING_CHATS,
  RECEIVE_CHATS,
  CREATING_CHAT,
  ADD_CHAT,
  CHAT_ERROR,
  RESET_UNREADS,
} from './types';
import * as ApiGateway from '../lib/api-gateway';
import * as IoT from '../lib/aws-iot';
import history from '../lib/history';

export const messageToSendChanged = messageToSend => ({
  type: MESSAGE_TO_SEND_CHANGED,
  messageToSend,
});

/**
 * Subscribe to topic if we have not yet subscribed
 *
 * @param {string} topic - The topic that we want to subscribe to
 */
export const subscribeToTopic = topic => (
  (dispatch, getState) => {
    const { subscribedTopics } = getState().chat;
    if (subscribedTopics.includes(topic)) {
      log.debug('Already subscribed to topic', topic);
    } else {
      IoT.subscribe(topic);
      dispatch({ type: ADD_SUBSCRIBED_TOPIC, topic });
    }
    return Promise.resolve();
  }
);

/**
 * Fetch list of chats that have been created
 */
export const fetchAllChats = () => (
  (dispatch) => {
    dispatch({ type: FETCHING_CHATS });
    return ApiGateway.fetchAllChats()
      .then((chats) => {
        dispatch({ type: RECEIVE_CHATS, chats });
      });
  }
);
/**
 * Create a chat room
 *
 * @param {string} room - The sanitized name of the room
 * @param {string} type - The room type: 'public', or 'private'
 */
export const createChat = (room, type) => (
  (dispatch) => {
    dispatch({ type: CREATING_CHAT });

    const roomName = `room/${type}/${room}`;

    return ApiGateway.createChat(roomName, type)
      .then((chat) => {
        dispatch({ type: ADD_CHAT, chat });
        // Redirect user into that chat page
        history.push(`/app/${chat.name}`);
      })
      .catch((response) => {
        dispatch({ type: CHAT_ERROR, error: JSON.parse(response.message).error });
      });
  }
);

/**
 * Mark the messages in room as read
 * 
 * @param {string} topic - A topic of the form 'room/public/my-awesome-topic'
 */
export const readChat = topic => (
  (dispatch, getState) => {
    if (getState().unreads[topic] !== 0) {
      dispatch({ type: RESET_UNREADS, room: topic });
    }
    return Promise.resolve();
  }
);
