import React, { Component } from "react";
import { connect } from "react-redux";
import { chatActions } from "../actions/chatActions";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import uuid from "uuid/v4";
import { throttle } from "throttle-debounce";
import { alertActions } from "../actions/alertActions";
import {
  extractImageFileExtensionFromBase64,
  base64StringtoFile,
} from "../reusable/ReusableUtils";
import { Popup } from "semantic-ui-react";

const imageMaxSize = 10485760; // bytes 10MB
const acceptedFileTypes =
  "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => {
  return item.trim();
});

class MessengerInput extends Component {
  constructor() {
    super();

    this.state = {
      value: "",
    };

    this.debouncedTyping = throttle(3000, this.sendTypingStatus);
  }

  componentDidMount() {
    this.timer = null;
  }

  sendTypingStatus = () => {
    const {
      socket,
      chat: { roomId, currentRoom },
    } = this.props;
    socket.emit("typing", { roomId, userId: currentRoom.user._id });
  };

  handleChange = (e) => {
    const {
      socket,
      chat: { roomId, currentRoom },
    } = this.props;
    this.debouncedTyping();
    clearTimeout(this.timer);

    this.setState({ value: e.target.value });
    this.timer = setTimeout(() => {
      socket.emit("stoppedTyping", { roomId, userId: currentRoom.user._id });
    }, 3000);
  };

  addEmoji = (e) => {
    let emoji = e.native;
    this.setState({
      value: this.state.value + emoji,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      dispatch,
      chat: { roomId, currentRoom },
      userId,
    } = this.props;
    const { value } = this.state;
    if (value !== "") {
      dispatch(
        chatActions.sendMessage({
          receiver: currentRoom.user,
          value,
          roomId,
          sender: userId,
          uuid: uuid(),
        })
      );
    }

    this.setState({ value: "" });
  };

  handleFileSelect = (event) => {
    const {
      dispatch,
      chat: { roomId, currentRoom },
      userId,
    } = this.props;
    const files = event.target.files;
    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files);
      if (isVerified) {
        // imageBase64Data
        const currentFile = files[0];
        const myFileItemReader = new FileReader();
        myFileItemReader.addEventListener(
          "load",
          () => {
            // console.log(myFileItemReader.result)
            const myResult = myFileItemReader.result;
            const imgSrcExt = extractImageFileExtensionFromBase64(myResult);
            const myFilename = "image." + imgSrcExt;
            const myNewFile = base64StringtoFile(myResult, myFilename);
            const fd = new FormData();
            const uniqueId = uuid();
            fd.append("receiver", JSON.stringify(currentRoom.user));
            fd.append("roomId", roomId);
            fd.append("uuid", uniqueId);
            fd.append("photo", myNewFile, myNewFile.name);

            dispatch(
              chatActions.sendImage(fd, {
                receiver: currentRoom.user,
                value: "Image",
                sender: userId,
                roomId,
                uuid: uniqueId,
              })
            );
          },
          false
        );

        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  };

  verifyFile = (files) => {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;
      const { dispatch } = this.props;

      if (!acceptedFileTypesArray.includes(currentFileType)) {
        dispatch(
          alertActions.error(
            "This file is not allowed. Only images are allowed."
          )
        );

        return false;
      }

      if (currentFileSize > imageMaxSize) {
        dispatch(
          alertActions.error(
            "This file is not allowed. " +
              currentFileSize +
              " bytes is too large"
          )
        );
        return false;
      }
      return true;
    }
  };

  onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      this.handleSubmit(e);
    }
  };

  render() {
    const { value } = this.state;
    return (
      <div className="message-input">
        <div className="wrap relative">
          <form onSubmit={this.handleSubmit}>
            <textarea
              onChange={this.handleChange}
              onKeyDown={this.onEnterPress}
              value={value}
              type="text"
              rows={2}
              placeholder="Write your message..."
            />
            <button
              className="top-1 !bg-transparent !mr-0 !px-3 !py-2 absolute"
              style={{ right: "100px" }}
            >
              <i className="fa-solid fa-paper-plane text-xl text-[#591bc5] hover:text-purple-950 transition"></i>
            </button>
          </form>

          <label className="!bg-transparent">
            <input
              type="file"
              accept={acceptedFileTypes}
              multiple={false}
              onChange={this.handleFileSelect}
            />
            <i
              className="fa fa-paperclip text-[#591bc5] hover:text-purple-950 transition"
              aria-hidden="true"
            ></i>
          </label>

          <Popup
            trigger={
              <button
                className="!bg-transparent"
              >
                <i
                  className="fa-regular fa-face-smile text-[#591bc5] hover:text-purple-950 transition"
                  aria-hidden="true"
                ></i>
              </button>
            }
            content={<Picker native={true} onSelect={this.addEmoji} />}
            pinned
            on="click"
            basic
            style={{ padding: "0", border: "0" }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  chat: state.chat,
  socket: state.socket.socket,
  userId: state.user.data._id,
});

const connectedMessengerInput = connect(mapStateToProps)(MessengerInput);
export { connectedMessengerInput as MessengerInput };
