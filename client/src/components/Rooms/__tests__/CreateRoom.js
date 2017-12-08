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
import { Form } from 'semantic-ui-react';

import { CreateRoom } from '../CreateRoom';

describe('CreateRoom', () => {
  const props = {
    createChat: jest.fn(),
    creatingChat: false,
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<CreateRoom {...props} />);
  });

  it('renders without crashing', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('creates chat with sanitized room name', () => {
    const mockEvent = { preventDefault: jest.fn() };
    wrapper.find('#create_room_name').simulate('change', null, { name: 'name', value: 'Name/ with $ special Characters! 3' });
    wrapper.find(Form).simulate('submit', mockEvent);
    expect(props.createChat).toHaveBeenCalledWith('name-with-special-characters-3', 'public');
  });
});
