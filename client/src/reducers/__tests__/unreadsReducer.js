/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import reducer, { initialState } from '../unreadsReducer';
import * as types from '../../actions/types';

describe('unreads reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('when unread count is undefined', () => {
    const room = 'room/public/my-awesome-room';
    it('should handle NEW_MESSAGE', () => {
      expect(
        reducer(
          {},
          {
            type: types.NEW_MESSAGE,
            room,
          },
        ),
      ).toEqual(
        {
          [room]: 1,
        },
      );
    });
  });

  describe('when unread count is not 0', () => {
    const room = 'room/public/my-awesome-room';
    it('should handle NEW_MESSAGE', () => {
      expect(
        reducer(
          {
            [room]: 5,
          },
          {
            type: types.NEW_MESSAGE,
            room,
          },
        ),
      ).toEqual(
        {
          [room]: 6,
        },
      );
    });
  });

  it('should handle RESET_UNREADS', () => {
    const room = 'room/public/my-awesome-room';
    expect(
      reducer(
        {
          [room]: 5,
        },
        {
          type: types.RESET_UNREADS,
          room,
        },
      ),
    ).toEqual(
      {
        [room]: 0,
      },
    );
  });
});
