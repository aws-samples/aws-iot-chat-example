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
import { Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { formatRoomCardHeader } from '../../lib/topicHelper';
import RoomCardExtra from './RoomCardExtra';

/**
 * Component on /app/rooms screen that renders a card that links to a room
 */
export const RoomCard = ({ chat, unreadCount, subscribed }) => (
  <Card as={Link} to={`/app/${chat.name}`}>
    <Card.Content>
      <Card.Header>
        { formatRoomCardHeader(chat.name) }
      </Card.Header>
      <Card.Meta>
        { chat.type }
      </Card.Meta>
    </Card.Content>
    <RoomCardExtra
      unreadCount={unreadCount}
      subscribed={subscribed}
    />
  </Card>
);

RoomCard.propTypes = {
  chat: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    admin: PropTypes.string.isRequired,
    createdAt: PropTypes.number.isRequired,
  }).isRequired,
  unreadCount: PropTypes.number.isRequired,
  subscribed: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  unreadCount: state.unreads[ownProps.chat.name] || 0,
  subscribed: state.chat.subscribedTopics.includes(`${ownProps.chat.name}/+`),
});

export default connect(mapStateToProps)(RoomCard);
