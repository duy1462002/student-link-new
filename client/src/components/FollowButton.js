import React from "react";
import { connect } from "react-redux";
import { userActions } from "../actions/userActions";

function FollowButton({ userId, user, dispatch }) {
  const handleFollowCLick = () => {
    dispatch(userActions.followUser(userId));
  };

  if (user._id === userId) {
    return null;
  }

  return user.followingIds.some((e) => e === userId) ? (
    <button
      onClick={handleFollowCLick}
      className="bg-gray-200 rounded-lg !text-xl !font-semibold hover:bg-[#591bc5] hover:text-white transition p-4 col-span-2 md:col-span-1"
    >
      Unfollow
    </button>
  ) : (
    <button
      className="bg-gray-200 rounded-lg !text-xl !font-semibold hover:bg-[#591bc5] hover:text-white transition p-4 col-span-2 md:col-span-1"
      primary
      onClick={handleFollowCLick}
      fluid
    >
      Follow
    </button>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.data,
});
const connectedFollowButton = connect(mapStateToProps)(FollowButton);
export { connectedFollowButton as FollowButton };