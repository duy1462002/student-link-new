import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  Dimmer,
  Modal,
  List,
  Loader,
  Icon,
  Divider,
  Message,
} from "semantic-ui-react";
import { userActions } from "../actions/userActions";

import Post from "../components/Post/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import { FollowButton } from "../components/FollowButton";
import Messages from "../components/Messages";
import Linkify from "linkifyjs/react";
import * as linkify from "linkifyjs";
import hashtag from "linkifyjs/plugins/hashtag";
import mention from "linkifyjs/plugins/mention";
import FollowingFollowerList from "../components/FollowingFollowerList";
import DetailPostModal from "../components/Post/DetailPostModal";
import SpinnerLoading from "../components/SpinnerLoading";

hashtag(linkify);
mention(linkify);

const linkifyOptions = {
  formatHref: function (href, type) {
    if (type === "hashtag") {
      href = "/hashtags/" + href.substring(1);
    }
    if (type === "mention") {
      href = "/" + href.substring(1);
    }
    return href;
  },
  attributes: {
    target: {
      url: "_blank",
    },
  },
};

class UserProfile extends Component {
  state = { username: "" };

  getFollowings = () => {
    const { dispatch, userProfileData } = this.props;
    dispatch(userActions.getUserProfileFollowings(userProfileData.data._id));
  };

  getFollowers = () => {
    const { dispatch, userProfileData } = this.props;
    dispatch(userActions.getUserProfileFollowers(userProfileData.data._id));
  };

  componentDidMount = () => {
    const { dispatch, userProfileData, match } = this.props;
    if (userProfileData.data.username !== match.params.username) {
      dispatch(userActions.getUserProfileData(match.params.username));
    }
  };

  fetchData = () => {
    const { dispatch, userProfileData } = this.props;
    const lastId =
      userProfileData.data.posts[userProfileData.data.posts.length - 1]._id;

    dispatch(
      userActions.getUserPosts({ userId: userProfileData.data._id, lastId })
    );
  };

  render() {
    const { userProfileData, fetchingUserData, alert } = this.props;
    const hasMore =
      userProfileData.data.postsCount === userProfileData.data.posts.length
        ? false
        : true;
    if (alert.type) {
      return (
        <div className="container">
          <Messages alert={alert} />
        </div>
      );
    }
    if (userProfileData.loadingUser || fetchingUserData) {
      return (
        <div className="relative min-h-[800px]">
          <SpinnerLoading size={120}/>
        </div>
      );
    } else {
      const posts = userProfileData.data.posts.map((post) => (
        <DetailPostModal key={post._id} post={post} user={userProfileData} />
      ));
      const followingList = userProfileData.data.follwingUsers.length
        ? userProfileData.data.follwingUsers.map(({ user }) => (
            <FollowingFollowerList
              key={user._id}
              user={user}
            ></FollowingFollowerList>
          ))
        : "No followings";

      const followerList = userProfileData.data.followerUsers.length
        ? userProfileData.data.followerUsers.map(({ user }) => (
            <FollowingFollowerList
              key={user._id}
              user={user}
            ></FollowingFollowerList>
          ))
        : "No followers";

      return (
        <Fragment>
          <header>
            <div className="container">
              <div className="profile">
                <div className="profile-image flex items-center justify-center rounded-full">
                  <img
                    src={`/images/profile-picture/100x100/${userProfileData.data.profilePicture}`}
                    alt=""
                    className="shadow-md !h-[156px] !w-[156px] object-cover rounded-full"
                  />
                </div>

                <div className="grid grid-cols-3 gap-x-4">
                  <h1 className="profile-user-name">
                    {userProfileData.data.username}
                  </h1>

                  <FollowButton
                    userId={userProfileData.data._id}
                  ></FollowButton>
                  <button className="bg-gray-200 rounded-lg !text-xl !font-semibold hover:bg-gray-300 p-4 col-span-2 md:col-span-1">
                    <a className="hover:text-black" href="/messages/chat">
                      Messages
                    </a>
                  </button>
                </div>

                <div className="profile-stats">
                  <ul>
                    <li>
                      <span className="profile-stat-count">
                        {userProfileData.data.postsCount}
                      </span>{" "}
                      posts
                    </li>
                    <Modal
                      trigger={
                        <li onClick={this.getFollowers}>
                          <span className="profile-stat-count">
                            {userProfileData.data.followers}
                          </span>{" "}
                          followers
                        </li>
                      }
                    >
                      <Modal.Header>Followers</Modal.Header>
                      <Modal.Content scrolling>
                        <Modal.Description>
                          <List selection verticalAlign="middle" size="huge">
                            {followerList}
                          </List>
                        </Modal.Description>
                      </Modal.Content>
                    </Modal>
                    <Modal
                      trigger={
                        <li onClick={this.getFollowings}>
                          <span className="profile-stat-count">
                            {userProfileData.data.followings}
                          </span>{" "}
                          following
                        </li>
                      }
                    >
                      <Modal.Header>Following</Modal.Header>
                      <Modal.Content scrolling>
                        <Modal.Description>
                          <List selection verticalAlign="middle" size="huge">
                            {followingList}
                          </List>
                        </Modal.Description>
                      </Modal.Content>
                    </Modal>
                  </ul>
                </div>

                <div className="profile-bio">
                  <div className="profile-real-name">
                    {userProfileData.data.firstName +
                      " " +
                      userProfileData.data.lastName}
                  </div>
                  <div className="profile-bio-description">
                    <Linkify options={linkifyOptions}>
                      {userProfileData.data.bio}
                    </Linkify>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main>
            <div className="container">
              {userProfileData.data.postsCount === 0 ? (
                <Message info size="large">
                  This user has no posts yet.
                </Message>
              ) : (
                <InfiniteScroll
                  className="gallery"
                  dataLength={userProfileData.data.posts.length}
                  next={this.fetchData}
                  hasMore={hasMore}
                  loader={<h4>Loading...</h4>}
                >
                  {posts}
                </InfiniteScroll>
              )}
            </div>
          </main>
          <Divider hidden></Divider>
        </Fragment>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  userProfileData: state.userProfile,
  fetchingUserData: state.user.loadingUser,
  user: state.user.data,
  alert: state.alert,
});

const connectedProfilePage = connect(mapStateToProps)(UserProfile);
export { connectedProfilePage as default };
