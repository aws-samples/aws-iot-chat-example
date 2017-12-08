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
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Menu, Label } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';

import { formatRoomCardHeader } from '../../lib/topicHelper';

/**
 * Component to display subscribed to chat rooms and ability to switch rooms
 */
export const RoomMenuItem = (props) => {
  const { topic, active, unreadCount } = props;
  return (
    <Menu.Item
      name={topic}
      active={active}
      key={topic}
      as={Link}
      to={`/app/${topic}`}
    >
      <Label color={active ? 'teal' : 'grey'}>{unreadCount}</Label>
      {formatRoomCardHeader(topic)}
    </Menu.Item>
  );
};

RoomMenuItem.propTypes = {
  topic: PropTypes.string.isRequired,
  unreadCount: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  unreadCount: state.unreads[ownProps.topic] || 0,
});


export default withRouter(connect(mapStateToProps)(RoomMenuItem));
