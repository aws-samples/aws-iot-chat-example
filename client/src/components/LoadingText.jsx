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
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';

import { capitalize } from '../lib/topicHelper';

const LoadingText = props => (
  <Header
    size="tiny"
    color={props.condition ? 'teal' : 'red'}
  >
    { props.condition ? '' : `${capitalize(props.verbPresent)} ` }
    {props.children}
    { props.condition ? ` ${props.verbPast}.` : '...' }
  </Header>
);

LoadingText.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]),
  verbPresent: PropTypes.string.isRequired,
  verbPast: PropTypes.string.isRequired,
  condition: PropTypes.bool.isRequired,
};

LoadingText.defaultProps = {
  children: null,
};

export default LoadingText;
