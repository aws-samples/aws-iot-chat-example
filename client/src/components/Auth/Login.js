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
import { connect } from 'react-redux';
import { Button, Container, Divider, Form, Message, Header, Segment } from 'semantic-ui-react';
import { Redirect, Link } from 'react-router-dom';

import {
  authFormUpdate,
  loginUser,
  loggedInStatusChanged,
} from '../../actions/authActions';
import SocialLogins from './SocialLogins';

const styles = {
  container: {
    marginTop: '7em',
  },
};

/**
 * Component responsible for rendering login form
 */
export class Login extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.validateUserSession();
  }

  handleSubmit() {
    const { username, password } = this.props;
    this.props.loginUser(username, password);
  }

  handleChange(e, { name, value }) {
    this.props.authFormUpdate(name, value);
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
    const { error, loading, username, password, loggedIn, notice } = this.props;

    if (loggedIn) {
      const { from } = this.props.location.state || { from: { pathname: '/app' } };
      return (
        <Redirect to={from} />
      );
    }

    return (
      <Container style={styles.container}>
        <Header as="h1">Login</Header>
        <Message
          info
          header={notice}
          hidden={notice === ''}
        />
        <Message
          warning
          header={error}
          hidden={error === ''}
        />
        <Form loading={loading}>
          <Form.Field>
            <Form.Input
              label="Username"
              placeholder="username"
              name="username"
              value={username}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label="Password"
              placeholder="password"
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Segment padded>
            <Button color="teal" fluid type="submit" onClick={this.handleSubmit}>Login</Button>
            <Divider horizontal>Or</Divider>
            <Link to="/register"><Button secondary fluid>Sign Up Now</Button></Link>
            <SocialLogins showFacebook showGoogle />
          </Segment>
        </Form>
      </Container>
    );
  }
}

Login.propTypes = {
  authFormUpdate: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  loginUser: PropTypes.func.isRequired,
  notice: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  loggedInStatusChanged: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    state: PropTypes.object,
  }).isRequired,
};

const mapStateToProps = ({ auth }) => {
  const { username, password, error, loading, loggedIn, notice } = auth;
  return { username, password, error, loading, loggedIn, notice };
};

export default connect(
  mapStateToProps,
  {
    authFormUpdate,
    loginUser,
    loggedInStatusChanged,
  },
)(Login);
