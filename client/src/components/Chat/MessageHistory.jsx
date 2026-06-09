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
import { Header, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Message from './Message';
import LoadingUserComment from './LoadingUserComment';
import { topicFromParams } from '../../lib/topicHelper';

/**
 * Presentational component to render the list of messages
 */
export const MessageHistory = ({ messages }) => (
  <Comment.Group>
    <Header as="h3" dividing>Chat History</Header>
    {messages.map(message => (
      <Message
        key={message.id}
        {...message}
      />
    ))}
    <LoadingUserComment />
  </Comment.Group>
);


MessageHistory.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired).isRequired,
};

export const mapStateToProps = (state, ownProps) => {
  const topic = topicFromParams(ownProps.match.params);
  const room = state.rooms[topic];
  return {
    messages: room ? room.messages : [],
  };
};

export default withRouter(connect(mapStateToProps)(MessageHistory));
