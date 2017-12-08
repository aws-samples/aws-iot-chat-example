/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Router, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import PrivateRoute from './PrivateRoute';
import App from '../App';
import history from '../../lib/history';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import { loggedInStatusChanged } from '../../actions/authActions';

/**
 * Router component in charge of navigation when not signed in
 */
export class RootRouter extends Component {
  componentWillMount() {
    this.validateUserSession();
  }

  /**
   * Check browser sessionStorage to check logged in status
   */
  validateUserSession() {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      this.props.loggedInStatusChanged(true);
    } else {
      this.props.loggedInStatusChanged(false);
    }
  }

  render() {
    const { loggedIn } = this.props;

    return (
      <Router history={history}>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route
            path="/register"
            exact
            component={Register}
          />
          <PrivateRoute authStatus={loggedIn} path="/" component={App} />
        </Switch>
      </Router>
    );
  }
}

RootRouter.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  loggedInStatusChanged: PropTypes.func.isRequired,
};

const mapStateToProps = state => (
  { loggedIn: state.auth.loggedIn }
);

export default connect(mapStateToProps, { loggedInStatusChanged })(RootRouter);
