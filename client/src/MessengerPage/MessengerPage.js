import React, { Component } from "react";

import { connect } from "react-redux";

import { MessengerSidePanel } from "./MessengerSidePanel";
import { MessengerContent } from "./MessengerContent";
import { chatActions } from "../actions/chatActions";

class MessengerPage extends Component {
  componentDidMount = () => {
    document.title = "Messages | social-network";
  };

  render() {
    const { chat, roomId } = this.props;
    let nullCheck = chat[roomId] && roomId;
    return (
      <div id="frame">
        {nullCheck ? (
          <MessengerContent
          content={chat[roomId]}
          key={roomId}
          ></MessengerContent>
        ) : 
          <div className="content bg-white shadow-2xl card-border-primary flex justify-center items-center text-2xl font-semibold">Pick a chat</div>
        }
        <MessengerSidePanel></MessengerSidePanel>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  roomId: state.chat.roomId,
  chat: state.chat
});

const connectedMessengerPage = connect(mapStateToProps)(MessengerPage);
export { connectedMessengerPage as default };
