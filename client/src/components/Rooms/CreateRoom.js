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
import { Card, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { createChat } from '../../actions/chatActions';

const styles = {
  generatedRoomName: {
    opacity: 0.45,
    fontSize: '1.2857em',
    fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
  },
};

export class CreateRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      type: 'public',
      roomName: 'generated-room-name',
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.sanitizeRoomName = this.sanitizeRoomName.bind(this);
  }

  onFormSubmit(e) {
    e.preventDefault();
    const { roomName, type } = this.state;
    this.props.createChat(roomName, type);
  }

  onChange(e, { name, value }) {
    this.setState({ [name]: value });
    if (name === 'name') {
      this.sanitizeRoomName(value);
    }
  }

  sanitizeRoomName(name) {
    // Only alphanumeric characters and spaces
    let roomName = name.replace(/[^a-zA-Z 1-9]/g, '');

    // Remove the extra whitespaces
    roomName = roomName.replace(/\s\s+/g, ' ');

    // Lowercase everything
    roomName = roomName.toLowerCase();

    // Connect whitespaces with '-'
    roomName = roomName.replace(/ /g, '-');
    this.setState({ roomName });
  }

  render() {
    return (
      <Card>
        <Card.Content>
          <Card.Header>
            New Room
          </Card.Header>
        </Card.Content>
        <Card.Content>
          <Form onSubmit={this.onFormSubmit}>
            <Form.Field>
              <label htmlFor="roomName">Room Name</label>
              <Form.Input
                placeholder="name"
                id="create_room_name"
                name="name"
                onChange={this.onChange}
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor="generatedRoomName">Generated Room Name</label>
              <div style={styles.generatedRoomName}>
                {this.state.roomName}
              </div>
            </Form.Field>
            <Form.Field>
              <Form.Group>
                <Form.Radio
                  label="Public"
                  value="public"
                  name="type"
                  checked={this.state.type === 'public'}
                  onChange={this.onChange}
                />
                <Form.Radio
                  label="Private"
                  value="private"
                  name="type"
                  checked={this.state.type === 'private'}
                  onChange={this.onChange}
                  disabled
                />
              </Form.Group>
            </Form.Field>
            <Form.Button
              basic
              fluid
              color="teal"
              loading={this.props.creatingChat}
            >
              Create
            </Form.Button>
          </Form>
        </Card.Content>
      </Card>
    );
  }
}

CreateRoom.propTypes = {
  createChat: PropTypes.func.isRequired,
  creatingChat: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  creatingChat: state.chat.creatingChat,
});

export default connect(mapStateToProps, { createChat })(CreateRoom);
