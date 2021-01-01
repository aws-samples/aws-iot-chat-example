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
  main as create,
  INVALID_ROOM_TYPE,
  INVALID_PUBLIC_ROOM,
  INVALID_PRIVATE_ROOM,
  CHAT_ALREADY_EXISTS,
} from '../create';
import * as dynamodb from '../../helpers/dynamodb';

describe('create chat', () => {
  jest.mock('../../helpers/dynamodb', () => ({
    call: jest.fn(),
  }));
  const identityId = 'us-west-2:identity-id';
  const roomName = 'room/public/room1';
  const roomType = 'public';
  const now = new Date();
  const item = {
    admin: identityId,
    createdAt: now.getTime(),
    name: roomName,
    type: roomType,
  };
  const event = {
    requestContext: {
      identity: {
        cognitoIdentityId: identityId,
      },
    },
    body: JSON.stringify({
      roomName,
      type: roomType,
    }),
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
        TableName: 'IotChatChats',
        Key: {
          name: roomName,
        },
      });
      resolve({ Item: item });
    })
  );

  const getCallDoesNotReturnValue = (action, params) => (
    new Promise((resolve) => {
      expect(action).toEqual('get');
      expect(params).toEqual({
        TableName: 'IotChatChats',
        Key: {
          name: roomName,
        },
      });
      resolve({});
    })
  );

  const putCallSucceeds = (action, params) => (
    new Promise((resolve) => {
      expect(action).toEqual('put');
      expect(params).toEqual({
        TableName: 'IotChatChats',
        Item: item,
      });
      resolve();
    })
  );

  describe('request body', () => {
    describe('when room type is invalid', () => {
      const invalidRoomEvent = Object.assign({}, event);
      beforeEach(() => {
        invalidRoomEvent.body = JSON.stringify({
          roomName,
          type: 'invalid-room type',
        });
      });

      it('should error', async () => {
        await create(
          invalidRoomEvent,
          context,
          (error, result) => {
            expect(error).toBeFalsy();
            const body = JSON.parse(result.body);
            expect(body.error).toEqual(INVALID_ROOM_TYPE);
            expect(body.status).toEqual(false);
            expect(result.statusCode).toEqual(400);
          },
        );
      });
    });

    describe('when public room name is invalid', () => {
      const invalidRoomEvent = Object.assign({}, event);
      beforeEach(() => {
        invalidRoomEvent.body = JSON.stringify({
          roomName: 'room/public/room1/room2',
          type: 'public',
        });
      });

      it('should error', async () => {
        await create(
          invalidRoomEvent,
          context,
          (error, result) => {
            expect(error).toBeFalsy();
            const body = JSON.parse(result.body);
            expect(body.error).toEqual(INVALID_PUBLIC_ROOM);
            expect(body.status).toEqual(false);
            expect(result.statusCode).toEqual(400);
          },
        );
      });
    });

    describe('when private room name is invalid', () => {
      const invalidRoomEvent = Object.assign({}, event);
      beforeEach(() => {
        invalidRoomEvent.body = JSON.stringify({
          roomName: 'room/private/room1/room2',
          type: 'private',
        });
      });

      it('should error', async () => {
        await create(
          invalidRoomEvent,
          context,
          (error, result) => {
            expect(error).toBeFalsy();
            const body = JSON.parse(result.body);
            expect(body.error).toEqual(INVALID_PRIVATE_ROOM);
            expect(body.status).toEqual(false);
            expect(result.statusCode).toEqual(400);
          },
        );
      });
    });
  });

  describe('when creating a new chat', () => {
    beforeEach(() => {
      dynamodb.call = jest.fn()
        .mockImplementationOnce(getCallDoesNotReturnValue)
        .mockImplementationOnce(putCallSucceeds)
        .mockImplementationOnce(getCallReturnsValue);
    });

    it('should return results', async () => {
      await create(
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

  describe('when chat already exists', () => {
    beforeEach(() => {
      dynamodb.call = jest.fn()
        .mockImplementationOnce(getCallReturnsValue);
    });

    it('should return error', async () => {
      await create(
        event,
        context,
        (error, result) => {
          expect(error).toBeFalsy();
          const body = JSON.parse(result.body);
          expect(body.error).toEqual(CHAT_ALREADY_EXISTS);
          expect(body.status).toEqual(false);
          expect(result.statusCode).toEqual(400);
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
      await create(
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
