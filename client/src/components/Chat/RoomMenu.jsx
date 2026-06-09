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
import { Menu } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

import RoomMenuItem from './RoomMenuItem';
import { topicFromParams, topicFromSubscriptionTopic } from '../../lib/topicHelper';

/**
 * Component to display subscribed to chat rooms and ability to switch rooms
 */
export const RoomMenu = props => (
  <Menu
    vertical
    size="large"
  >
    { props.subscribedTopics.map((subscribedTopic) => {
      const topic = topicFromSubscriptionTopic(subscribedTopic);
      const pathTopic = topicFromParams(props.match.params);
      const active = topic === pathTopic;
      return <RoomMenuItem key={topic} topic={topic} active={active} />;
    })}
  </Menu>
);

RoomMenu.propTypes = {
  subscribedTopics: PropTypes.arrayOf(PropTypes.string).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      roomType: PropTypes.string.isRequired,
      roomName: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

const mapStateToProps = state => ({
  subscribedTopics: state.chat.subscribedTopics,
});


export default withRouter(connect(mapStateToProps, null)(RoomMenu));
