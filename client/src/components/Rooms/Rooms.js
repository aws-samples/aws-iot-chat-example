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
import { Card, Message, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { fetchAllChats } from '../../actions/chatActions';
import RoomCard from './RoomCard';
import CreateRoom from './CreateRoom';

/*
 * Container component to hold the list of available chat rooms
 */
export class Rooms extends Component {
  componentDidMount() {
    this.props.fetchAllChats();
  }

  render() {
    const { error, chats } = this.props;
    return (
      <div>
        <Header as="h1">Rooms List</Header>
        <Message
          warning
          header={error}
          hidden={error === ''}
        />
        <Card.Group>
          <CreateRoom />
          {chats.map(chat => (<RoomCard key={chat.name} chat={chat} />))}
        </Card.Group>
      </div>
    );
  }
}

Rooms.propTypes = {
  chats: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
  fetchAllChats: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  chats: state.chat.allChats,
  error: state.chat.error,
});

export default connect(mapStateToProps, { fetchAllChats })(Rooms);
