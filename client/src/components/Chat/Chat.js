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
import { Grid, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import RoomMenu from './RoomMenu';
import Reply from './Reply';
import MessageHistory from './MessageHistory';
import { readChat, subscribeToTopic } from '../../actions/chatActions';
import { topicFromParams } from '../../lib/topicHelper';

/**
 * Container component containing message history and reply section
 */
export class Chat extends Component {
  constructor(props) {
    super(props);
    this.scrollToBottomOfMessages = this.scrollToBottomOfMessages.bind(this);
  }

  componentDidMount() {
    const { params } = this.props.match;
    const topic = `${topicFromParams(params)}/+`;
    this.props.subscribeToTopic(topic);
    this.scrollToBottomOfMessages();
    this.props.readChat(topicFromParams(this.props.match.params));
  }

  componentDidUpdate() {
    this.scrollToBottomOfMessages();
    this.props.readChat(topicFromParams(this.props.match.params));
  }

  scrollToBottomOfMessages() {
    if (this.scrollDiv) {
      this.scrollDiv.scrollIntoView(false);
    }
  }

  render() {
    const { params } = this.props.match;
    return (
      <div>
        <Header as="h1">AWS IoT Chat Application</Header>
        <Grid stackable columns={2}>
          <Grid.Column>
            <RoomMenu />
          </Grid.Column>

          <Grid.Column>
            <div
              messages={this.props.messages}
              ref={(el) => { this.scrollDiv = el; }}
            >
              <p>Welcome to {params.roomType}/{params.roomName}</p>

              <MessageHistory />
              <Reply />
            </div>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

Chat.propTypes = {
  subscribeToTopic: PropTypes.func.isRequired,
  readChat: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      roomType: PropTypes.string.isRequired,
      roomName: PropTypes.string.isRequired,
    }),
  }).isRequired,

  // The 'messages' prop is only used so that this component will rerender when the messages change.
  // componentDidUpdate will fire and screen will scroll to latest message
  messages: PropTypes.array.isRequired,
};

export const mapStateToProps = (state, ownProps) => {
  // Parse room name from url path to fetch corresponding messages
  const { roomType, roomName } = ownProps.match.params;
  const roomStr = `${roomType}/${roomName}`;
  const room = state.rooms[roomStr];
  return {
    messages: room ? room.messages : [],
  };
};

export default withRouter(connect(mapStateToProps, { subscribeToTopic, readChat })(Chat));
