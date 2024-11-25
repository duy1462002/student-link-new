import React, { Component } from "react";
import { connect } from "react-redux";
import EditAboutGroupModal from "../components/Group/EditAboutGroupModal";

class AboutGroup extends Component {
  render() {
    const { currentGroup, user } = this.props;

    return (
      <div className="flex flex-col gap-4 bg-white rounded-xl p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-[18px] font-semibold mb-2">About this group</h1>
            {currentGroup.owner === user._id && <EditAboutGroupModal />}
          </div>
          <p className="text-[16px]  flex items-start gap-2">
            <i className="fa-solid fa-tag"></i>
            <span className="leading-7">{currentGroup.description}</span>
          </p>
          <div className="text-[16px] w-2/3 flex items-start gap-2">
            <i className="fa-solid fa-lock"></i>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Private group</span>
              <span className="text-[14px] line-clamp-3">
                Only members can see everyone in the group and what they post.
              </span>
            </div>
          </div>

          <div className="text-[16px] w-2/3 flex items-start gap-2">
            <i className="fa-solid fa-file-pen"></i>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Rules</span>
              <span className="text-[14px] line-clamp-3">
                {currentGroup.rules}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <h1 className="text-[18px] font-semibold mb-2">Member</h1>
          <p className="text-[16px] flex items-center gap-2">
            <i className="fa-solid fa-user-group"></i>
            <span>{currentGroup.members.length}</span>
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  fetchingGroupDetail: state.groups.fetchingGroupDetail,
  currentGroup: state.groups.currentGroup,
  user: state.user.data,
});

export default connect(mapStateToProps)(AboutGroup);
