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
import { Button, List, Message, Divider, Segment, Container, Form, Header, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { register, authFormUpdate } from '../../actions/authActions';

const styles = {
  container: {
    marginTop: '7em',
  },
};

/**
 * Component responsible for rendering the register form
 */
export class Register extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, password, email } = this.props;
    this.props.register(username, password, email);
  }

  handleChange(e, { name, value }) {
    this.props.authFormUpdate(name, value);
  }

  render() {
    const {
      username,
      password,
      email,
      error,
      notice,
      loading,
    } = this.props;

    return (
      <Container style={styles.container}>
        <Header as="h1">Register</Header>
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
              value={username}
              name="username"
              onChange={this.handleChange}
            />
          </Form.Field>
          <Popup
            trigger={
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
            }
            position="bottom left"
            flowing
          >
            <List bulleted>
              <List.Item>Password must have at least 1 number</List.Item>
              <List.Item>Password must have at least 1 special character</List.Item>
              <List.Item>Password must have at least 1 uppercase letter</List.Item>
              <List.Item>Password must have at least 1 lowercase letter</List.Item>
            </List>
          </Popup>
          <Form.Field>
            <Form.Input
              label="Email"
              placeholder="email"
              type="email"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Segment padded>
            <Button color="teal" fluid type="submit" onClick={this.handleSubmit}>Register</Button>
            <Divider horizontal>Or</Divider>
            <Link to="/login"><Button secondary fluid>Login</Button></Link>
          </Segment>
        </Form>
      </Container>
    );
  }
}

Register.propTypes = {
  register: PropTypes.func.isRequired,
  authFormUpdate: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  notice: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ auth }) => {
  const {
    username,
    password,
    email,
    error,
    notice,
    loading,
  } = auth;
  return {
    username,
    password,
    email,
    error,
    notice,
    loading,
  };
};

export default connect(mapStateToProps, { authFormUpdate, register })(Register);
