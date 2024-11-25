import React, { useState } from "react";
import { Icon, Modal } from "semantic-ui-react";
import PostDetail from "./PostDetail";

const DetailPostModal = ({ post, user }) => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                centered
                size="large"
                trigger={
                    <div className="gallery-item h-[200px] w-[200px]">
                        <img
                            src={
                                post.photo
                                    ? `/images/post-images/thumbnail/${post.photo}`
                                    : `/images/profile-picture/${user.data.profilePicture}`
                            }
                            className="w-full h-full object-cover"
                            alt=""
                        />

                        <div className="gallery-item-info">
                            <ul>
                                <li className="gallery-item-likes">
                                    <span className="visually-hidden">
                                        Likes:
                                    </span>
                                    <Icon name="heart" /> {post.likes}
                                </li>
                                <li className="gallery-item-comments">
                                    <span className="visually-hidden">
                                        Comments:
                                    </span>
                                    <Icon name="comment" /> {post.comments}
                                </li>
                            </ul>
                        </div>
                    </div>
                }
            >
                <div className="relative">
                    <span
                        className="cursor-pointer text-2xl absolute -top-8 -right-8 bg-white w-[24px] h-[24px] rounded-full flex items-center justify-center"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </span>
                    <PostDetail
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
                </div>
            </Modal>
        </div>
    );
};

export default DetailPostModal;
