import React, { Component } from "react";
import GroupPostFormModal from "../components/Group/GroupPostFormModal";
import AboutGroup from "./AboutGroup";
import { connect } from "react-redux";
import Post from "../components/Post/Post";
import { groupActions } from "../actions/groupActions";
import InfiniteScroll from "react-infinite-scroll-component";
import { Divider, Header, Icon } from "semantic-ui-react";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

class DiscussionPage extends Component {
  componentDidMount = () => {
    if(!this.props.posts.length) {
      this.fetchGroupPosts();
    }
  };

  fetchGroupPosts = () => {
    const { dispatch, currentGroup } = this.props;
    if (currentGroup._id) {
      dispatch(
        groupActions.getGroupPosts({
          initialFetch: true,
          groupId: currentGroup._id,
        })
      );
    }
  };

  // fetchData = () => {
  //   const { dispatch, posts } = this.props;
  //   dispatch(
  //     postActions.fetchPosts({
  //       initialFetch: false,
  //       lastId: posts[posts.length - 1]._id,
  //     })
  //   );
  // };
  render() {
    const { currentGroup, user, posts, fetchingPosts, totalPosts } = this.props;
    const { profilePicture } = user;

    const hasMore = false;
    const feedPosts = posts.map((post) => (
      <Post key={post._id} post={{ ...post, feed: true }} />
    ));
    console.log(posts);
    

    return (
      <div>
        <div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-4">
            <img
              src={`/images/profile-picture/100x100/${profilePicture}`}
              alt="avatar_user"
              style={{
                border: "1px solid #ccc",
              }}
              className="w-[46px] h-[46px] object-cover rounded-full"
            />
            <GroupPostFormModal user={user} group={currentGroup} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-[14px]">
          <div className="col-span-2 overflow-y-auto">
            <InfiniteScroll
              dataLength={posts.length} //This is important field to render the next data
              next={this.fetchData}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              endMessage={
                <Divider horizontal>
                  <Header as="h4">
                    <Icon name="eye" />
                    Yay! You have seen it all
                  </Header>
                </Divider>
              }
            >
              {fetchingPosts ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 mb-8"
                    >
                      <div className="flex items-center p-4">
                        <div>
                          <img
                            className="w-10 h-10 rounded-full skeleton"
                            id="logo-img"
                            alt=""
                          />
                        </div>
                        <h3 className="ml-4 flex-grow">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 skeleton skeleton-text"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 skeleton skeleton-text"></div>
                        </h3>
                      </div>

                      <div className="p-4">
                        <div className="mb-4">
                          <div className="h-4 bg-gray-200 rounded w-full mb-2 skeleton skeleton-text skeleton-text__body"></div>
                        </div>

                        <div className="h-[600px] bg-gray-200 rounded skeleton"></div>
                      </div>

                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-1/3 skeleton skeleton-footer"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                feedPosts
              )}
            </InfiniteScroll>
          </div>
          <div
            className="rounded-lg sideRight h-[330px] shadow-lg"
            style={{ transition: "top 0.3s" }}
          >
            <AboutGroup />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  fetchingGroupDetail: state.groups.fetchingGroupDetail,
  currentGroup: state.groups.currentGroup,
  user: state.user.data,
  posts: state.groups.posts,
  fetchingPosts: state.groups.fetchingPosts,
  totalPosts: state.groups.totalPosts,
});

export default connect(mapStateToProps)(DiscussionPage);
