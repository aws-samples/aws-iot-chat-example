/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import moment from 'moment';
import uuid from 'uuid/v4';
import * as log from 'loglevel';

import * as ApiGateway from '../lib/api-gateway';
import {
  NEW_MESSAGE,
  NEW_USER,
  FETCHING_USER,
} from './types';
import { identityIdFromNewMessageTopic, roomFromNewMessageTopic } from '../lib/topicHelper';

const newMessageAdd = (dispatch, message, username, time, id, room) => {
  dispatch({ type: NEW_MESSAGE, message, username, time, id, room });
};

const newUserAdd = (dispatch, identityId, user) => {
  dispatch({ type: NEW_USER, identityId, user });
};

/**
 * Handle a new message arriving. Cognito identity id is parsed from topic. If user is cached,
 * build message immediately. Otherwise, query API for user information based on identity id.
 *
 * @param {string} message - the message
 * @param {string} topic - the topic of the form room/public/+/cognitoId
 */
export const newMessage = (message, topic) => (
  (dispatch, getState) => {
    const identityId = identityIdFromNewMessageTopic(topic);
    const room = roomFromNewMessageTopic(topic);
    const user = getState().users[identityId];
    const now = moment();
    if (user) {
      newMessageAdd(dispatch, message, user.username, now, uuid(), room);
      return Promise.resolve();
    }
    dispatch({ type: FETCHING_USER });
    return ApiGateway.fetchUser(identityId)
      .then((fetchedUser) => {
        newUserAdd(dispatch, identityId, fetchedUser);
        newMessageAdd(dispatch, message, fetchedUser.username, now, uuid(), room);
      })
      .catch((error) => {
        log.error(error);
      });
  }
);
