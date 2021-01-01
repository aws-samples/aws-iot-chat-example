/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import { main as list } from '../list';
import * as dynamodb from '../../helpers/dynamodb';

describe('list chats', () => {
  jest.mock('../../helpers/dynamodb', () => ({
    call: jest.fn(),
  }));

  const item = {
    admin: 'identity-id',
    createdAt: 1508877096991,
    name: 'room/public/room1',
    type: 'public',
  };

  describe('when dynamo call succeeds', () => {
    beforeEach(() => {
      dynamodb.call = (action, params) => (
        new Promise((resolve) => {
          expect(action).toEqual('scan');
          expect(params).toEqual({
            TableName: 'IotChatChats',
          });
          resolve({ Items: [item] });
        })
      );
    });

    it('should return results', async () => {
      const event = {};
      const context = {};

      await list(
        event,
        context,
        (error, result) => {
          expect(error).toBeFalsy();
          const body = JSON.parse(result.body);
          expect(body).toEqual([item]);
          expect(result.statusCode).toEqual(200);
        },
      );
    });
  });

  describe('when dynamo call fails', () => {
    const errorMsg = 'dynamodb error';
    beforeEach(() => {
      dynamodb.call = () => (
        new Promise((resolve, reject) => {
          reject(errorMsg);
        })
      );
    });

    it('should return an error', async () => {
      const event = {};
      const context = {};

      await list(
        event,
        context,
        (error, result) => {
          expect(error).toBeFalsy();
          const body = JSON.parse(result.body);
          expect(body.error).toEqual(errorMsg);
          expect(body.status).toEqual(false);
          expect(result.statusCode).toEqual(500);
        },
      );
    });
  });
});
