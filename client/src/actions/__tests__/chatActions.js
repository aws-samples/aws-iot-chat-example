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

import * as actions from '../chatActions';
import * as types from '../types';
import * as IoT from '../../lib/aws-iot';
import * as ApiGateway from '../../lib/api-gateway';

describe('Chat Actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  describe('messagetoSendChanged', () => {
    it('should create an action to change the reply form value', () => {
      const message = 'message';
      const expectedAction = {
        type: types.MESSAGE_TO_SEND_CHANGED,
        messageToSend: message,
      };

      expect(actions.messageToSendChanged(message)).toEqual(expectedAction);
    });
  });

  describe('subscribeToTopic', () => {
    beforeEach(() => {
      IoT.subscribe = jest.fn();
    });

    it('should not subscribe if topic is already subscribed to', () => {
      const expectedActions = [];
      const store = mockStore({ chat: { subscribedTopics: ['topic'] } });

      return store.dispatch(actions.subscribeToTopic('topic')).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should dispatch subscribed topic action if topic is not yet subscribed to', () => {
      const expectedActions = [
        { type: types.ADD_SUBSCRIBED_TOPIC, topic: 'topic' },
      ];
      const store = mockStore({ chat: { subscribedTopics: [] } });

      return store.dispatch(actions.subscribeToTopic('topic')).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('fetchAllChats', () => {
    const chats = [
      { name: 'room/public/room1' },
      { name: 'room/public/room2' },
    ];

    beforeEach(() => {
      ApiGateway.fetchAllChats = () => Promise.resolve(chats);
    });

    it('should dispatch fetching and receiving chats actions', () => {
      const expectedActions = [
        { type: types.FETCHING_CHATS },
        { type: types.RECEIVE_CHATS, chats },
      ];

      const store = mockStore({});

      return store.dispatch(actions.fetchAllChats()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('createChat', () => {
    const chat = { name: 'room/public/room1' };

    describe('success', () => {
      beforeEach(() => {
        ApiGateway.createChat = () => Promise.resolve(chat);
      });

      it('should create a chat', () => {
        const expectedActions = [
          { type: types.CREATING_CHAT },
          { type: types.ADD_CHAT, chat },
        ];

        const store = mockStore({});

        return store.dispatch(actions.createChat()).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });

    describe('fail', () => {
      const errMsg = 'could not create chat';

      beforeEach(() => {
        const response = { message: JSON.stringify({ error: errMsg }) };
        ApiGateway.createChat = () => Promise.reject(response);
      });

      it('should dispatch a fail message', () => {
        const expectedActions = [
          { type: types.CREATING_CHAT },
          { type: types.CHAT_ERROR, error: errMsg },
        ];

        const store = mockStore({});

        return store.dispatch(actions.createChat()).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });

  describe('readChat', () => {
    it('should mark the topic as read', () => {
      const topic = 'topic1';
      const expectedActions = [
        { type: types.RESET_UNREADS, room: topic },
      ];
      const store = mockStore({ unreads: { [topic]: 4 } });

      return store.dispatch(actions.readChat(topic)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
