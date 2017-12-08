/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import reducer, { initialState } from '../chatReducer';
import * as types from '../../actions/types';

describe('chat reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle MESSAGE_TO_SEND_CHANGED', () => {
    expect(
      reducer(
        { messageToSend: '' },
        { type: types.MESSAGE_TO_SEND_CHANGED, messageToSend: 'new message' },
      ),
    ).toEqual(
      { messageToSend: 'new message' },
    );
  });

  it('should handle ADD_SUBSCRIBED_TOPIC', () => {
    expect(
      reducer(
        { subscribedTopics: ['topic1'] },
        { type: types.ADD_SUBSCRIBED_TOPIC, topic: 'topic2' },
      ),
    ).toEqual(
      { subscribedTopics: ['topic1', 'topic2'] },
    );
  });

  it('should handle CLEAR_SUBSCRIBED_TOPICS', () => {
    expect(
      reducer(
        { subscribedTopics: ['topic1', 'topic2'] },
        { type: types.CLEAR_SUBSCRIBED_TOPICS },
      ),
    ).toEqual(
      { subscribedTopics: [] },
    );
  });

  it('should handle FETCHING_CHATS', () => {
    expect(
      reducer(
        { loadingChats: false },
        { type: types.FETCHING_CHATS },
      ),
    ).toEqual(
      { loadingChats: true },
    );
  });

  it('should handle RECEIVE_CHATS', () => {
    const testChats = [{ name: 'room/public/room1' }, { name: 'room/public/room2' }];
    expect(
      reducer(
        { allChats: [], loadingChats: true },
        { type: types.RECEIVE_CHATS, chats: testChats },
      ),
    ).toEqual(
      { loadingChats: false, allChats: testChats },
    );
  });

  it('should handle CREATING_CHAT', () => {
    expect(
      reducer(
        { creatingChat: false, error: 'old error' },
        { type: types.CREATING_CHAT },
      ),
    ).toEqual(
      { creatingChat: true, error: '' },
    );
  });

  it('should handle ADD_CHAT', () => {
    const testChats = [{ name: 'room/public/room1' }, { name: 'room/public/room2' }];
    expect(
      reducer(
        { allChats: testChats, creatingChat: true },
        { type: types.ADD_CHAT, chat: { name: 'room/public/room3' } },
      ),
    ).toEqual(
      { creatingChat: false, allChats: [...testChats, { name: 'room/public/room3' }] },
    );
  });

  it('should handle CHAT_ERROR', () => {
    expect(
      reducer(
        { error: '' },
        { type: types.CHAT_ERROR, error: 'new error' },
      ),
    ).toEqual(
      { error: 'new error' },
    );
  });

  it('should handle LOGOUT', () => {
    expect(
      reducer(
        { messageToSend: 'msg', subscribedTopics: ['topic1'], allChats: ['topic1', 'topic2'], loadingChats: true, creatingChat: true, error: 'error' },
        { type: types.LOGOUT },
      ),
    ).toEqual(
      initialState,
    );
  });

  it('should handle FETCHING_USER', () => {
    expect(
      reducer(
        { fetchingUser: false },
        { type: types.FETCHING_USER },
      ),
    ).toEqual(
      { fetchingUser: true },
    );
  });

  it('should handle NEW_USER', () => {
    expect(
      reducer(
        { fetchingUser: true },
        { type: types.NEW_USER },
      ),
    ).toEqual(
      { fetchingUser: false },
    );
  });
});
