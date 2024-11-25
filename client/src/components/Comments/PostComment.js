import React, { Component } from "react";
import { Comment, Form, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { commentActions } from "../../actions/commentActions";
import CommentReplies from "../CommentReplies/CommentReplies";
import LikeComment from "./LikeComment";
import "react-autocomplete-input/dist/bundle.css";
import { debounce } from "throttle-debounce";

import Linkify from "linkifyjs/react";
import * as linkify from "linkifyjs";
import hashtag from "linkifyjs/plugins/hashtag";
import mention from "linkifyjs/plugins/mention";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

import {
  EditorState,
  convertToRaw,
  Modifier,
  ContentState,
  getDefaultKeyBinding,
} from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin from "draft-js-mention-plugin";
import editorStyles from "../../styles/editorStyles.module.css";
import "draft-js-mention-plugin/lib/plugin.css";
import mentionStylesCommentReplies from '../../styles/mentionStylesCommentReplies.module.css';

dayjs.extend(relativeTime);

hashtag(linkify);
mention(linkify);

function searchUser(q) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q }),
  };

  return fetch("/api/user/searchByUsername", requestOptions).then((res) => {
    return res;
  });
}

function replaceAtOffsets(str, offsets, mentions) {
  offsets.sort((a, b) => b.offset - a.offset);

  for (let offsetObj of offsets) {
    let { key, length, offset } = offsetObj;
    let mention = mentions[key];
    let username = mention.username;

    str = str.slice(0, offset) + "@" + username + str.slice(offset + length);
  }

  return str;
}

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

class PostComment extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      part: "",
      suggestions: [],
      editorState: EditorState.createEmpty(),
    };
    this.buttonRef = React.createRef();
    this.mentionPlugin =
      createMentionPlugin({
        theme: mentionStylesCommentReplies,
      });
    this.debouncedRequestOptions = debounce(500, this.handleRequestOptions);
  }

  pushTextToCurrentEditorState(emoji) {
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const ncs = Modifier.insertText(contentState, selection, emoji);
    const es = EditorState.push(editorState, ncs, "insert-fragment");
    this.setState({ editorState: es });
  }

  handleFormToggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleSubmit = () => {
    const { dispatch, post, comment } = this.props;

    const contentState = this.state.editorState.getCurrentContent();
    const raw = convertToRaw(contentState);

    let string = raw.blocks[0].text;
    let offsets = raw.blocks[0].entityRanges.map((offset) => offset);
    let mentionedUsers = [];
    for (let key in raw.entityMap) {
      const ent = raw.entityMap[key];
      if (ent.type === "mention") {
        mentionedUsers.push(ent.data.mention);
      }
    }

    let result = replaceAtOffsets(string, offsets, mentionedUsers);

    if (result !== "") {
      dispatch(
        commentActions.addCommentReply({
          text: result,
          commentId: comment._id,
          postId: post.postId,
          authorId: comment.author[0]._id,
        })
      );
      const editorState = EditorState.push(
        this.state.editorState,
        ContentState.createFromText("")
      );
      this.setState({ editorState });
    }
  };

  addEmoji = (e) => {
    let emoji = e.native;
    this.pushTextToCurrentEditorState(emoji);
  };

  onChange = (editorState) => {
    this.setState({ editorState });
  };

  onSearchChange = ({ value }) => {
    if (value !== "") {
      searchUser(value).then((response) => {
        response.json().then((results) => {
          this.setState({
            suggestions: results.users.map((person) => ({
              name: `${person.firstName} ${person.lastName}`,
              avatar: `/images/profile-picture/100x100/${person.profilePicture}`,
              username: person.username,
              key: person.username,
            })),
          });
        });
      });
    }
  };

  keyBindingFn = (e) => {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        if (this.buttonRef.current) {
          this.buttonRef.current.click();
        }
        return "handled";
      }
    }
    return getDefaultKeyBinding(e);
  };

  render() {
    const { post, comment, username } = this.props;
    const { isOpen, suggestions, editorState } = this.state;
    const { MentionSuggestions } = this.mentionPlugin;
    const plugins = [this.mentionPlugin];
    return (
      <Comment className="relative">
        <Comment.Avatar
          src={`/images/profile-picture/100x100/${comment.author[0].profilePicture}`}
        />
        <Comment.Content>
          <Comment.Author
            as={Link}
            to={
              comment.author[0].username === username
                ? "/profile"
                : "/" + comment.author[0].username
            }
          >
            {comment.author[0].firstName + " " + comment.author[0].lastName}
          </Comment.Author>
          <Comment.Metadata>
            <div>{dayjs(comment.createdAt).fromNow()}</div>
          </Comment.Metadata>
          <Comment.Text style={{ whiteSpace: "pre-line" }}>
            <Linkify options={linkifyOptions}>{comment.text}</Linkify>
          </Comment.Text>
          <Comment.Actions>
            <Comment.Action onClick={() => this.handleFormToggle()}>
              Reply
            </Comment.Action>
            <LikeComment
              comment={{
                commentId: comment._id,
                commentText: comment.text,
                likes: comment.likes,
                authorId: comment.author[0]._id,
              }}
              post={{
                postId: post.postId,
                photo: post.photo,
              }}
            />
          </Comment.Actions>
          {isOpen ? (
            <Form
              reply
              onSubmit={() => this.handleSubmit()}
              className="relative w-full flex"
            >
              <div className={`${editorStyles.editor} w-full`}>
                <Editor
                  editorState={editorState}
                  onChange={this.onChange}
                  plugins={plugins}
                  placeholder="Add a comment..."
                  keyBindingFn={this.keyBindingFn}
                />
                <MentionSuggestions
                  onSearchChange={this.onSearchChange}
                  suggestions={suggestions}
                />
              </div>

              <Popup
                trigger={
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="!bg-transparent !mr-0 !px-3 !py-2"
                  >
                    <i
                      className="fa-regular fa-face-smile text-xl text-[#591bc5] hover:text-purple-950 transition"
                      aria-hidden="true"
                    ></i>
                  </button>
                }
                content={<Picker native={true} onSelect={this.addEmoji} />}
                pinned={"true"}
                on="click"
                basic
                style={{ padding: "0", border: "0" }}
              />

              <button
                className="!bg-transparent !mr-0 !px-3 !py-2"
                ref={this.buttonRef}
              >
                <i className="fa-solid fa-paper-plane text-xl text-[#591bc5] hover:text-purple-950 transition"></i>
              </button>
            </Form>
          ) : null}
        </Comment.Content>
        <CommentReplies
          comment={{
            commentId: comment._id,
            //number fo replies
            repliesNum: comment.replies,
          }}
          post={{
            postId: post.postId,
            photo: post.photo,
          }}
        />
      </Comment>
    );
  }
}

const mapStateToProps = (state) => ({
  // logged in user username
  username: state.user.data.username,
});

export default connect(mapStateToProps)(PostComment);
