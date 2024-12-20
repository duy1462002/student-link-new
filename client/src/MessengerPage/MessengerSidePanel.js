import React, { Component } from "react";
import { connect } from "react-redux";
import { chatActions } from "../actions/chatActions";

class MessengerSidePanel extends Component {
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch(chatActions.getChatRooms());
  };

  changeRoom = (room) => {
    const { dispatch } = this.props;
    localStorage.setItem("currentRoom", JSON.stringify(room));

    dispatch(chatActions.changeRoom(room));
  };
  //room.members.filter(member => member._id !== user.data._id);
  handleSearch = (e) => {
    const {
      dispatch,
      rooms,
      user: { data },
    } = this.props;
    const users = rooms.filter((room) => {
      const user = room.members.filter((member) => member._id !== data._id);
      if (
        user[0].firstName
          .toLocaleLowerCase()
          .includes(e.target.value.toLocaleLowerCase()) ||
        user[0].lastName
          .toLocaleLowerCase()
          .includes(e.target.value.toLocaleLowerCase())
      ) {
        return room;
      }
      return null;
    });

    dispatch(chatActions.searchUsers(users));
  };

  componentDidUpdate = () => {
    const { rooms } = this.props;
    if (rooms.length) {
      const savedRoom = localStorage.getItem("currentRoom");
      const roomObj = JSON.parse(savedRoom);
      console.log(roomObj);
      if (roomObj && roomObj._id) {
        this.changeRoom(roomObj);
      }
    }
  };

  render() {
    const { user, rooms, searchedRooms, roomId } = this.props;
    let renderRooms = searchedRooms ? searchedRooms : rooms;
    const usersList = renderRooms.map((room) => {
      const member = room.members.filter(
        (member) => member._id !== user.data._id
      );
      let message = "...";
      if (room.lastMessage[0] && room.lastMessage[0].sender === user.data._id) {
        if (room.lastMessage[0].messageType === "text") {
          message = "You: " + room.lastMessage[0].text;
        } else {
          message = "You sent image ";
        }
      } else if (room.lastMessage[0]) {
        if (room.lastMessage[0].messageType === "text") {
          message = room.lastMessage[0].text;
        } else {
          message = "Image ";
        }
      }

      return (
        <li
          className={room._id === roomId ? "contact active" : "contact"}
          key={room._id}
          onClick={() => this.changeRoom({ ...room, user: { ...member[0] } })}
        >
          <div className="wrap">
            <span
              className={`contact-status ${member[0].activityStatus}`}
            ></span>
            <img
              src={`/images/profile-picture/100x100/${member[0].profilePicture}`}
              alt=""
            />
            <div className="meta">
              <p className="name">
                {member[0].firstName + " " + member[0].lastName}
              </p>
              <p className="preview !transition-none">{message}</p>
            </div>
          </div>
        </li>
      );
    });

    return (
      <div
        id="sidepanel"
        className="right-sidebar !text-black !bg-white shadow-2xl card-border-primary"
      >
        {/* <div id="profile">
          <div className="wrap">
            <img
              id="profile-img"
              src={`/images/profile-picture/100x100/${user.data.profilePicture}`}
              className="online"
              alt=""
            />
            <p>{user.data.firstName + " " + user.data.lastName}</p>
            <i
              className="fa fa-chevron-down expand-button"
              aria-hidden="true"
            ></i>
            <div id="status-options">
              <ul>
                <li id="status-online" className="active">
                  <span className="status-circle"></span>
                  <p>Online</p>
                </li>
                <li id="status-offline">
                  <span className="status-circle"></span>
                  <p>Offline</p>
                </li>
              </ul>
            </div>
          </div>
        </div> */}

        <div className="text-3xl font-semibold p-5">Chats</div>
        <div id="search">
          <label htmlFor="">
            <i className="fa fa-search" aria-hidden="true"></i>
          </label>
          <input
            type="text"
            placeholder="Search contacts..."
            onChange={this.handleSearch}
            className="!bg-slate-100 border-none"
          />
        </div>
        <div id="contacts">
          <ul>{usersList.length ? usersList : "No users"}</ul>
        </div>
        <div id="bottom-bar">
          <button
            id="addcontact"
            className="!text-[#591bc5] hover:!text-purple-950 h-16"
          >
            <i
              className="fa fa-user-plus fa-fw text-base"
              aria-hidden="true"
            ></i>
            <span className="text-base">Add contact</span>
          </button>
          <button
            id="settings"
            className="!text-[#591bc5] hover:!text-purple-950 h-16"
          >
            <i className="fa fa-cog fa-fw text-base" aria-hidden="true"></i>
            <span className="text-base">Settings</span>
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  rooms: state.chat.rooms,
  searchedRooms: state.chat.searchedRooms,
  roomId: state.chat.roomId,
});

const connectedMessengerSidePanel =
  connect(mapStateToProps)(MessengerSidePanel);
export { connectedMessengerSidePanel as MessengerSidePanel };
