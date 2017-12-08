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
import moment from 'moment';
import uuid from 'uuid/v4';

import { MessageHistory, mapStateToProps } from '../MessageHistory';
import Message from '../Message';

describe('MessageHistory', () => {
  const props = {
    messages: [
      { id: uuid(), author: 'bob', time: moment(), text: 'msg1' },
      { id: uuid(), author: 'sally', time: moment(), text: 'msg2' },
    ],
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<MessageHistory {...props} />);
  });

  it('renders a <Message> for each message', () => {
    expect(wrapper.dive().find(Message)).toHaveLength(2);
  });

  describe('mapStateToProps', () => {
    const ownProps = {
      match: {
        params: {
          roomType: 'public',
          roomName: 'room1',
        },
      },
    };

    const message = {
      author: 'bob',
      text: 'message body',
    };

    const state = {
      rooms: {
        'room/public/room1': {
          messages: [message],
        },
      },
    };

    expect(mapStateToProps(state, ownProps)).toEqual({ messages: [message] });
  });
});
