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

import { Register } from '../Register';

describe('Register', () => {
  let wrapper;

  const props = {
    register: jest.fn(),
    authFormUpdate: jest.fn(),
    username: 'username',
    password: 'password',
    email: 'email@test.com',
    notice: '',
    error: '',
    loading: false,
  };

  beforeEach(() => {
    wrapper = shallow(<Register {...props} />);
  });

  it('renders without crashing', () => {
    expect(wrapper).toHaveLength(1);
  });
});
