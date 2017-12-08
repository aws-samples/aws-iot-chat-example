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

import * as Cognito from '../lib/aws-cognito';
import * as ApiGateway from '../lib/api-gateway';
import * as IoT from '../lib/aws-iot';
import history from '../lib/history';
import {
  LOGGED_IN_STATUS_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILED,
  LOGIN_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILED,
  REGISTER_USER,
  AUTH_FORM_UPDATE,
  NEW_USER,
  LOGOUT,
  CLEAR_SUBSCRIBED_TOPICS,
  MESSAGE_HANDLER_ATTACHED,
} from './types';

/**
 * Handle succssful signout
 * 1. Mark is logged out in SessionStorage
 * 2. Unsubscribe from all MQTT topics
 * 3. Update logged in status in Redux
 */
const signOutUserSuccess = (dispatch, getState) => {
  sessionStorage.setItem('isLoggedIn', 'false');
  const topics = getState().chat.subscribedTopics;
  IoT.unsubscribeFromTopics(topics);
  dispatch({ type: CLEAR_SUBSCRIBED_TOPICS });
  dispatch({ type: MESSAGE_HANDLER_ATTACHED, attached: false });
  dispatch({ type: LOGGED_IN_STATUS_CHANGED, loggedIn: false });
  dispatch({ type: LOGOUT });
};

/**
 * 1. Sign out user from Cognito
 * 2. Clear any cached identity data
 */
export const handleSignOut = () => (
  (dispatch, getState) => (
    Cognito.logoutUser()
      .then(() => {
        Cognito.clearCachedId();
        sessionStorage.clear();
        localStorage.clear();
        signOutUserSuccess(dispatch, getState);
      })
  )
);

/**
 * After successful login:
 * 1. Store AWS credentials, provider and token in sessionStorage
 * 2. Stop the loading spinner & Redirect into App
 * 3. Create record of self in Dynamo
 * 4. Add user to local users list
 *
 * @param {Function} dispatch - The dispatch function available on your Redux store
 * @param {object} user - The user object returned from Cognito
 * @param {object} awsCredentials - Object containing aws identity credentials
 * @param {string} awsCredentials.accessKeyId
 * @param {string} awsCredentials.secretAccessKey
 * @param {string} awsCredentials.sessionToken
 * @param {string} provider - Type of identity provider. i.e. 'user_pool', 'google'
 * @param {string} token - Token from identity provider
 */
const loginUserSuccess = (dispatch, user, awsCredentials, provider, token) => {
  sessionStorage.setItem('awsCredentials', JSON.stringify(awsCredentials));
  sessionStorage.setItem('isLoggedIn', 'true');
  sessionStorage.setItem('provider', provider);
  sessionStorage.setItem('providerToken', token);
  dispatch({ type: LOGIN_USER_SUCCESS, user });
  dispatch({ type: LOGGED_IN_STATUS_CHANGED, loggedIn: true });
  const identityId = Cognito.getIdentityId();
  ApiGateway.createUser(user.username)
    .then((createdUser) => {
      log.debug('created user', createdUser);
      dispatch({ type: NEW_USER, identityId, user: createdUser });
    });
};

const loginUserFail = (dispatch, error) => {
  dispatch({ type: LOGIN_USER_FAILED, error });
};

/**
 * This function is used for the case where a user logs in, closes browsers, creates a new account
 * and logs back in.
 * Clears any lingering cached data from previous logins managed by the AWS SDK
 */
const clearCognitoLocalStorage = () => {
  let len = localStorage.length;
  for (let i = 0; i < len; i += 1, len = localStorage.length) {
    const key = localStorage.key(i);
    if (key.includes('CognitoIdentityServiceProvider') || key.includes('aws.cognito.identity')) {
      log.debug('Cleared key from localStorage', key);
      localStorage.removeItem(key);
    }
  }
};

export const loginUser = (username, password) => (
  (dispatch) => {
    dispatch({ type: LOGIN_USER });
    clearCognitoLocalStorage();
    return Cognito.loginUser(username, password)
      .then(userData => loginUserSuccess(dispatch, userData.userObj, userData.awsCredentials, 'user_pool', ''))
      .catch((error) => {
        log.error(error);
        loginUserFail(dispatch, error.message);
      });
  }
);

export const loginUserProvider = (provider, profile, token) => (
  (dispatch) => {
    dispatch({ type: LOGIN_USER });
    return Cognito.getAwsCredentials(token, provider)
      .then((awsCredentials) => {
        // Add a username: key set as the identity's email
        const userObj = Object.assign({ username: profile.email }, profile);
        loginUserSuccess(dispatch, userObj, awsCredentials, provider, token);
      })
      .catch((error) => {
        log.error(error);
        loginUserFail(dispatch, error.message);
      });
  }
);

export const loggedInStatusChanged = loggedIn => ({
  type: LOGGED_IN_STATUS_CHANGED,
  loggedIn,
});

export const authFormUpdate = (prop, value) => ({
  type: AUTH_FORM_UPDATE,
  prop,
  value,
});

const registerUserSuccess = (dispatch, username) => {
  dispatch({ type: REGISTER_USER_SUCCESS, username });
  history.push('/login');
};

const registerUserFail = (dispatch, error) => {
  dispatch({ type: REGISTER_USER_FAILED, error });
};

export const register = (username, password, email) => (
  (dispatch) => {
    dispatch({ type: REGISTER_USER });
    return Cognito.register(username, password, email)
      .then(registeredUsername => registerUserSuccess(dispatch, registeredUsername))
      .catch(error => registerUserFail(dispatch, error.message));
  }
);
