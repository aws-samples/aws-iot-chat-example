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
  main as get,
  USER_NOT_FOUND,
} from '../get';
import * as dynamodb from '../../helpers/dynamodb';

describe('get user', () => {
  jest.mock('../../helpers/dynamodb', () => ({
    call: jest.fn(),
  }));

  const identityId = 'us-west-2:identity-id';
  const now = new Date();
  const username = 'username';
  const item = { identityId, createdAt: now.getTime(), username };

  const event = {
    pathParameters: {
      identityId,
    },
  };
  const context = {};
  let _Date;

  beforeAll(() => {
    _Date = Date;
    global.Date = jest.fn(() => now);
  });

  afterAll(() => {
    global.Date = _Date;
  });

  const getCallReturnsValue = (action, params) => (
    new Promise((resolve) => {
      expect(action).toEqual('get');
      expect(params).toEqual({
        TableName: 'IotChatUsers',
        Key: {
          identityId,
        },
      });
      resolve({ Item: item });
    })
  );

  const getCallDoesNotReturnValue = (action, params) => (
    new Promise((resolve) => {
      expect(action).toEqual('get');
      expect(params).toEqual({
        TableName: 'IotChatUsers',
        Key: {
          identityId,
        },
      });
      resolve({});
    })
  );

  describe('when fetching a user succeeds', () => {
    beforeEach(() => {
      dynamodb.call = jest.fn()
        .mockImplementationOnce(getCallReturnsValue);
    });

    it('should return result', async () => {
      await get(
        event,
        context,
        (error, result) => {
          expect(error).toBeFalsy();
          const body = JSON.parse(result.body);
          expect(body).toEqual(item);
          expect(result.statusCode).toEqual(200);
        },
      );
    });
  });

  describe('when user does not exist', () => {
    beforeEach(() => {
      dynamodb.call = jest.fn()
        .mockImplementationOnce(getCallDoesNotReturnValue);
    });

    it('should return result', async () => {
      await get(
        event,
        context,
        (error, result) => {
          expect(error).toBeFalsy();
          const body = JSON.parse(result.body);
          expect(body.error).toEqual(USER_NOT_FOUND);
          expect(result.statusCode).toEqual(404);
        },
      );
    });
  });

  describe('when a dynamo call fails', () => {
    const errorMsg = 'dynamodb error';
    beforeEach(() => {
      dynamodb.call = () => (
        new Promise((resolve, reject) => {
          reject(errorMsg);
        })
      );
    });

    it('should return an error', async () => {
      await get(
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
