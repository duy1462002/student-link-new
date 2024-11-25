import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Icon, Image, Dropdown, Label } from "semantic-ui-react";
import { connect } from "react-redux";
import { history } from "../_helpers/history";
import { notificationActions } from "../actions/notificationActions";
import { socketActions } from "../actions/socketActions";
import { userActions } from "../actions/userActions";
import { NotificationPopup } from "./NotificationPopup";
import { AutosuggestExample } from "../components/Autosuggestion";
import { AnsweringModal } from "../MessengerPage/AnsweringModal";

function trigger(image, name) {
  return (
    <span>
      <Image
        size="mini"
        avatar
        src={"/images/profile-picture/100x100/" + image}
      />{" "}
      {name}
    </span>
  );
}

function getUserDataF(path, cb) {
  const params = {
    profilePage: false,
    userProfile: false,
  };
  if (path === "/") {
    cb({ ...params, profilePage: true });
  } else if (path === "/profile") {
    cb({ ...params, profilePage: true });
  } else {
    cb({ ...params, userProfile: true });
  }
}

class Navbar extends Component {
  constructor() {
    super();

    this.state = {
      value: "",
      options: [
        {
          key: "none",
          text: "Mobile",
          value: "",
          content: <h1 className="hidden">hi</h1>,
        },
        {
          key: "user",
          text: "Account",
          icon: "user",
          value: "profile",
          active: false,
        },
        {
          key: "sign-out",
          text: "Sign Out",
          icon: "sign out",
          value: "login",
          active: false,
        },
      ],
      activePath: "",
    };
    this.params = {
      homePage: false,
      profilePage: false,
      userProfile: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    history.listen((location) => {
      this.setState({ activePath: location.pathname });

      getUserDataF(location.pathname, (data) =>
        dispatch(userActions.getUserData(data))
      );
    });

    getUserDataF(history.location.pathname, (data) =>
      dispatch(userActions.getUserData(data))
    );

    this.setState({ activePath: history.location.pathname });
    dispatch(socketActions.connect());
  }

  handleNotificationPopupToggle = (e) => {
    e.stopPropagation();
    const { dispatch, notifications } = this.props;
    const ids = notifications.filter((e) => !e.read).map((e) => e._id);

    dispatch(notificationActions.toggleNotificationPopup());

    if (!notifications.length) {
      dispatch(
        notificationActions.fetchNotifications({ initialFetch: true }, ids)
      );
    } else {
      const lastId = notifications[notifications.length - 1]._id;
      dispatch(
        notificationActions.fetchNotifications(
          { initialFetch: false, lastId },
          ids
        )
      );
    }
  };

  handleChange = (e, { value }) => {
    if (value !== "") {
      if (value === "login") {
        localStorage.removeItem("user");
        window.location.reload(true);
      }
      history.push("/" + value);
      this.setState({ value });
    }
  };

  handleClose = () => {
    this.setState({ value: "" });
  };

  handleClose = () => {
    this.setState({ value: "" });
  };

  render() {
    const { user, answeringModal } = this.props;
    const { value, options, activePath } = this.state;

    return (
      <div
        className="main-navbar bg-slate-100 container"
        style={{ minHeight: "unset!important" }}
      >
        <div className="nav-item logo">
          <Link to={"/"}>
            <div className="flex items-center gap-2 border border-b border-gray-200">
              <img
                className="w-20 rounded-full"
                src="/S-Network-Logo.png"
                alt=""
              />
              <p className="text-xl font-semibold mt-1 text-white">
                Network Linked
              </p>
            </div>
          </Link>
        </div>
        <div className="nav-item">
          <div className="w-[500px] flex items-center bg-slate-50 rounded-full gap-2 px-6 py-4">
            <i className="fas fa-search text-xl"></i>
            <AutosuggestExample />
          </div>
        </div>
        <div className="nav-item nav-menu">
          {/* <Menu>
              <Menu.Menu>
                <Menu.Menu position="right">
                  <Menu.Item active={activePath === "/"} as={Link} to="/">
                    <Icon name="home" size="big" />
                  </Menu.Item>
                  
                </Menu.Menu>


              </Menu.Menu>
            </Menu>*/}

          <div className="flex gap-3 items-center">
            <Menu.Item
              active={activePath.includes("/messages/")}
              as={Link}
              to="/messages/chat"
              className="bg-white w-14 h-14 flex items-center justify-center rounded-full relative"
            >
              <Icon name="facebook messenger" size="big" className="!mr-0" />
              {user.data.messagesCount !== 0 ? (
                <Label
                  color="red"
                  style={{ margin: 0 }}
                  className="absolute top-1 right-1 !px-2 !py-1 !rounded-full bg-gray-200"
                >
                  {user.data.messagesCount}
                </Label>
              ) : (
                <></>
              )}
            </Menu.Item>

            <NotificationPopup>
              <Menu.Item
                onClick={(e) => this.handleNotificationPopupToggle(e)}
                className="bg-white w-14 h-14 flex items-center justify-center rounded-full relative cursor-pointer"
              >
                <Icon name="bell" size="big" className="!mr-0" />
                {user.data.notificationsCount !== 0 ? (
                  <Label
                    color="red"
                    style={{ margin: 0 }}
                    className="absolute top-1 right-1 !px-2 !py-1 !rounded-full bg-gray-200"
                  >
                    {user.data.notificationsCount}
                  </Label>
                ) : (
                  <></>
                )}
              </Menu.Item>
            </NotificationPopup>

            {user.data.profilePicture === null ? (
              <div
                className="skeleton skeleton-text !rounded-full !mb-0"
                style={{ height: "42px", width: "42px" }}
              ></div>
            ) : (
              <Menu.Item
                active={activePath === "/profile"}
                name="avatar"
                id="avatar-container"
              >
                <Dropdown
                  trigger={trigger(user.data.profilePicture)}
                  selectOnNavigation={false}
                  options={options}
                  icon={null}
                  onClose={this.handleClose}
                  onChange={this.handleChange}
                  value={value}
                  direction={"left"}
                />
              </Menu.Item>
            )}
          </div>
        </div>
        {answeringModal.isOpen ? <AnsweringModal></AnsweringModal> : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  notifications: state.notification.notifications,
  answeringModal: state.chat.answeringModal,
  currentRoom: state.chat.currentRoom,
  roomId: state.chat.roomId,
});

const connectNavbar = connect(mapStateToProps)(Navbar);
export { connectNavbar as default };
