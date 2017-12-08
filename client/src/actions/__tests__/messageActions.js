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
import MockDate from 'mockdate';
import moment from 'moment';

import * as actions from '../messageActions';
import * as types from '../types';
import * as ApiGateway from '../../lib/api-gateway';

describe('Message Actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  beforeAll(() => {
    MockDate.set(1511225621);
  });

  afterAll(() => {
    MockDate.reset();
  });

  describe('newMessage', () => {
    const message = 'message body';
    const username = 'username';
    const id = expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    const room = 'room/public/room1';
    const identityId = 'us-west-:12345';
    const topic = 'room/public/room1/us-west-:12345';
    const user = {
      username,
    };

    beforeEach(() => {
    });

    describe('when the user is already in cache', () => {
      it('the new message action is dispatched immediately', () => {
        const time = moment();
        const expectedActions = [
          { type: types.NEW_MESSAGE, message, username, time, id, room },
        ];

        const store = mockStore({
          users: {
            [identityId]: user,
          },
        });

        return store.dispatch(actions.newMessage(message, topic)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });

    describe('when the user is not in the cache', () => {
      beforeEach(() => {
        ApiGateway.fetchUser = () => Promise.resolve(user);
      });

      it('should fetch the user from API', () => {
        const time = moment();
        const expectedActions = [
          { type: types.FETCHING_USER },
          { type: types.NEW_USER, identityId, user },
          { type: types.NEW_MESSAGE, message, username, time, id, room },
        ];

        const store = mockStore({ users: {} });

        return store.dispatch(actions.newMessage(message, topic)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });
});
