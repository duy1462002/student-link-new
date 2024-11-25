import React, { Component } from "react";
import { connect } from "react-redux";
import { userActions } from "../actions/userActions";
import Post from "../components/Post/Post";
import { Modal } from "semantic-ui-react";
import { groupActions } from "../actions/groupActions";

class MediaGroup extends Component {
  fetchData = () => {
    const { dispatch, user } = this.props;
    // const lastId = user.data.posts[user.data.posts.length - 1]._id;
    // console.log('fetching:', this.props.match.params.groupId);
    dispatch(
      groupActions.getGroupPosts({
        initialFetch: true,
        groupId: this.props.match.params.groupId,
      })
    );
  };

  // getFollowings = () => {
  //   const { dispatch, user } = this.props;
  //   dispatch(userActions.getFollowings(user.data._id));
  // };

  // getFollowers = () => {
  //   const { dispatch, user } = this.props;
  //   dispatch(userActions.getFollowers(user.data._id));
  // };

  componentDidMount() {
    if(!this.props.posts.length) {
      this.fetchData();
    }
  }
  render() {
    const { user, alert, currentGroup, posts } = this.props;
    const hasMore =
      user.data.postsCount === user.data.posts.length ? false : true;
      console.log(posts);
    const feedPosts = posts.map((post) => {
      return (
        <Modal
          key={post._id}
          size="large"
          trigger={
            <div className="gallery-item">
              <img
                src={`/images/post-images/thumbnail/${post.photo}`}
                className="gallery-image"
                alt=""
              />

              {/* <div className="gallery-item-info">
                <ul>
                  <li className="gallery-item-likes">
                    <span className="visually-hidden">Likes:</span>
                    <Icon name="heart" /> {post.likes}
                  </li>
                  <li className="gallery-item-comments">
                    <span className="visually-hidden">Comments:</span>
                    <Icon name="comment" /> {post.comments}
                  </li>
                </ul>
              </div> */}
            </div>
          }
        >
          <Post
            post={{
              ...post,
              author: [
                {
                  profilePicture: user.data.profilePicture,
                  username: user.data.username,
                  _id: user.data._id,
                },
              ],
            }}
          />
        </Modal>
      );
    });
    return (
      // <div className="bg-white rounded-lg p-4">
      //   <div className="">
      //     <span className="text-3xl font-semibold mb-2 ">Your posts</span>
      //     {user.data.postsCount === 0 ? (
      //       <Message info size="big">
      //         You have no posts. Share your first picture:{" "}
      //       </Message>
      //     ) : (
      //       <InfiniteScroll
      //         className="gallery"
      //         dataLength={user.data.posts.length}
      //         next={this.fetchData}
      //         hasMore={hasMore}
      //         loader={<h4>Loading...</h4>}
      //       >
      //         {posts}
      //       </InfiniteScroll>
      //     )}
      //   </div>
      // </div>
      <div className="grid grid-cols-4 gap-4">{feedPosts}</div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  alert: state.alert,
  currentGroup: state.groups.currentGroup,
  posts: state.groups.posts,
});

export default connect(mapStateToProps)(MediaGroup);
