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
  MESSAGE_TO_SEND_CHANGED,
  ADD_SUBSCRIBED_TOPIC,
  FETCHING_CHATS,
  RECEIVE_CHATS,
  CREATING_CHAT,
  ADD_CHAT,
  CHAT_ERROR,
  LOGOUT,
  FETCHING_USER,
  NEW_USER,
  CLEAR_SUBSCRIBED_TOPICS,
} from '../actions/types';

export const initialState = {
  messageToSend: '',
  subscribedTopics: [],
  allChats: [],
  loadingChats: false,
  creatingChat: false,
  error: '',
  fetchingUser: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MESSAGE_TO_SEND_CHANGED:
      return {
        ...state,
        messageToSend: action.messageToSend,
      };
    case ADD_SUBSCRIBED_TOPIC:
      return {
        ...state,
        subscribedTopics: [
          ...state.subscribedTopics,
          action.topic,
        ],
      };
    case CLEAR_SUBSCRIBED_TOPICS:
      return {
        ...state,
        subscribedTopics: initialState.subscribedTopics,
      };
    case FETCHING_CHATS:
      return {
        ...state,
        loadingChats: true,
      };
    case RECEIVE_CHATS:
      return {
        ...state,
        allChats: action.chats,
        loadingChats: false,
      };
    case CREATING_CHAT:
      return {
        ...state,
        creatingChat: true,
        error: '',
      };
    case ADD_CHAT:
      return {
        ...state,
        allChats: [
          ...state.allChats,
          action.chat,
        ],
        creatingChat: false,
      };
    case CHAT_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    case FETCHING_USER:
      return {
        ...state,
        fetchingUser: true,
      };
    case NEW_USER:
      return {
        ...state,
        fetchingUser: false,
      };
    default:
      return state;
  }
};
