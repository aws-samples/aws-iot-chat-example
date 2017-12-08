/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import * as TopicHelper from '../topicHelper';

describe('TopicHelper', () => {
  describe('topicFromParams', () => {
    it('formats topic based on room type and name', () => {
      expect(TopicHelper.topicFromParams({ roomType: 'public', roomName: 'room1' })).toBe('room/public/room1');
    });
  });

  describe('capitalize', () => {
    it('capitalizes a string', () => {
      expect(TopicHelper.capitalize('string')).toBe('String');
    });
  });

  describe('formatRoomCardHeader', () => {
    it('formats topic correctly', () => {
      expect(TopicHelper.formatRoomCardHeader('room/public/my-awesome-room')).toBe('My Awesome Room');
    });
  });

  describe('identityIdFromNewMessageTopic', () => {
    it('returns the identityId', () => {
      expect(TopicHelper.identityIdFromNewMessageTopic('room/public/my-awesome-room/us-west:123456789abcdef')).toBe('us-west:123456789abcdef');
    });
  });

  describe('roomFromNewMessageTopic', () => {
    it('returns the topic without the identityId', () => {
      expect(TopicHelper.roomFromNewMessageTopic('room/public/my-awesome-room/us-west:123456789abcdef')).toBe('room/public/my-awesome-room');
    });
  });

  describe('topicFromSubscriptionTopic', () => {
    it('returns the topic without the tailing /+', () => {
      expect(TopicHelper.topicFromSubscriptionTopic('room/public/my-awesome-room/+')).toBe('room/public/my-awesome-room');
    });
  });
});
