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
import { connect } from 'react-redux';
import { Button, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

import { messageToSendChanged } from '../../actions/chatActions';
import { topicFromParams } from '../../lib/topicHelper';
import * as IoT from '../../lib/aws-iot';

/*
 * Component to render the reply section of a chat room
 */
export class Reply extends Component {
  constructor(props) {
    super(props);
    this.onMessageChange = this.onMessageChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onMessageChange(event, result) {
    const { value: msg } = result;
    this.props.messageToSendChanged(msg);
  }

  onFormSubmit() {
    const { messageToSend, identityId, match } = this.props;
    const msg = { message: messageToSend };
    this.props.messageToSendChanged('');
    const topic = `${topicFromParams(match.params)}/${identityId}`;
    IoT.publish(topic, JSON.stringify(msg));
  }

  render() {
    return (
      <Form onSubmit={this.onFormSubmit} >
        <Form.Group>
          <Form.Field>
            <Form.Input
              placeholder="message"
              value={this.props.messageToSend}
              onChange={this.onMessageChange}
            />
          </Form.Field>
          <Button
            type="submit"
            disabled={this.props.messageToSend === ''}
            color="teal"
          >
            Reply
          </Button>
        </Form.Group>
      </Form>
    );
  }
}

Reply.propTypes = {
  messageToSend: PropTypes.string.isRequired,
  messageToSendChanged: PropTypes.func.isRequired,
  identityId: PropTypes.string.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      roomType: PropTypes.string.isRequired,
      roomName: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

const mapStateToProps = state => ({
  messageToSend: state.chat.messageToSend,
  identityId: state.auth.identityId,
});

export default withRouter(connect(mapStateToProps, { messageToSendChanged })(Reply));
