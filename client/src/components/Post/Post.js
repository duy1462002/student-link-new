import React, { Component } from "react";
import { Icon, Button, Dropdown, Modal, Image } from "semantic-ui-react";
import { connect } from "react-redux";
import { postActions } from "../../actions/postActions";
import { commentActions } from "../../actions/commentActions";
import PostDetail from "./PostDetail";
import { Link } from "react-router-dom";
import LikePost from "./LikePost";
import PostForm from "./PostForm";
import Linkify from "linkifyjs/react";
import * as linkify from "linkifyjs";
import hashtag from "linkifyjs/plugins/hashtag";
import mention from "linkifyjs/plugins/mention";
import { history } from "../../_helpers/history";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import SpinnerLoading from "../SpinnerLoading";
import PostCommentsFeed from "../Comments/PostCommentsFeed";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

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

class Post extends Component {
  state = {
    open: false,
    loadedImg: false,
    value: "",
    showTags: false,
    openDetailPost: false,
    optionsLoggedIn: [
      { key: "copy", icon: "copy", text: "Copy link", value: "copy" },
      {
        key: "goto",
        icon: "paper plane",
        text: "Go to post",
        value: "goto",
      },
      { key: "delete", icon: "delete", text: "Delete", value: "delete" },
    ],
    optionsNotLoggedIn: [
      { key: "copy", icon: "copy", text: "Copy link", value: "copy" },
      {
        key: "goto",
        icon: "paper plane",
        text: "Go to post",
        value: "goto",
      },
    ],
  };

  close = () => this.setState({ open: false, value: "" });

  handleToggleTags = () => {
    this.setState({ showTags: !this.state.showTags });
  };

  getPostComments = () => {
    const { dispatch, post, comments } = this.props;
    if (
      !comments[post._id].comments.length &&
      !comments[post._id].fetching &&
      post.comments
    ) {
      dispatch(
        commentActions.getPostComments(post._id, { initialFetch: true })
      );
    }
  };

  deletePost = () => {
    const { dispatch, post } = this.props;
    dispatch(postActions.deletePost(post._id));
    dispatch(postActions.fetchPosts({ initialFetch: true }));
    toast.success('Delete post successfully');
  };

  handleChange = (e, { name, value }) => {
    this.setState({ value, open: false });
    if (value === "goto") {
      history.push("/p/" + this.props.post._id);
      this.setState({ value, open: false });
    }
    if (value === "delete") {
      this.setState({ value, open: true });
    }
    if (value === "copy") {
      navigator.clipboard.writeText(
        window.location.host + "/p/" + this.props.post._id
      );
    }
  };

  handleClose = () => {
    this.setState({ value: "", open: false });
  };

  render() {
    const { post, _id, username, profilePicture, deleting } = this.props;
    const { open, optionsLoggedIn, optionsNotLoggedIn, value, showTags } =
      this.state;
    const isFeedMarginBottom = post.feed ? "2rem" : "0";
    const renderDivs = post.tags.map((div, index) => (
      <div
        key={index}
        className="text-box"
        style={{
          top: div.y + "%",
          left: div.x + "%",
          display: showTags ? "block" : "none",
        }}
      >
        <div className="tooltip tooltip-top">
          {div.value === username ? (
            <Link to={"/profile"}>{div.value}</Link>
          ) : (
            <Link to={"/" + div.value}>{div.value}</Link>
          )}
        </div>
      </div>
    ));
    const ribbon = post.tags.length ? (
      <div className="ribbon">
        <Icon
          circular
          size="large"
          name="users"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            display: showTags ? "none" : "block",
          }}
        />
      </div>
    ) : null;
    return (
      <div
        className="post shadow-lg card-border-primary "
        style={{ marginBottom: isFeedMarginBottom }}
      >
        <div className="post-header">
          <div className="post-label">
            <div className="label-image">
              <img
                src={`/images/profile-picture/100x100/${post.author[0].profilePicture}`}
                alt=""
                className="!w-14"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="label-info">
                <div className="label-username">
                  <Link
                    to={
                      post.author[0].username === username
                        ? "/profile"
                        : "/" + post.author[0].username
                    }
                  >
                    {post.author[0].username}
                  </Link>
                </div>
                <div className="label-time">
                  {dayjs(post.createdAt).fromNow()}
                </div>
              </div>
              {post.location && post.location.address !== "" ? (
                <div className="label-location">
                  <Link
                    to={`/location/${post.location.coordinates[0]},${post.location.coordinates[1]}`}
                  >
                    {post.location.address}
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
          <div className="post-options">
            <Modal open={open} onClose={this.close} size="tiny">
              <Modal.Header>Delete Your Post</Modal.Header>
              <Modal.Content>
                <p>Are you sure you want to delete your post</p>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={this.close}>
                  No
                </Button>
                <Button
                  className="!bg-[#591bc5] !text-white relative !w-24 h-[32px]"
                  onClick={this.deletePost}
                >
                  {deleting  ? (
                      <SpinnerLoading size={36} bgColor="#591BC5" />
                    ) : (
                      "Yes"
                    )}
                </Button>
              </Modal.Actions>
            </Modal>
            {post.author[0]._id === _id ? (
              <Button.Group>
                <Dropdown
                  selectOnNavigation={false}
                  onChange={this.handleChange}
                  value={value}
                  className="button icon"
                  floating
                  options={optionsLoggedIn}
                  trigger={<React.Fragment />}
                />
              </Button.Group>
            ) : (
              <Button.Group>
                <Dropdown
                  selectOnNavigation={false}
                  onChange={this.handleChange}
                  value={value}
                  className="button icon"
                  floating
                  options={optionsNotLoggedIn}
                  trigger={<React.Fragment />}
                />
              </Button.Group>
            )}
          </div>
        </div>

        <div
          className={`post-image relative flex ${
            post.photo !== null && "min-h-[200px] bg-slate-100 justify-center"
          } `}
        >
          {this.state.loadedImg ? (
            <></>
          ) : (
            <div>
              {!post.photo ? (
                <></>
              ) : (
                <div>
                  <SpinnerLoading size={90} bgColor="white" />
                  <Image src={`/images/post-images/thumbnail/${post.photo}`} />
                </div>
              )}
            </div>
          )}
          {!post.photo ? (
            <></>
          ) : (
            <img
              onClick={this.handleToggleTags}
              onLoad={() => this.setState({ loadedImg: true })}
              style={this.state.loadedImg ? {} : { display: "none" }}
              src={`/images/post-images/${post.photo}`}
              alt=""
            />
          )}
          {ribbon}
          {renderDivs}
        </div>
        {post.description ? (
          <div className="post-description text-xl">
            <Linkify options={linkifyOptions}>{post.description}</Linkify>
          </div>
        ) : null}
        {!post.document ? (
          <></>
        ) : (
          <div className="w-full bg-white overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">Document</h2>
              <p className="text-gray-600 mb-4"></p>
              <a
                href={
                  post.document
                    ? require(`../../../../public/documents/${post.document}`)
                    : "#"
                }
                download={post.document || "default.doc"}
                className="inline-flex items-center gap-3 px-4 py-2 bg-[#591bc5] text-white font-semibold rounded-lg shadow-md hover:opacity-90 hover-text-white"
              >
                <i className="fa-solid fa-file-arrow-down"></i>
                Download {post.document || "default.doc"}
              </a>
            </div>
          </div>
        )}
        <div
          style={{
            borderTop: "1px solid #ccc",
          }}
          className="post-footer flex items-center p-3"
        >
          <div className="footer-likes">
            <LikePost
              post={{
                postId: post._id,
                photo: post.photo,
                authorId: post.author[0]._id,
                likes: post.likes,
              }}
            />
          </div>
          <Modal
            open={this.state.openDetailPost}
            onClose={() => this.setState({ openDetailPost: false })}
            onOpen={() => this.setState({ openDetailPost: true })}
            centered
            size="large"
            trigger={
              <div className="footer-comments">
                <Icon
                  name="comment outline"
                  style={{ cursor: "pointer" }}
                  onClick={this.getPostComments}
                  className="!text-2xl !outline-none"
                />
                <div
                  className="text-xl hover:text-[#591bc5] cursor-pointer transition"
                  style={{ marginTop: "2px" }}
                  onClick={this.getPostComments}
                >
                  {post.comments} comments
                </div>
              </div>
            }
          >
            <div className="relative">
              <PostDetail post={this.props.post} />
            </div>
          </Modal>
        </div>

        <PostCommentsFeed
          post={{
            postId: post._id,
            commentsCount: post.comments,
            photo: post.photo,
            authorId: post.author[0]._id,
          }}
        />

        <div className="post-form flex gap-2 !pt-0">
          <img
            src={`/images/profile-picture/100x100/${profilePicture}`}
            alt=""
            className="w-12 h-12 rounded-full"
          />
          <PostForm
            post={{
              postId: post._id,
              authorId: post.author[0]._id,
              photo: post.photo,
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { _id, username, profilePicture } = state.user.data;

  return {
    _id,
    username,
    profilePicture,
    comments: state.comments,
    deleting: state.post.deleting
  };
};

export default connect(mapStateToProps)(Post);
