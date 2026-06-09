import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import RoomMenu from './RoomMenu';
import Reply from './Reply';
import MessageHistory from './MessageHistory';
import { readChat, subscribeToTopic } from '../../actions/chatActions';
import { topicFromParams } from '../../lib/topicHelper';

// Wrapper to inject route params into the class component
function ChatWrapper(props) {
  const params = useParams();
  return <ChatInner {...props} match={{ params }} />;
}

class ChatInner extends Component {
  constructor(props) {
    super(props);
    this.scrollToBottomOfMessages = this.scrollToBottomOfMessages.bind(this);
  }

  componentDidMount() {
    const { params } = this.props.match;
    const topic = `${topicFromParams(params)}/+`;
    this.props.subscribeToTopic(topic);
    this.scrollToBottomOfMessages();
    this.props.readChat(topicFromParams(params));
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
            <div ref={(el) => { this.scrollDiv = el; }}>
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

ChatInner.propTypes = {
  subscribeToTopic: PropTypes.func.isRequired,
  readChat: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      roomType: PropTypes.string.isRequired,
      roomName: PropTypes.string.isRequired,
    }),
  }).isRequired,
  messages: PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { roomType, roomName } = ownProps.match.params;
  const roomStr = `${roomType}/${roomName}`;
  const room = state.rooms[roomStr];
  return {
    messages: room ? room.messages : [],
  };
};

const ConnectedChat = connect(mapStateToProps, { subscribeToTopic, readChat })(ChatInner);

export default function Chat() {
  const params = useParams();
  return <ConnectedChat match={{ params }} />;
}
