import React, { Component, Fragment } from "react";
import { Route, Switch, Link } from "react-router-dom";
import DiscussionPage from "./DiscussionGroup";
import AboutGroup from "./AboutGroup";
import MemberPage from "./MemberPage";
import MediaGroup from "./MediaGroup";
import MeetingPage from "./MeetingPage"
import AddMemberModal from "../components/Group/AddMemberModal";
import { groupActions } from "../actions/groupActions";
import { connect } from "react-redux";
import SpinnerLoading from "../components/SpinnerLoading";
import EditCoverModal from "../components/Group/EditCoverModal";

class GroupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFixed: false,
      loadedImg: false,
    };
  }

  handleScroll = () => {
    // const scrollPosition = window.scrollY;
    // if (scrollPosition > 300) {
    //   this.setState({ isFixed: true });
    // } else {
    //   this.setState({ isFixed: false });
    // }
  };

  componentDidMount() {
    document.title = "Group Page | social-network";
    window.addEventListener("scroll", this.handleScroll);
    this.fetchGroupDetail();
  }

  componentDidUpdate(prevProps) {
    const { dispatch } = this.props;
    if (this.props.match.params.groupId !== prevProps.match.params.groupId) {
      this.fetchGroupDetail();
      dispatch(
        groupActions.getGroupPosts({
          initialFetch: true,
          groupId: this.props.match.params.groupId,
        })
      );
    }
    if (prevProps.updating === true && this.props.updating === false) {
      this.fetchGroupDetail();
    }

    if (
      prevProps.loadingCoverImage === true &&
      this.props.loadingCoverImage === false
    ) {
      this.fetchGroupDetail();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    this.props.dispatch({ type: "CLEAR_POSTS_GROUP" });
  }

  fetchGroupDetail = () => {
    const { dispatch, match } = this.props;
    dispatch(
      groupActions.getGroupDetail({
        initialFetch: true,
        groupId: match.params.groupId,
      })
    );
  };

  render() {
    const {
      fetchingGroupDetail,
      currentGroup,
      coverImage,
      loadingCoverImage,
      currentGroupAdmins,
      user,
      posts,
    } = this.props;
    const currentGroupAdminsArray = currentGroupAdmins.map((item) => {
      return item.userId;
    });

    let isGroupAdmin = currentGroupAdminsArray.includes(user._id);
    const { path, url } = this.props.match;
    const pathname = window.location.pathname;
    return (
      <div
        className={`relative min-h-[800px]`}
      >
        {fetchingGroupDetail ? (
          <SpinnerLoading size={180} />
        ) : (
          <Fragment>
            <div className="header-group">
              {loadingCoverImage ? (
                <div className="min-h-[360px] bg-white">
                  <SpinnerLoading size={100} bgColor="white" />
                </div>
              ) : (
                <div className="relative">
                  <img
                    className="card-border-primary w-full object-cover h-[360px] rounded-2xl mb-[8px]"
                    src={`/images/group-images/${coverImage}`}
                    alt="cover_group_img"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 right-6">
                    {isGroupAdmin && <EditCoverModal />}
                  </div>
                </div>
              )}
              <div
                className={`flex items-center justify-between bg-[#fff] shadow-lg p-[16px] rounded-2xl ${
                  this.state.isFixed
                    ? "isFixed z-30 card-border-primary"
                    : "noFixed"
                }`}
              >
                <div className="flex flex-col gap-[8px] text-black">
                  <h1 className="text-[28px] font-semibold">
                    {currentGroup.name}
                  </h1>
                  <div className="flex items-center gap-x-[8px] text-[14px]">
                    <i className="fa-solid fa-lock"></i>
                    <span>Private Group</span>
                    <span className="font-semibold">
                      {currentGroup.members.length} members
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-[16px]">
                  <AddMemberModal />
                  <button className="group-btn rounded-lg">
                    <i className="fa-solid fa-user-group"></i>
                    Participated
                  </button>
                </div>
              </div>
              <div>
                <div className="flex items-center w-full justify-start group-tab shadow-lg rounded-xl">
                  <Link
                    to={`${url}/about`}
                    className={`${
                      pathname === `${url}/about` ? "tab-active" : ""
                    } group-tab-item`}
                  >
                    About
                  </Link>
                  <Link
                    to={`${url}/meetings`}
                    className={`${
                      pathname === `${url}/meetings` ? "tab-active" : ""
                    } group-tab-item`}
                  >
                    Meetings
                  </Link>
                  <Link
                    to={`${url}/discussion`}
                    className={`${
                      pathname === `${url}/discussion` ? "tab-active" : ""
                    } group-tab-item`}
                  >
                    Feeds
                  </Link>
                  <Link
                    to={`${url}/members`}
                    className={`${
                      pathname === `${url}/members` ? "tab-active" : ""
                    } group-tab-item`}
                  >
                    Members
                  </Link>
                  <Link
                    to={`${url}/media`}
                    className={`${
                      pathname === `${url}/media` ? "tab-active" : ""
                    } group-tab-item`}
                  >
                    Gallery
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-[14px]">
              <Switch>
                <Route path={`${path}/about`} component={AboutGroup} />
                <Route path={`${path}/discussion`} component={DiscussionPage} />
                <Route path={`${path}/members`} component={MemberPage} />
                <Route path={`${path}/media`} component={MediaGroup} />
                <Route path={`${path}/meetings`} component={MeetingPage} />
              </Switch>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  fetchingGroupDetail: state.groups.fetchingGroupDetail,
  currentGroup: state.groups.currentGroup,
  posts: state.groups.posts,
  coverImage: state.groups.coverImage,
  loadingCoverImage: state.groups.loadingCoverImage,
  user: state.user.data,
  updating: state.groups.updating,
  currentGroupAdmins: state.groups.currentGroupAdmins,
});

export default connect(mapStateToProps)(GroupPage);
