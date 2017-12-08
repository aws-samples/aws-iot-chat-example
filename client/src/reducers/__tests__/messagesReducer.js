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

import reducer, { initialState } from '../messagesReducer';
import * as types from '../../actions/types';

describe('messages reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle NEW_MESSAGE', () => {
    const messageTime = moment('20171024');
    expect(
      reducer(
        [],
        {
          type: types.NEW_MESSAGE,
          username: 'bob',
          time: messageTime,
          message: 'sample text',
          id: '0',
        },
      ),
    ).toEqual(
      [
        {
          author: 'bob',
          time: messageTime,
          text: 'sample text',
          id: '0',
        },
      ],
    );
  });
});
