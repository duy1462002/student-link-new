import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Comment, Icon, Button, Divider } from "semantic-ui-react";
import { commentActions } from "../../actions/commentActions";
import CommentReply from "./CommentReply";
import SpinnerLoading from "../SpinnerLoading";

class CommentReplies extends Component {
  state = {
    collapsed: true
  };

  handleCheckbox = () => {
    const {
      dispatch,
      replies,
      comment: { commentId }
    } = this.props;
    if (!replies[commentId].comments.length && !replies[commentId].fetching) {
      dispatch(
        commentActions.getPostCommentReplies(commentId, {
          initialFetch: true
        })
      );
    }
    this.setState({ collapsed: !this.state.collapsed });
  };

  fetchReplies = () => {
    const {
      dispatch,
      replies,
      comment: { commentId }
    } = this.props;

    if (!replies[commentId].fetching) {
      const lastId =
        replies[commentId].comments[replies[commentId].comments.length - 1]._id;
      dispatch(
        commentActions.getPostCommentReplies(commentId, {
          initialFetch: false,
          lastId
        })
      );
    }
  };

  render() {
    const { collapsed } = this.state;
    const {
      replies,
      comment: { commentId, repliesNum },
      post
    } = this.props;
    let comments = null;
    const hasMore =
      repliesNum === replies[commentId].comments.length ? false : true;
    const fetching = replies[commentId].fetching;

    if (replies[commentId].comments.length) {
      comments = replies[commentId].comments.map(comment => {
        return <CommentReply key={comment._id} comment={comment} post={post} />;
      });
    }

    return (
      <div>
        {repliesNum !== 0 ? (
          <div
            onClick={() => this.handleCheckbox()}
            style={{ cursor: "pointer", margin: "15px 0 8px 48px" }}
            className="font-semibold hover:underline"
          > 
            {repliesNum === 1 ? collapsed ? "View " + repliesNum + " reply" : "Show less" : collapsed ? "View all " + repliesNum + " replies" : "Show less"}

          </div>
        ) : null}
        <Comment.Group collapsed={collapsed} className={`relative ${fetching ? 'min-h-48' : ''}`}>
          {comments}
          {hasMore && !fetching ? (
            <Fragment>
              <Divider></Divider>
              <Button loading={fetching} onClick={this.fetchReplies}>
                Load {repliesNum - replies[commentId].comments.length} more
              </Button>
            </Fragment>
          ) : null}
          {fetching && <SpinnerLoading size={50} bgColor="white"/>}
        </Comment.Group>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  replies: state.replies
});

export default connect(mapStateToProps)(CommentReplies);
