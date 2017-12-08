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
import { Link, Switch, Route } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';

import Chat from './Chat/Chat';
import Rooms from './Rooms/Rooms';
import Spinner from './Spinner';
import { handleSignOut, loggedInStatusChanged } from '../actions/authActions';
import * as IoT from '../lib/aws-iot';
import { acquirePublicPolicies, deviceConnectedStatusChanged, attachMessageHandler } from '../actions/iotActions';
import RootRouter from './Routers/RootRouter';

const styles = {
  container: {
    marginTop: '7em',
  },
};

/**
 * Entry component to the authenticated portion of the app
 */
export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enterApp: false,
    };
    this.signOut = this.signOut.bind(this);
  }

  componentWillMount() {
    this.validateUserSession();
  }

  componentDidMount() {
    const connectCallback = () => this.props.deviceConnectedStatusChanged(true);
    const closeCallback = () => this.props.deviceConnectedStatusChanged(false);
    this.props.acquirePublicPolicies(connectCallback, closeCallback);
  }

  componentWillReceiveProps(nextProps) {
    const {
      connectPolicy,
      publicPublishPolicy,
      publicSubscribePolicy,
      publicReceivePolicy,
      deviceConnected,
      identityId,
    } = nextProps;

    if (connectPolicy &&
      publicPublishPolicy &&
      publicSubscribePolicy &&
      publicReceivePolicy &&
      deviceConnected) {
      // Ping to test connection
      const topic = `room/public/ping/${identityId}`;
      IoT.publish(topic, JSON.stringify({ message: 'connected' }));
      // Attach message handler if not yet attached
      this.props.attachMessageHandler();
      this.setState({
        enterApp: true,
      });
    }
  }

  validateUserSession() {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      this.props.loggedInStatusChanged(true);
    } else {
      this.props.loggedInStatusChanged(false);
    }
  }

  signOut(e) {
    e.preventDefault();
    this.props.handleSignOut();
  }

  renderPageBody() {
    // If we have acquired the necessary policies, render desired page
    if (this.state.enterApp) {
      return (
        <Container style={styles.container}>
          <Switch>
            <Route path="/app/room/:roomType/:roomName" component={Chat} />
            <Route exact path="/app/rooms" component={Rooms} />
            <Route path="/" component={Rooms} />
          </Switch>
        </Container>
      );
    }

    // Otherwise display a loading spinner until API calls have succeeded
    return (
      <Route
        path="/"
        component={Spinner}
      />
    );
  }

  render() {
    const { loggedIn } = this.props;
    if (!loggedIn) {
      return (<RootRouter />);
    }

    return (
      <div>
        <Menu
          fixed="top"
        >
          <Menu.Item><Link to="/app/rooms">Rooms</Link></Menu.Item>
          <Menu.Item onClick={this.signOut}>Log out</Menu.Item>
        </Menu>
        { this.renderPageBody() }
      </div>
    );
  }
}

App.propTypes = {
  handleSignOut: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  loggedInStatusChanged: PropTypes.func.isRequired,
  acquirePublicPolicies: PropTypes.func.isRequired,
  connectPolicy: PropTypes.bool.isRequired,
  publicPublishPolicy: PropTypes.bool.isRequired,
  publicSubscribePolicy: PropTypes.bool.isRequired,
  publicReceivePolicy: PropTypes.bool.isRequired,
  deviceConnected: PropTypes.bool.isRequired,
  deviceConnectedStatusChanged: PropTypes.func.isRequired,
  identityId: PropTypes.string.isRequired,
  attachMessageHandler: PropTypes.func.isRequired,
};

const mapStateToProps = (state => ({
  loggedIn: state.auth.loggedIn,
  connectPolicy: state.iot.connectPolicy,
  publicPublishPolicy: state.iot.publicPublishPolicy,
  publicSubscribePolicy: state.iot.publicSubscribePolicy,
  publicReceivePolicy: state.iot.publicReceivePolicy,
  deviceConnected: state.iot.deviceConnected,
  identityId: state.auth.identityId,
}));

const mapDispatchToProps = {
  handleSignOut,
  loggedInStatusChanged,
  acquirePublicPolicies,
  deviceConnectedStatusChanged,
  attachMessageHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
