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
  LOGGED_IN_STATUS_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILED,
  LOGIN_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILED,
  REGISTER_USER,
  AUTH_FORM_UPDATE,
  IDENTITY_UPDATED,
  LOGOUT,
} from '../actions/types';

export const initialState = {
  username: '',
  password: '',
  email: '',
  error: '',
  notice: '',
  loading: false,
  loggedIn: false,
  user: null,
  identityId: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        loading: true,
        error: '',
        notice: '',
      };
    case LOGIN_USER_SUCCESS:
      return {
        ...initialState,
        user: action.user,
      };
    case LOGIN_USER_FAILED:
      return {
        ...state,
        error: action.error || 'Authentication Failed',
        password: '',
        loading: false,
      };
    case LOGGED_IN_STATUS_CHANGED:
      return {
        ...state,
        loggedIn: action.loggedIn,
      };
    case LOGOUT:
      return initialState;
    case AUTH_FORM_UPDATE:
      return {
        ...state,
        [action.prop]: action.value,
      };
    case REGISTER_USER:
      return {
        ...state,
        loading: true,
        error: '',
        notice: '',
      };
    case REGISTER_USER_SUCCESS:
      return {
        ...initialState,
        username: action.username,
        notice: 'Registration successful. Please sign in',
      };
    case REGISTER_USER_FAILED:
      return {
        ...initialState,
        error: action.error || 'Registration Failed',
      };
    case IDENTITY_UPDATED:
      return {
        ...state,
        identityId: action.identityId,
      };
    default:
      return state;
  }
};
