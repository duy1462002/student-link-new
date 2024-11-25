import toast from "react-hot-toast";
import { groupConstant } from "../_constants/groupConstant";
import { postConstants } from "../_constants/postConstants";
import { groupService } from "../_services/groupService";

export const groupActions = {
  addGroup,
  getGroups,
  getGroupDetail,
  addMember,
  deleteMember,
  getGroupPosts,
  addGroupPost,
  getGroupMembers,
  changeCover,
  updateGroup,
};

function addGroup(groupData) {
  return (dispatch) => {
    dispatch(request());
    groupService.addGroup(groupData).then(
      (res) => {
        dispatch(success(res.data));
        dispatch(getGroups({ initialFetch: false }));
        toast.success("Post uploaded");
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };

  function request() {
    return { type: groupConstant.ADD_GROUP_REQUEST };
  }
  function success(data) {
    return { type: groupConstant.ADD_GROUP_SUCCESS, data };
  }
  function failure(error) {
    return { type: groupConstant.ADD_GROUP_FAILURE, error };
  }
}

function getGroups(params) {
  return (dispatch) => {
    if (!params.initialFetch) {
      dispatch(request());
    }
    groupService.getGroup(params).then(
      (res) => {
        dispatch(success({ ...res, ...params }));
      },
      (error) => {
        console.log(error);
      }
    );
  };

  function success(data) {
    return { type: groupConstant.FETCH_GROUPS_SUCCESS, data };
  }
  function request() {
    return { type: groupConstant.FETCH_GROUPS_REQUEST };
  }
}

function getGroupDetail(params) {
  return (dispatch) => {
    if (params.initialFetch) {
      dispatch(request());
    }
    groupService.getGroupDetail(params).then(
      (res) => {
        dispatch(success(res));
      },
      (error) => {
        console.log(error);
      }
    );
  };

  function success(data) {
    return { type: groupConstant.FETCH_GROUP_DETAIL_SUCCESS, data };
  }
  function request() {
    return { type: groupConstant.FETCH_GROUP_DETAIL_REQUEST };
  }
}

function getGroupPosts(params) {
  return (dispatch) => {
    if (params.initialFetch) {
      dispatch(request());
    }
    groupService.getGroupPosts(params).then(
      (res) => {
        dispatch(success(res[0]));
        res[0].posts.forEach((post) =>
          dispatch({ type: postConstants.INIT_COMMENT, postId: post._id })
        );
      },
      (error) => {
        console.log(error);
      }
    );
  };

  function success(data) {
    return { type: groupConstant.FETCH_GROUP_POSTS_SUCCESS, data };
  }
  function request() {
    return { type: groupConstant.FETCH_GROUP_POSTS_REQUEST };
  }
}

function addGroupPost(groupData) {
  return (dispatch) => {
    dispatch(request());
    groupService.addGroupPost(groupData).then(
      (res) => {
        dispatch(success(res.post));
        dispatch(
          getGroupPosts({ initialFetch: true, groupId: groupData.groupId })
        );
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };

  function request() {
    return { type: groupConstant.ADD_GROUP_POST_REQUEST };
  }
  function success(data) {
    return { type: groupConstant.ADD_GROUP_POST_SUCCESS, data };
  }
  function failure(error) {
    return { type: groupConstant.ADD_GROUP_POST_FAILURE, error };
  }
}

function addMember(groupId, memberId) {
  return (dispatch) => {
    dispatch(request());
    groupService.addMember({ groupId, memberId }).then(
      (res) => {
        dispatch(success(res.data));
        dispatch(
          getGroupDetail({
            initialFetch: false,
            groupId,
          })
        );
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };

  function request() {
    return { type: groupConstant.ADD_MEMBER_REQUEST };
  }
  function success(data) {
    return { type: groupConstant.ADD_MEMBER_SUCCESS, data };
  }
  function failure(error) {
    return { type: groupConstant.ADD_MEMBER_FAILURE, error };
  }
}

function deleteMember(groupId, memberId) {
  return (dispatch) => {
    dispatch(request());
    groupService.deleteMember({ groupId, memberId }).then(
      (res) => {
        dispatch(success(res.data));
        dispatch(
          getGroupDetail({
            initialFetch: false,
            groupId,
          })
        );
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };

  function request() {
    return { type: groupConstant.DELETE_MEMBER_REQUEST };
  }
  function success(data) {
    return { type: groupConstant.DELETE_MEMBER_SUCCESS, data };
  }
  function failure(error) {
    return { type: groupConstant.DELETE_MEMBER_FAILURE, error };
  }
}

function getGroupMembers(groupId, members) {
  return (dispatch) => {
    dispatch(request());
    groupService.getGroupMembers({ groupId, members }).then(
      (res) => {
        dispatch(success(res));
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };

  function request() {
    return { type: groupConstant.GET_MEMBERS_REQUEST };
  }
  function success(data) {
    return { type: groupConstant.GET_MEMBERS_SUCCESS, data };
  }
  function failure(error) {
    return { type: groupConstant.GET_MEMBERS_FAILURE, error };
  }
}

function updateGroup(params) {
  return (dispatch) => {
    dispatch(request());
    groupService.updateGroup(params).then(
      (res) => {
        dispatch(success(res));
        // dispatch(getGroups({ initialFetch: false }));
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };

  function request() {
    return { type: groupConstant.UPDATE_GROUP_REQUEST };
  }
  function success(data) {
    return { type: groupConstant.UPDATE_GROUP_SUCCESS, data };
  }
  function failure(error) {
    return { type: groupConstant.UPDATE_GROUP_FAILURE, error };
  }
}

function changeCover(params) {
  return (dispatch) => {
    dispatch(request());
    groupService.changeCover(params).then(
      (res) => {
        dispatch(success(res));
        dispatch(getGroups({ initialFetch: true }));
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };

  function request() {
    return { type: groupConstant.CHANGE_COVER_REQUEST };
  }
  function success(data) {
    return { type: groupConstant.CHANGE_COVER_SUCCESS, data };
  }
  function failure(error) {
    return { type: groupConstant.CHANGE_COVER_FAILURE, error };
  }
}
