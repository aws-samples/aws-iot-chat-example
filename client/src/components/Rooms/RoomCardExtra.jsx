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
import { Card, Icon } from 'semantic-ui-react';

const renderUnreadCount = (unreadCount) => {
  if (unreadCount === 1) {
    return '1 unread message';
  }
  return `${unreadCount} unread messages`;
};

/**
 * Footer of the RoomCard component
 */
export const RoomCardExtra = ({ subscribed, unreadCount }) => {
  // Don't render extra section if not subscribed
  if (!subscribed) {
    return null;
  }

  return (
    <Card.Content extra>
      <Icon name="favorite" />
      Subscribed
      <br />
      <Icon name="chat" />
      { renderUnreadCount(unreadCount) }
    </Card.Content>
  );
};

RoomCardExtra.propTypes = {
  unreadCount: PropTypes.number.isRequired,
  subscribed: PropTypes.bool.isRequired,
};

export default RoomCardExtra;
