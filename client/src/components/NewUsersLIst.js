import React, { Component, Fragment } from "react";
import { List, Image, Modal } from "semantic-ui-react";
import { connect } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import SpinnerLoading from "./SpinnerLoading";
import PostDetail from "./Post/PostDetail";

dayjs.extend(relativeTime);

class NewUsersList extends Component {
    state = {
        openDetailPostId: null, // Store the ID of the post whose modal is open
    };

    handleOpenModal = (postId) => {
        this.setState({ openDetailPostId: postId });
    };

    handleCloseModal = () => {
        this.setState({ openDetailPostId: null });
    };

    render() {
        const { userPosts, loadingUser, user } = this.props;

        const { openDetailPostId } = this.state;
        console.log("userPosts: ", userPosts);

        const posts = userPosts.map((post, index) => {
            if (index > 4) return null;
            return (
                <Modal
                    key={post._id}
                    open={openDetailPostId === post._id} // Open modal if the post ID matches the openDetailPostId
                    onClose={this.handleCloseModal}
                    onOpen={() => this.handleOpenModal(post._id)}
                    centered
                    size="large"
                    trigger={
                        <div>
                            <List.Item className="flex items-center px-5 py-3 gap-4 hover:bg-slate-100 transition cursor-pointer">
                                <Image
                                    className="w-16 h-16 rounded-md"
                                    src={
                                        post.photo
                                            ? `/images/post-images/thumbnail/${post.photo}` // Use the post photo as the image source
                                            : `/images/profile-picture/100x100/${user.data.profilePicture}` // Use User profile picture as the default image
                                    }
                                />
                                <List.Content className="flex flex-col gap-1">
                                    <List.Header className="max-w-[160px] text-elips">
                                        {post.description}
                                    </List.Header>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <i className="fa-regular fa-heart"></i>
                                            <div className="text-xl">
                                                {post.likes}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <i className="fa-regular fa-comment"></i>
                                            <div className="text-xl">
                                                {post.comments}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="label-time !justify-start">
                                        {dayjs(post.createdAt).fromNow()}
                                    </div>
                                </List.Content>
                            </List.Item>
                        </div>
                    }
                >
                    <div className="relative">
                        <PostDetail
                            post={{
                                ...post,
                                author: [
                                    {
                                        profilePicture:
                                            user.data.profilePicture,
                                        username: user.data.username,
                                        _id: user.data._id,
                                    },
                                ],
                            }}
                        />
                    </div>
                </Modal>
            );
        });

        return (
            <div className="right-sidebar">
                <Fragment>
                    <List size="big">
                        {
                            <List.Item>
                                <List.Content>
                                    <List.Header
                                        className="px-5 py-4 text-2xl !font-semibold"
                                        style={{
                                            borderBottom: "1px solid #e6e6e6",
                                        }}
                                    >
                                        {" "}
                                        <i className="fa-solid fa-images text-2xl mr-3"></i>
                                        My posts
                                    </List.Header>
                                </List.Content>
                            </List.Item>
                        }
                        {loadingUser ? (
                            <div className="min-h-[300px] relative">
                                <SpinnerLoading size={80} bgColor="white" />
                            </div>
                        ) : (
                            <div className="">{posts}</div>
                        )}
                    </List>
                </Fragment>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    userPosts: state.user.data.posts,
    loadingUser: state.user.loadingUser,
    user: state.user,
});

const connectedNewUsersList = connect(mapStateToProps)(NewUsersList);
export { connectedNewUsersList as NewUsersList };
