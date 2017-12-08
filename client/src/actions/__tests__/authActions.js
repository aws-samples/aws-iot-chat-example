/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from '../authActions';
import * as types from '../types';
import * as Cognito from '../../lib/aws-cognito';
import * as ApiGateway from '../../lib/api-gateway';
import * as IoT from '../../lib/aws-iot';

describe('Auth Actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const username = 'username';
  const password = 'password';
  const email = 'test@test.com';
  const errMsg = 'error message';

  describe('loggedInStatusChanged', () => {
    it('should create an action to change log in status', () => {
      const expectedAction = {
        type: types.LOGGED_IN_STATUS_CHANGED,
        loggedIn: true,
      };

      expect(actions.loggedInStatusChanged(true)).toEqual(expectedAction);
    });
  });

  describe('authFormUpdate', () => {
    it('should create an action to change an auth form prop value', () => {
      const expectedAction = {
        type: types.AUTH_FORM_UPDATE,
        prop: username,
        value: 'username1',
      };

      expect(actions.authFormUpdate(username, 'username1')).toEqual(expectedAction);
    });
  });

  describe('register', () => {
    describe('success', () => {
      beforeEach(() => {
        Cognito.register = () => Promise.resolve('username');
      });

      it('should register user with Cognito and dispatch success action', () => {
        const expectedActions = [
          { type: types.REGISTER_USER },
          { type: types.REGISTER_USER_SUCCESS, username },
        ];

        const store = mockStore({});

        return store.dispatch(actions.register(username, password, email)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });

    describe('fail', () => {
      beforeEach(() => {
        Cognito.register = () => Promise.reject(new Error(errMsg));
      });

      it('should dispatch fail action', () => {
        const expectedActions = [
          { type: types.REGISTER_USER },
          { type: types.REGISTER_USER_FAILED, error: errMsg },
        ];

        const store = mockStore({});

        return store.dispatch(actions.register(username, password, email)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });

  describe('loginUserProvider', () => {
    describe('success', () => {
      const accessKeyId = 'access-key-id';
      const secretAccessKey = 'secret-access-key';
      const sessionToken = 'session-token';
      const identityId = 'identity-id';
      const profile = { email };

      beforeEach(() => {
        Cognito.getAwsCredentials = () => (
          Promise.resolve({ accessKeyId, secretAccessKey, sessionToken })
        );
        Cognito.getIdentityId = () => identityId;
        ApiGateway.createUser = () => Promise.resolve(profile);
      });

      it('should log in user with Cognito and dispatch success action', () => {
        const provider = 'provider';
        const token = 'token';

        const expectedActions = [
          { type: types.LOGIN_USER },
          { type: types.LOGIN_USER_SUCCESS, user: { email, username: email } },
          { type: types.LOGGED_IN_STATUS_CHANGED, loggedIn: true },
          { type: types.NEW_USER, identityId, user: profile },
        ];

        const store = mockStore({});

        return store.dispatch(actions.loginUserProvider(provider, profile, token)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });

  describe('fail', () => {
    beforeEach(() => {
      Cognito.getAwsCredentials = () => Promise.reject(new Error(errMsg));
    });

    it('should dipsatch fail action', () => {
      const provider = 'provider';
      const token = 'token';
      const profile = { email };

      const expectedActions = [
        { type: types.LOGIN_USER },
        { type: types.LOGIN_USER_FAILED, error: errMsg },
      ];

      const store = mockStore({});

      return store.dispatch(actions.loginUserProvider(provider, profile, token)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('loginUser', () => {
    describe('success', () => {
      const identityId = 'identity-id';
      const profile = { email };

      beforeEach(() => {
        Cognito.loginUser = () => Promise.resolve({ userObj: profile }); // userData
        Cognito.getIdentityId = () => identityId;
        ApiGateway.createUser = () => Promise.resolve(profile);
        localStorage.clear();
        localStorage.setItem('aws.cognito.identity', true);
      });

      afterEach(() => {
        localStorage.clear();
      });

      it('should log in user with Cognito and dispatch success action', () => {
        const expectedActions = [
          { type: types.LOGIN_USER },
          { type: types.LOGIN_USER_SUCCESS, user: profile },
          { type: types.LOGGED_IN_STATUS_CHANGED, loggedIn: true },
          { type: types.NEW_USER, identityId, user: profile },
        ];

        const store = mockStore({});

        return store.dispatch(actions.loginUser(username, password)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('should clear existing local storage key value pairs', () => {
        const store = mockStore({});

        return store.dispatch(actions.loginUser(username, password)).then(() => {
          expect(localStorage.getItem('aws.cognito.identity')).toBe(null);
        });
      });
    });

    describe('fail', () => {
      beforeEach(() => {
        Cognito.loginUser = () => Promise.reject(new Error(errMsg));
      });

      it('should dispatch fail action', () => {
        const expectedActions = [
          { type: types.LOGIN_USER },
          { type: types.LOGIN_USER_FAILED, error: errMsg },
        ];

        const store = mockStore({});

        return store.dispatch(actions.loginUser(username, password)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });

  describe('handleSignOut', () => {
    const topics = ['topic1', 'topic2'];

    beforeEach(() => {
      IoT.unsubscribeFromTopics = jest.fn();
      Cognito.logoutUser = () => Promise.resolve();
      Cognito.clearCachedId = () => jest.fn();
      localStorage.setItem('key', 'value');
      sessionStorage.setItem('isLoggedIn', 'true');
    });

    afterEach(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    it('should clear storage except for isLoggedIn', () => {
      const store = mockStore({ chat: { subscribedTopics: topics } });

      return store.dispatch(actions.handleSignOut()).then(() => {
        expect(localStorage.getItem('key')).toBe(null);
        expect(sessionStorage.getItem('isLoggedIn')).toBe('false');
      });
    });

    it('should dispatch success actions', () => {
      const expectedActions = [
        { type: types.CLEAR_SUBSCRIBED_TOPICS },
        { type: types.MESSAGE_HANDLER_ATTACHED, attached: false },
        { type: types.LOGGED_IN_STATUS_CHANGED, loggedIn: false },
        { type: types.LOGOUT },
      ];

      const store = mockStore({ chat: { subscribedTopics: topics } });

      return store.dispatch(actions.handleSignOut()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
