import React, { Component } from "react";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";
import { postActions } from "../../actions/postActions";
import { Dimmer, Loader, Divider, Header, Icon } from "semantic-ui-react";

class FeedGroup extends Component {
  componentDidMount() {
    const { dispatch, posts } = this.props;
    if (!posts.length) {
      dispatch(postActions.fetchPosts({ initialFetch: true }));
    }
  }

  fetchData = () => {
    const { dispatch, posts } = this.props;
    dispatch(
      postActions.fetchPosts({
        initialFetch: false,
        lastId: posts[posts.length - 1]._id,
      })
    );
  };

  render() {
    const { loadingUser, fetching, posts, totalPosts, post } = this.props;
    const hasMore = posts.length === totalPosts ? false : true;
    const feedPosts = posts.map((post) => (
      <Post key={post._id} post={{ ...post, feed: true }} />
    ));

    return (
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
        {fetching && post.fetching ? (
          <>
            {[1, 2, 3].map((i) => (
              <div className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 mb-8">
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

                  <div className="h-40 bg-gray-200 rounded skeleton"></div>
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
    );
  }
}

const mapStateToProps = (state) => ({
  posts: state.post.posts,
  totalPosts: state.post.totalPosts,
  loadingUser: state.user.loadingUser,
  fetching: state.post.fetching,
  post: state.post.post,
});

export default connect(mapStateToProps)(FeedGroup);
