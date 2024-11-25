import React, { Component } from "react";
import { Button, Form, Popup } from "semantic-ui-react";
import { connect } from "react-redux";
import { commentActions } from "../../actions/commentActions";
import "react-autocomplete-input/dist/bundle.css";
import { debounce } from "throttle-debounce";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

import {
    EditorState,
    convertToRaw,
    Modifier,
    getDefaultKeyBinding,
} from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin from "draft-js-mention-plugin";
import editorStyles from "../../styles/editorStyles.module.css";
import "draft-js-mention-plugin/lib/plugin.css";
import mentionsStyles from "../../styles/mentionsStyles.module.css";

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
        str =
            str.slice(0, offset) + "@" + username + str.slice(offset + length);
    }

    return str;
}

class PostForm extends Component {
    constructor() {
        super();
        this.state = {
            // this trỏ đến PostForm
            value: "",
            part: "",
            suggestions: [],
            editorState: EditorState.createEmpty(),
        };
        this.buttonRef = React.createRef();
        this.mentionPlugin = createMentionPlugin({
            theme: mentionsStyles,
        });

        this.debouncedRequestOptions = debounce(500, this.onSearchChange);
    }

    getResetEditorState = (editorState) => {
        const blocks = editorState.getCurrentContent().getBlockMap().toList();
        const updatedSelection = editorState.getSelection().merge({
            anchorKey: blocks.first().get("key"),
            anchorOffset: 0,
            focusKey: blocks.last().get("key"),
            focusOffset: blocks.last().getLength(),
        });
        const newContentState = Modifier.removeRange(
            editorState.getCurrentContent(),
            updatedSelection,
            "forward"
        );

        const newState = EditorState.push(
            editorState,
            newContentState,
            "remove-range"
        );
        this.setState({ editorState: newState });
        // return removeSelectedBlocksStyle(newState);
    };

    pushTextToCurrentEditorState(emoji) {
        const editorState = this.state.editorState;
        const selection = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        const ncs = Modifier.insertText(contentState, selection, emoji);
        const es = EditorState.push(editorState, ncs, "insert-fragment");
        this.setState({ editorState: es });
    }

    handlePostCommentSubmit = () => {
        const {
            dispatch,
            post: { postId, authorId },
        } = this.props;

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
                commentActions.addComment({ value: result, postId, authorId })
            );
            // const editorState = EditorState.push(
            //   this.state.editorState,
            //   ContentState.createFromText("")
            // );
            // this.setState({ editorState });
            this.getResetEditorState(this.state.editorState);
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
                            key: person._id,
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
        const { editorState, suggestions } = this.state;
        const { MentionSuggestions } = this.mentionPlugin;
        const plugins = [this.mentionPlugin];
        return (
            <Form
                reply
                onSubmit={this.handlePostCommentSubmit}
                className="relative w-full flex"
            >
                <div className={`${editorStyles.editor} w-full relative`}>
                    <Editor
                        editorState={editorState}
                        onChange={this.onChange}
                        plugins={plugins}
                        placeholder="Add a comment..."
                        keyBindingFn={this.keyBindingFn}
                    />

                    <MentionSuggestions
                        onSearchChange={this.debouncedRequestOptions}
                        suggestions={suggestions}
                    />
                </div>

                <Popup
                    trigger={
                        <Button
                            onClick={(e) => e.preventDefault()}
                            className=" !bg-transparent !mr-0 !px-3 !py-2"
                        >
                            <i
                                className="fa-regular fa-face-smile text-xl text-[#591bc5] hover:text-purple-950 transition"
                                aria-hidden="true"
                            ></i>
                        </Button>
                    }
                    content={<Picker native={true} onSelect={this.addEmoji} />}
                    pinned={"true"}
                    on="click"
                    basic
                    style={{ padding: "0", border: "0" }}
                />

                <button
                    className=" !bg-transparent !mr-0 !px-3 !py-2"
                    ref={this.buttonRef}
                >
                    <i className="fa-solid fa-paper-plane text-xl text-[#591bc5] hover:text-purple-950 transition"></i>
                </button>
            </Form>
        );
    }
}

export default connect(null)(PostForm);
