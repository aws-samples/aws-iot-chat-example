/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

// Message Actions
export const NEW_MESSAGE = 'NEW_MESSAGE';

// Auth actions
export const LOGGED_IN_STATUS_CHANGED = 'LOGGED_IN_STATUS_CHANGED';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILED = 'LOGIN_USER_FAILED';
export const LOGIN_USER = 'LOGIN_USER';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILED = 'REGISTER_USER_FAILED';
export const REGISTER_USER = 'REGISTER_USER';
export const AUTH_FORM_UPDATE = 'AUTH_FORM_UPDATE';
export const IDENTITY_UPDATED = 'IDENTITY_UPDATED';
export const LOGOUT = 'LOGOUT';

// User actions
export const NEW_USER = 'NEW_USER';
export const FETCHING_USER = 'FETCHING_USER';

// Chat actions
export const MESSAGE_TO_SEND_CHANGED = 'MESSAGE_TO_SEND_CHANGED';
export const ADD_SUBSCRIBED_TOPIC = 'ADD_SUBSCRIBED_TOPIC';
export const CLEAR_SUBSCRIBED_TOPICS = 'CLEAR_SUBSCRIBED_TOPICS';
export const FETCHING_CHATS = 'FETCHING_CHATS';
export const RECEIVE_CHATS = 'RECEIVE_CHATS';
export const CREATING_CHAT = 'CREATING_CHAT';
export const ADD_CHAT = 'ADD_CHAT';
export const CHAT_ERROR = 'CHAT_ERROR';
export const RESET_UNREADS = 'RESET_UNREADS';

// IoT actions
export const CONNECT_POLICY_ATTACHED = 'CONNECT_POLICY_ATTACHED';
export const PUBLIC_PUBLISH_POLICY_ATTACHED = 'PUBLIC_PUBLISH_POLICY_ATTACHED';
export const PUBLIC_RECEIVE_POLICY_ATTACHED = 'PUBLIC_RECEIVE_POLICY_ATTACHED';
export const PUBLIC_SUBSCRIBE_POLICY_ATTACHED = 'PUBLIC_SUBSCRIBE_POLICY_ATTACHED';
export const DEVICE_CONNECTED_STATUS_CHANGED = 'DEVICE_CONNECTED_STATUS_CHANGED';
export const MESSAGE_HANDLER_ATTACHED = 'MESSAGE_HANDLER_ATTACHED';
