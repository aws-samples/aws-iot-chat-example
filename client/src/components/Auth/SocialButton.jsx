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
import { PropTypes } from 'prop-types';
import SocialLogin from 'react-social-login';
import { Button } from 'semantic-ui-react';

/**
 * UI Component that wraps react-social-login
 */
const SocialButton = ({ children, triggerLogin, ...props }) => (
  <Button
    onClick={triggerLogin}
    {...props}
  >
    { children }
  </Button>
);

SocialButton.defaultProps = {
  children: null,
};

SocialButton.propTypes = {
  children: PropTypes.node,
  triggerLogin: PropTypes.func.isRequired,
};

export default SocialLogin(SocialButton);
