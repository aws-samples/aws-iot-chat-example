/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import reducer, { initialState } from '../authReducer';
import * as types from '../../actions/types';

describe('auth reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle LOGIN_USER', () => {
    expect(
      reducer(
        { loading: false, error: 'incorrect password', notice: 'success' },
        { type: types.LOGIN_USER },
      ),
    ).toEqual(
      { loading: true, error: '', notice: '' },
    );
  });

  it('should handle LOGIN_USER_SUCCESS', () => {
    expect(
      reducer(
        { loading: false, error: 'incorrect password', notice: 'success' },
        { type: types.LOGIN_USER_SUCCESS, user: { email: 'test@test.com' } },
      ),
    ).toEqual(
      { ...initialState, user: { email: 'test@test.com' } },
    );
  });

  describe('when error passed in', () => {
    it('should handle LOGIN_USER_FAILED', () => {
      expect(
        reducer(
          { loading: true, error: 'incorrect password', password: 'password' },
          { type: types.LOGIN_USER_FAILED, error: 'error occurred' },
        ),
      ).toEqual(
        { loading: false, error: 'error occurred', password: '' },
      );
    });
  });

  describe('when no error passed in', () => {
    it('should handle LOGIN_USER_FAILED', () => {
      expect(
        reducer(
          { loading: true, error: 'incorrect password', password: 'password' },
          { type: types.LOGIN_USER_FAILED },
        ),
      ).toEqual(
        { loading: false, error: 'Authentication Failed', password: '' },
      );
    });
  });

  it('should handle LOGGED_IN_STATUS_CHANGED', () => {
    expect(
      reducer(
        { loggedIn: false },
        { type: types.LOGGED_IN_STATUS_CHANGED, loggedIn: true },
      ),
    ).toEqual(
      { loggedIn: true },
    );
  });

  it('should handle AUTH_FORM_UPDATE', () => {
    expect(
      reducer(
        { username: 'iron man' },
        { type: types.AUTH_FORM_UPDATE, prop: 'username', value: 'captain america' },
      ),
    ).toEqual(
      { username: 'captain america' },
    );
  });

  it('should handle REGISTER_USER', () => {
    expect(
      reducer(
        { loading: false, error: 'incorrect password', notice: 'success' },
        { type: types.REGISTER_USER },
      ),
    ).toEqual(
      { loading: true, error: '', notice: '' },
    );
  });

  it('should handle REGISTER_USER_SUCCESS', () => {
    expect(
      reducer(
        { loading: false, error: 'incorrect password', notice: 'success' },
        { type: types.REGISTER_USER_SUCCESS, username: 'thor' },
      ),
    ).toEqual(
      { ...initialState, username: 'thor', notice: 'Registration successful. Please sign in' },
    );
  });

  describe('when error passed in', () => {
    it('should handle REGISTER_USER_FAILED', () => {
      expect(
        reducer(
          { loading: true, error: 'incorrect password', password: 'password' },
          { type: types.REGISTER_USER_FAILED, error: 'error occurred' },
        ),
      ).toEqual(
        { ...initialState, error: 'error occurred' },
      );
    });
  });

  describe('when no error passed in', () => {
    it('should handle REGISTER_USER_FAILED', () => {
      expect(
        reducer(
          { loading: true, error: 'incorrect password', password: 'password' },
          { type: types.REGISTER_USER_FAILED },
        ),
      ).toEqual(
        { ...initialState, error: 'Registration Failed' },
      );
    });
  });

  it('should handle IDENTITY_UPDATED', () => {
    expect(
      reducer(
        {},
        { type: types.IDENTITY_UPDATED, identityId: 'identity-id' },
      ),
    ).toEqual(
      { identityId: 'identity-id' },
    );
  });


  it('should handle LOGOUT', () => {
    expect(
      reducer(
        { loading: true, error: 'incorrect password', password: 'password' },
        { type: types.LOGOUT },
      ),
    ).toEqual(
      initialState,
    );
  });
});
