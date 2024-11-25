import React from "react";
import { Icon, Modal, List } from "semantic-ui-react";
import { postActions } from "../../actions/postActions";
import { connect } from "react-redux";
import FollowingFollowerList from "../FollowingFollowerList";
import SpinnerLoading from "../SpinnerLoading";
import { postService } from "../../_services/postService";

const LikePost = ({
  dispatch,
  post: { postId, likes, authorId },
  postLikes,
  postLikeList
}) => {
  const [isShowLikeList, setIsShowLikeList] = React.useState(false);
  const [likeList, setLikeList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const handleFetchLikes = async () => {
    setLoading(true);
    await postService.getPostLikes(postId).then(
      res => {
        setLikeList(res.users[0].users_likes)
        setLoading(false);
      }
    ).catch(err => console.log(err))
  }
 
  React.useEffect(() => {
    handleFetchLikes();
  }, [postLikes, likes])

  const handlePostLike = async () => {
    dispatch(postActions.likePost(postId, authorId, postLikes));
  };

  const getPostLikesModal = () => {
  };

  const handleCloseModal = () => {
  };

  const handleShowLikeList = () => {
    if(!likeList.length) {
      handleFetchLikes();
    }

    setIsShowLikeList(true);
  };

  const handleCloseLikeList = () => {

    setIsShowLikeList(false);
  };

  const list = likeList.length
    ? likeList.map(({ author }) => (
      <FollowingFollowerList key={author._id} user={author}></FollowingFollowerList>
    ))
    : null;

  const likeListRender = likeList.length
    ? likeList.map(({ author }) => (
      <p className="!text-base" key={`${author._id}+${postId}`}>
        {author.username}
      </p>
    ))
    : null;

  return (
    <div className="relative flex gap-1">
      {postLikes.some((e) => e === postId) ? (
        <Icon
          onClick={handlePostLike}
          style={{ color: "#ed4956", cursor: "pointer" }}
          name="heart"
          className="heart-icon !text-2xl"
          onMouseEnter={() => handleShowLikeList()}
          onMouseLeave={() => handleCloseLikeList()}
        />
      ) : (
        <Icon
          onClick={handlePostLike}
          style={{ cursor: "pointer" }}
          name="heart outline"
          className="heart-icon !text-2xl !outline-none"
          onMouseEnter={() => handleShowLikeList()}
          onMouseLeave={() => handleCloseLikeList()}
        />
      )}
      <div
        className={`like-list p-4 absolute flex-col ${isShowLikeList && likes ? "flex" : "hidden"
          }`}
      >
        <h3 className="text-xl font-semibold mb-2">Likes</h3>
        <div className={`relative ${loading ? `min-h-14` : ""}`}>
          {loading ? (
            <SpinnerLoading size={50} bgColor="rgba(207, 206, 206, 0.9)" />
          ) : (
            likeListRender
          )}
        </div>
      </div>

      <Modal
        size="mini"
        trigger={
          <span
            style={{ cursor: "pointer", marginTop: "2px" }}
            onClick={getPostLikesModal}
            className="text-xl hover:text-[#591bc5] transition"
            onMouseEnter={() => handleShowLikeList()}
            onMouseLeave={() => handleCloseLikeList()}
          >
            {likes} likes
          </span>
        }
        onClose={handleCloseModal}
      >
        <Modal.Header>Likes</Modal.Header>
        <Modal.Content scrolling>
          <Modal.Description>
            <List verticalAlign="middle" size="huge">
              {list}
            </List>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  postLikes: state.user.data.postLikes,
  postLikeList: state.post.postLikes,
  likesListReducer: state.post.likesListReducer,
});

export default connect(mapStateToProps)(LikePost);
