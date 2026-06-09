import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Routes, Route } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';

import Chat from './Chat/Chat';
import Rooms from './Rooms/Rooms';
import Spinner from './Spinner';
import { handleSignOut, loggedInStatusChanged } from '../actions/authActions';
import * as IoT from '../lib/aws-iot';
import { acquirePublicPolicies, deviceConnectedStatusChanged, attachMessageHandler } from '../actions/iotActions';

const styles = {
  container: {
    marginTop: '7em',
  },
};

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enterApp: false,
    };
    this.signOut = this.signOut.bind(this);
  }

  componentDidMount() {
    this.validateUserSession();
    const connectCallback = () => this.props.deviceConnectedStatusChanged(true);
    const closeCallback = () => this.props.deviceConnectedStatusChanged(false);
    this.props.acquirePublicPolicies(connectCallback, closeCallback);
  }

  componentDidUpdate(prevProps) {
    const {
      connectPolicy,
      publicPublishPolicy,
      publicSubscribePolicy,
      publicReceivePolicy,
      deviceConnected,
      identityId,
    } = this.props;

    if (connectPolicy &&
      publicPublishPolicy &&
      publicSubscribePolicy &&
      publicReceivePolicy &&
      deviceConnected &&
      !this.state.enterApp) {
      const topic = `room/public/ping/${identityId}`;
      IoT.publish(topic, JSON.stringify({ message: 'connected' }));
      this.props.attachMessageHandler();
      this.setState({ enterApp: true });
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
    if (this.state.enterApp) {
      return (
        <Container style={styles.container}>
          <Routes>
            <Route path="/app/room/:roomType/:roomName" element={<Chat />} />
            <Route path="/app/rooms" element={<Rooms />} />
            <Route path="*" element={<Rooms />} />
          </Routes>
        </Container>
      );
    }

    return <Spinner />;
  }

  render() {
    return (
      <div>
        <Menu fixed="top">
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
