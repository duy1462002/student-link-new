import React from "react";
import { ModalHeader, Modal, List, Button, Image } from "semantic-ui-react";
import toast from "react-hot-toast";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { userActions } from "../../actions/userActions";
import SpinnerLoading from "../SpinnerLoading";
import { groupService } from "../../_services/groupService";
import { groupActions } from "../../actions/groupActions";
function AddMemberModal({
  dispatch,
  users,
  fetching,
  fetchingNewUsers,
  usersCount,
  error,
  currentGroup,
}) {
  const [open, setOpen] = React.useState(false);
  const [members, setMembers] = React.useState(currentGroup.members);
  const pathname = window.location.pathname;
  const groupId = pathname.split("/")[2];
  const [loading, setLoading] = React.useState(null);
  const handleAddMember = async (e, memberId) => {
    e.preventDefault();
    if (memberId) {
      setLoading(memberId);
      // dispatch(groupActions.addMember(groupId, memberId));
      await groupService
        .addMember({ groupId, memberId })
        .then((res) => {
          toast.success(res.message);
          dispatch(
            groupActions.getGroupDetail({
              initialFetch: false,
              groupId,
            })
          );
        })
        .catch((err) => toast.error(err));
      setLoading(null);
    }
  };

  React.useEffect(() => {
    if (!users.length) {
      dispatch(userActions.getNewUsers({ initialFetch: true }));
    }
    setMembers(currentGroup.members);
  }, [dispatch, users.length, currentGroup]);

  const combinedUserList = users.map((user) => ({
    ...user,
    isMember: members.some((member) => member.user === user._id),
  }));

  const lists = combinedUserList.length
    ? combinedUserList.map((user) => (
        <List.Item key={user._id}>
          <List.Content floated="right">
            {user.isMember ? (
              <Button disabled className="h-12 !bg-[#591bc5] !text-white">
                Already a member
              </Button>
            ) : (
              <Button
                onClick={(e) => handleAddMember(e, user._id)}
                className={`relative text-center h-12 text-nowrap ${
                  loading === user._id ? "" : "!bg-[#591bc5] !text-white"
                }`}
              >
                {loading === user._id ? (
                  <SpinnerLoading size={36} bgColor="gray" />
                ) : (
                  "Add Member"
                )}
              </Button>
            )}
          </List.Content>
          <Image
            avatar
            src={`/images/profile-picture/100x100/${user.profilePicture}`}
          />
          <List.Content
            as={Link}
            to={"/" + user.username}
            style={{ color: "#3d3d3d" }}
          >
            {user.username}
          </List.Content>
        </List.Item>
      ))
    : null;

  return (
    <Modal
      closeIcon={false}
      size="tiny"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <button className="group-btn rounded-lg">
          <i className="fa-solid fa-plus"></i>
          Mời
        </button>
      }
    >
      <ModalHeader className="!text-[24px] text-center">
        Follow list
      </ModalHeader>
      <Modal.Content scrolling>
        <Modal.Description>
          <List verticalAlign="middle" size="huge">
            {lists}
          </List>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  users: state.newUsers.users,
  fetching: state.newUsers.fetching,
  fetchingNewUsers: state.newUsers.fetchingNewUsers,
  usersCount: state.newUsers.usersCount,
  error: state.groups.error,
  loadingAddMember: state.groups.loadingAddMember,
  groups: state.groups.groups,
  currentGroup: state.groups.currentGroup,
});

export default connect(mapStateToProps)(AddMemberModal);
