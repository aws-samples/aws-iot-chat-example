/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import React from 'react';
import { shallow } from 'enzyme';

import { RoomCard } from '../RoomCard';

describe('RoomCard', () => {
  const props = {
    chat: {
      name: 'room/public/room-name',
      type: 'public',
      admin: 'cognitoId',
      createdAt: 1509492842812,
    },
    unreadCount: 3,
    subscribed: true,
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<RoomCard {...props} />);
  });

  it('renders without crashing', () => {
    expect(wrapper).toHaveLength(1);
  });
});
