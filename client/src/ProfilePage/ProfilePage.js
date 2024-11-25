import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Modal, List, Divider, Message } from "semantic-ui-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { userActions } from "../actions/userActions";
import {
  EditProfileModal,
  ImageCropModal,
} from "../components/EditProfileModal";
import Messages from "../components/Messages";
import Linkify from "linkifyjs/react";
import * as linkify from "linkifyjs";
import hashtag from "linkifyjs/plugins/hashtag";
import mention from "linkifyjs/plugins/mention";
import FollowingFollowerList from "../components/FollowingFollowerList";
import SpinnerLoading from "../components/SpinnerLoading";
import DetailPostModal from "../components/Post/DetailPostModal";

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

class ProfilePage extends Component {
  componentDidMount = () => {
    document.title = "Profile | social-network";
  };

  fetchData = () => {
    const { dispatch, user } = this.props;
    const lastId = user.data.posts[user.data.posts.length - 1]._id;
    dispatch(userActions.getPosts({ userId: user.data._id, lastId }));
  };

  getFollowings = () => {
    const { dispatch, user } = this.props;
    dispatch(userActions.getFollowings(user.data._id));
  };

  getFollowers = () => {
    const { dispatch, user } = this.props;
    dispatch(userActions.getFollowers(user.data._id));
  };

  render() {
    const { user, alert } = this.props;
    const hasMore =
      user.data.postsCount === user.data.posts.length ? false : true;

    const posts = user.data.posts.map((post) => (
      <DetailPostModal key={post._id} post={post} user={user} />
    ));

    const followingList = user.data.follwingUsers.length
      ? user.data.follwingUsers.map(({ user }) => (
          <FollowingFollowerList
            key={user._id}
            user={user}
          ></FollowingFollowerList>
        ))
      : "No followings";

    const followerList = user.data.followerUsers.length
      ? user.data.followerUsers.map(({ user }) => (
          <FollowingFollowerList
            key={user._id}
            user={user}
          ></FollowingFollowerList>
        ))
      : "No followers";

    return (
      <div className="main pb-[100px] relative bg-white p-4 rounded-xl card-border-primary">
        {user.loadingUser ? (
          <SpinnerLoading size={100} bgColor="white"/>
        ) : (
          <Fragment>
            {user.deleting ? <SpinnerLoading /> : null}

            <header>
              <div className="">
                {alert.type ? <Messages alert={alert} /> : null}
                <div className="profile ">
                  <div className="profile-image relative flex items-center justify-center">
                    <img
                      src={`/images/profile-picture/100x100/${user.data.profilePicture}`}
                      alt=""
                      className="shadow-md !h-[156px] !w-[156px] object-cover rounded-full"
                    />
                    <label className="absolute w-[156px] bottom-0 h-1/2">
                      <ImageCropModal />
                    </label>
                  </div>

                  <div className="profile-user-settings grid grid-cols-4 md:grid-cols-3 items-center gap-4">
                    <h1 className="profile-user-name col-span-3 md:col-span-1">
                      {user.data.username}
                    </h1>
                    <EditProfileModal>
                      <button className="bg-gray-200 rounded-lg !text-xl !font-semibold hover:bg-gray-300 p-4 col-span-2 md:col-span-1">
                        Edit profile
                      </button>
                    </EditProfileModal>
                    <button className="bg-gray-200 rounded-lg !text-xl !font-semibold hover:bg-gray-300 p-4 col-span-2 md:col-span-1">
                      View archive
                    </button>
                  </div>

                  <div className="profile-stats">
                    <ul>
                      <li>
                        <span className="profile-stat-count">
                          {user.data.postsCount}
                        </span>{" "}
                        posts
                      </li>
                      <Modal
                        trigger={
                          <li onClick={this.getFollowers}>
                            <span className="profile-stat-count">
                              {user.data.followers}
                            </span>{" "}
                            followers
                          </li>
                        }
                      >
                        <Modal.Header>Followers</Modal.Header>
                        <Modal.Content scrolling>
                          <Modal.Description>
                            <List verticalAlign="middle" size="huge">
                              {followerList}
                            </List>
                          </Modal.Description>
                        </Modal.Content>
                      </Modal>
                      <Modal
                        trigger={
                          <li onClick={this.getFollowings}>
                            <span className="profile-stat-count">
                              {user.data.followings}
                            </span>{" "}
                            following
                          </li>
                        }
                      >
                        <Modal.Header>Following</Modal.Header>
                        <Modal.Content scrolling>
                          <Modal.Description>
                            <List verticalAlign="middle" size="huge">
                              {followingList}
                            </List>
                          </Modal.Description>
                        </Modal.Content>
                      </Modal>
                    </ul>
                  </div>
                  <div className="profile-bio">
                    <div className="profile-real-name">
                      {user.data.firstName + " " + user.data.lastName}
                    </div>
                    <div className="profile-bio-description">
                      <Linkify options={linkifyOptions}>
                        {user.data.bio}
                      </Linkify>
                    </div>
                  </div>
                </div>
                <div className=" flex items-center w-full">
                  <button className=" rounded-full border border-gray-300">
                    <a
                      id="uploads_img"
                      href="/posts/upload"
                      aria-label="add_new_post"
                      className="p-14 block"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </a>
                  </button>
                  <a
                    htmlFor="uploads_img"
                    href="/posts/upload"
                    className="!text-2xl p-4 bg-gray-200 w-full ml-4 rounded-lg"
                  >
                    Do you want upload somethings ?
                  </a>
                </div>
              </div>
            </header>
            <main>
              <div className="">
                <span className="text-3xl font-semibold mb-2 ">Your posts</span>
                {user.data.postsCount === 0 ? (
                  <Message info size="big">
                    You have no posts. Share your first picture:{" "}
                  </Message>
                ) : (
                  <InfiniteScroll
                    className="gallery"
                    dataLength={user.data.posts.length}
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
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  alert: state.alert,
});

const connectedProfilePage = connect(mapStateToProps)(ProfilePage);
export { connectedProfilePage as default };
