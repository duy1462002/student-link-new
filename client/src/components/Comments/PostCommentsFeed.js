import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Button, Comment, Divider } from "semantic-ui-react";
import { commentActions } from "../../actions/commentActions";
import PostComment from "./PostComment";
import SpinnerLoading from "../SpinnerLoading";

class PostCommentsFeed extends Component {
  state = {
    commentText: "",
  };

  handleScroll = (e, hasMore) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && hasMore) {
      this.fetchData();
    }
  };

  fetchData = () => {
    const { dispatch, post, comments } = this.props;
    if (!comments[post.postId].fetching) {
      const lastId =
        comments[post.postId].comments[
          comments[post.postId].comments.length - 1
        ]._id;
      dispatch(
        commentActions.getPostComments(post.postId, {
          initialFetch: false,
          lastId,
        })
      );
    }
  };

  render() {
    const { post, comments, newComments } = this.props;
    if (comments[post.postId]) {
      const fetchedComments = comments[post.postId].comments;
      const newCommentIds = newComments.map((comment) => comment._id);
      const filteredComments = fetchedComments.filter((comment) =>
        newCommentIds.includes(comment._id)
      );

      const postComments = filteredComments.map((comment) => (
        <PostComment key={comment._id} comment={comment} post={post} />
      ));
      return (
        <div className="post-comments">
          <Comment.Group
            size="large"
          >
            {postComments.length ? postComments : null}  
          </Comment.Group>
        </div>
      );
    } else return null;
  }
}

const mapStateToProps = (state) => ({
  comments: state.comments,
  newComments: state.comments.newComments,
});

export default connect(mapStateToProps)(PostCommentsFeed);
