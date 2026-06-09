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
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import * as log from 'loglevel';

import SocialButton from './SocialButton';
import { loginUserProvider } from '../../actions/authActions';
import Config from '../../config';

/**
 * UI Component to render social login buttons
 */
export const SocialLogins = props => (
  <div>
    { props.showFacebook &&
      <SocialButton
        provider="facebook"
        appId={Config.socialFacebookAppId}
        color="facebook"
        fluid
        hidden={props.showFacebook}
        onLoginSuccess={(resp) => {
          props.loginUserProvider(resp.provider, resp.profile, resp.token.accessToken);
        }}
        onLoginFailure={(resp) => { log.error(resp); }}
      >
        <Icon name="facebook" />
        Login with Facebook
      </SocialButton>
    }
    { props.showGoogle &&
      <SocialButton
        provider="google"
        appId={Config.socialGoogleClientId}
        color="google plus"
        fluid
        onLoginSuccess={(resp) => {
          props.loginUserProvider(resp.provider, resp.profile, resp.token.idToken);
        }}
        onLoginFailure={(resp) => {
          log.error(resp);
        }}
      >
        <Icon name="google" />
        Login with Google
      </SocialButton>
    }
    { props.showAmazon &&
      <SocialButton
        provider="amazon"
        color="yellow"
        fluid
        appId={Config.socialAmazonAppId}
        onLoginSuccess={(resp) => {
          props.loginUserProvider(resp.provider, resp.profile, resp.token.accessToken);
        }}
        onLoginFailure={(resp) => { log.error(resp); }}
      >
        <Icon name="amazon" />
        Login with Amazon
      </SocialButton>
    }
  </div>
);

SocialLogins.propTypes = {
  loginUserProvider: PropTypes.func.isRequired,
  showFacebook: PropTypes.bool,
  showGoogle: PropTypes.bool,
  showAmazon: PropTypes.bool,
};

SocialLogins.defaultProps = {
  showFacebook: false,
  showGoogle: false,
  showAmazon: false,
};

export default connect(null, { loginUserProvider })(SocialLogins);
