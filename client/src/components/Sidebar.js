import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Icon, Popup } from "semantic-ui-react";
import { connect } from "react-redux";
import { groupActions } from "../actions/groupActions";
import SpinnerLoading from "./SpinnerLoading";

class Sidebar extends Component {
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

  componentDidMount = () => {
    const { dispatch, groups } = this.props;
    if (!groups.length) {
      dispatch(groupActions.getGroups({ initialFetch: true }));
    }
  };

  render() {
    const { location, user, groups, fetching } = this.props;
    return (
      <div className="fixed " style={{ width: "22rem" }}>
        <div className="w-full overflow-hidden  flex flex-col  shadow-lg h-auto text-gray-600 transition-all duration-300 border-none z-10 sidebar card-border-primary">
          <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
            <ul className="flex flex-col">
              <li>
                <div
                  to="/profile"
                  className={`relative justify-center flex nav-link-sidebar flex-row items-center h-14 focus:outline-none border-l-4 ${
                    location.pathname === "/duy"
                      ? "bg-slate-100 !text-[#591bc5] active"
                      : "bg-white"
                  }`}
                >
                  {" "}
                  <h1 className="text-2xl font-semibold">
                    {user.data.firstName + " " + user.data.lastName}
                  </h1>
                </div>
              </li>
              <li>
                <Link
                  to="/"
                  className={`pt-1 relative flex nav-link-sidebar flex-row items-center h-14 focus:outline-none hover:text-[#591bc5] text-gray-600 hover:bg-slate-100 transition border-l-4 ${
                    location.pathname === "/"
                      ? "bg-slate-100 !text-[#591bc5] active"
                      : "bg-white"
                  }`}
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <i
                      className="fas fa-home text-3xl"
                      style={{ marginLeft: "4px" }}
                    ></i>
                  </span>
                  <span className="ml-3 text-lg tracking-wide truncate">
                    Home
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/messages/chat"
                  className={`relative flex nav-link-sidebar flex-row items-center h-14 focus:outline-none hover:text-[#591bc5] text-gray-600 hover:bg-slate-100 transition border-l-4 ${
                    location.pathname === "/messages/chat"
                      ? "bg-slate-100 !text-[#591bc5] active"
                      : "bg-white"
                  }`}
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <Icon
                      name="facebook messenger"
                      size="big"
                      className="!mr-0"
                    />
                  </span>
                  <span className="ml-3 text-lg tracking-wide truncate">
                    Messenger
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/notifications"
                  className={`relative flex nav-link-sidebar flex-row items-center h-14 focus:outline-none hover:text-[#591bc5] text-gray-600 hover:bg-slate-100 transition border-l-4 ${
                    location.pathname === "/notifications"
                      ? "bg-slate-100 !text-[#591bc5] active"
                      : "bg-white"
                  }`}
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <Icon name="bell" size="big" className="!mr-0" />
                  </span>
                  <span className="ml-3 text-lg tracking-wide truncate">
                    Notifications
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className={`pb-1 relative flex nav-link-sidebar flex-row items-center h-14 focus:outline-none hover:text-[#591bc5] text-gray-600 hover:bg-slate-100 transition border-l-4 ${
                    location.pathname === "/login"
                      ? "bg-slate-100 !text-[#591bc5] active"
                      : "bg-white"
                  }`}
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <i
                      className="fas fa-sign-out-alt text-3xl"
                      style={{ marginLeft: "5px" }}
                    ></i>
                  </span>
                  <span className="ml-3 text-lg tracking-wide truncate">
                    Logout
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="overflow-hidden bg-white  flex flex-col  mt-5 shadow-lg h-auto text-gray-600 transition-all duration-300 border-none z-10 sidebar card-border-primary">
          <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
            <ul
              className={`flex flex-col gap-[8px] mb-[12px] relative ${
                fetching ? "min-h-60" : ""
              }`}
            >
              <li className="flex items-center justify-between px-4">
                <h1 className="text-2xl px-[16px] py-[8px] font-semibold text-center relative flex-1">
                  Groups
                </h1>
                <Link
                  to="/add-group"
                  className="text-[16px] cursor-pointer hover:text-[#591bc5]"
                >
                  <Popup
                    content="Create new group"
                    trigger={<i className="fa-solid fa-plus"></i>}
                  />
                </Link>
              </li>
              <div className="flex flex-col gap-2 max-h-[400px] overflow-auto">
              {fetching ? (
                <SpinnerLoading size={80} bgColor="white" />
              ) : groups.length === 0 ? (
                <li>
                  <h1 className="text-xl font-semibold text-center relative">
                    You are not in any groups
                  </h1>
                </li>
              ) : (
                groups.map((group) => (
                  <li key={group._id}>
                    <Link
                      to={`/group/${group._id}/discussion`}
                      className={`relative flex nav-link-sidebar flex-row items-center h-14 focus:outline-none hover:text-[#591bc5] text-gray-600 hover:bg-slate-100 transition border-l-4 ${
                        location.pathname.includes(group._id)
                          ? "bg-slate-100 !text-[#591bc5] active"
                          : "bg-white"
                      }`}
                    >
                      <span className="inline-flex justify-center items-center ml-4">
                        <img
                          className="w-[40px] h-[40px] object-cover rounded-lg"
                          alt="avatar_group"
                          src={`/images/group-images/thumbnail/${group.coverImage}`}
                        />
                      </span>
                      <span className="ml-3 text-lg tracking-wide truncate max-w-[70%]">
                        {group.name}
                      </span>
                    </Link>
                  </li>
                ))
              )}
              </div>
            </ul>
          </div>
        </div>

        {/* <div className="overflow-hidden bg-white  flex flex-col  mt-5 shadow-lg h-auto text-gray-600 transition-all duration-300 border-none z-10 sidebar card-border-primary">
          <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
            <ul
              className={`flex flex-col gap-[8px] mb-[12px] relative ${
                fetching ? "min-h-60" : ""
              }`}
            >
              <li className="flex items-center justify-between px-4">
                <h1 className="text-2xl px-[16px] py-[8px] font-semibold text-center relative flex-1">
                  Organization
                </h1>
                <Link
                  to="/add-org"
                  className="text-[16px] cursor-pointer hover:text-[#591bc5]"
                >
                  <Popup
                    content="Create new organization"
                    trigger={<i className="fa-solid fa-plus"></i>}
                  />
                </Link>
              </li>
              <div className="flex flex-col gap-2 max-h-[400px] overflow-auto">
              {fetching ? (
                <SpinnerLoading size={80} bgColor="white" />
              ) : groups.length === 0 ? (
                <li>
                  <h1 className="text-xl font-semibold text-center relative">
                    You are not in any organization
                  </h1>
                </li>
              ) : (
                [1, 2, 3].map((org) => (
                  <li key={org}>
                    <Link
                      to={`/org/${org}`}
                      className={`relative flex nav-link-sidebar flex-row items-center h-14 focus:outline-none hover:text-[#591bc5] text-gray-600 hover:bg-slate-100 transition border-l-4 ${
                        location.pathname.includes(`org/${org}`)
                          ? "bg-slate-100 !text-[#591bc5] active"
                          : "bg-white"
                      }`}
                    >
                      <span className="inline-flex justify-center items-center ml-4">
                        <img
                          className="w-[40px] h-[40px] object-cover rounded-lg"
                          alt="avatar_group"
                          src={`https://th.bing.com/th/id/R.0e150c124ae2d80d1cba3d5dbc5f4511?rik=vDIIwCgDm59%2fzg&pid=ImgRaw&r=0`}
                        />
                      </span>
                      <span className="ml-3 text-lg tracking-wide truncate max-w-[70%]">
                        organization number {org}
                      </span>
                    </Link>
                  </li>
                ))
              )}
              </div>
            </ul>
          </div>
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  groups: state.groups.groups,
  fetching: state.groups.fetching,
});

const connectSidebar = connect(mapStateToProps)(Sidebar);

export default withRouter(connectSidebar);
