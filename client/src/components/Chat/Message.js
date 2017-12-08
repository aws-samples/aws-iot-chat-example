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
import { Comment } from 'semantic-ui-react';
import moment from 'moment';

/**
 * Presentational component to display a chat message
 */
const Message = ({ author, time, text }) => (
  <Comment>
    <Comment.Content>
      <Comment.Author as="a">{author}</Comment.Author>
      <Comment.Metadata>
        <div>{moment(time).calendar()}</div>
      </Comment.Metadata>
      <Comment.Text>{text}</Comment.Text>
    </Comment.Content>
  </Comment>
);

Message.propTypes = {
  author: PropTypes.string.isRequired,
  time: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
};

export default Message;
