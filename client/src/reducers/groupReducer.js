import { groupConstant } from "../_constants/groupConstant";
import { postConstants } from "../_constants/postConstants";

const initialState = {
  currentGroup: {},
  groups: [],
  posts: [],
  postLikes: [],
  members: [],
  currentGroupAdmins: [],
  groupOwner: null,
  coverImage: null,
  loadingMembers: true,
  fetchingPosts: true,
  totalPosts: 0,
  fetchingNewGroups: false,
  fetchingGroupDetail: true,
  fetchingGroup: true,
  loadingAddGroup: false,
  loadingAddMember: false,
  loadingDeleteMember: false,
  groupsCount: 0,
  groupMessage: {},
  error: null,
  isGroupAdded: false,
  loadingAddPost: false,
  loadingCoverImage: false,
  updating: false,
};

export function groups(state = initialState, action) {
  switch (action.type) {
    case groupConstant.FETCH_GROUPS_REQUEST:
      return {
        ...state,
        fetching: true,
        error: null,
      };
    case groupConstant.FETCH_GROUPS_SUCCESS:
      return {
        ...state,
        fetching: false,
        groups: action.data.groups,
        error: null,
      };
    case groupConstant.ADD_GROUP_REQUEST:
      return {
        ...state,
        loadingAddGroup: true,
        error: null,
        isGroupAdded: false,
      };
    case groupConstant.ADD_GROUP_SUCCESS:
      return {
        ...state,
        loadingAddGroup: false,
        groupMessage: action.data,
        isGroupAdded: true,
        error: null,
      };
    case groupConstant.ADD_GROUP_FAILURE:
      return {
        ...state,
        loadingAddGroup: false,
        isGroupAdded: false,
        error: action.error,
      };
    case groupConstant.FETCH_GROUP_DETAIL_REQUEST:
      return {
        ...state,
        fetchingGroupDetail: true,
        error: null,
      };
    case groupConstant.FETCH_GROUP_DETAIL_SUCCESS:
      return {
        ...state,
        fetchingGroupDetail: false,
        currentGroup: action.data,
        coverImage: action.data.coverImage,
        currentGroupAdmins: action.data.admins,
        error: null,
      };
    case groupConstant.FETCH_GROUP_POSTS_REQUEST:
      return {
        ...state,
        fetchingPosts: true,
      };
    case groupConstant.FETCH_GROUP_POSTS_SUCCESS:
      return {
        ...state,
        fetchingPosts: false,
        posts: action.data.posts,
        totalPosts: action.data.total,
      };
    case groupConstant.ADD_GROUP_POST_REQUEST:
      return {
        ...state,
        loadingAddPost: true,
        error: null,
      };
    case groupConstant.ADD_GROUP_POST_SUCCESS:
      return {
        ...state,
        loadingAddPost: false,
        posts: [action.data, ...state.posts],
        error: null,
      };
    case groupConstant.ADD_GROUP_POST_FAILURE:
      return {
        ...state,
        loadingAddPost: false,
        error: action.error,
      };
    case groupConstant.ADD_MEMBER_REQUEST:
      return {
        ...state,
        loadingAddMember: true,
        error: null,
      };
    case groupConstant.ADD_MEMBER_SUCCESS:
      return {
        ...state,
        loadingAddMember: false,
        error: null,
      };
    case groupConstant.ADD_MEMBER_FAILURE:
      return {
        ...state,
        loadingAddMember: false,
        error: action.error,
      };

      case groupConstant.ADD_ADMIN_REQUEST:
        return {
          ...state,
          error: null,
        };
      case groupConstant.ADD_ADMIN_SUCCESS:
        return {
          ...state,
          error: null,
        };
      case groupConstant.ADD_ADMIN_FAILURE:
        return {
          ...state,
          error: action.error,
        };

        case groupConstant.DELETE_ADMIN_REQUEST:
          return {
            ...state,
            error: null,
          };
        case groupConstant.DELETE_ADMIN_SUCCESS:
          return {
            ...state,
            error: null,
          };
        case groupConstant.DELETE_ADMIN_FAILURE:
          return {
            ...state,
            error: action.error,
          };
  

    case groupConstant.DELETE_MEMBER_REQUEST:
      return {
        ...state,
        loadingDeleteMember: true,
        error: null,
      };
    case groupConstant.DELETE_MEMBER_SUCCESS:
      return {
        ...state,
        loadingDeleteMember: false,
        error: null,
      };
    case groupConstant.DELETE_MEMBER_FAILURE:
      return {
        ...state,
        loadingDeleteMember: false,
        error: action.error,
      };
    case groupConstant.GET_MEMBERS_REQUEST:
      return {
        ...state,
        loadingMembers: true,
      };
    case groupConstant.GET_MEMBERS_SUCCESS:
      console.log(action);

      return {
        ...state,
        loadingMembers: false,
        members: action.data.data,
        groupOwner: action.data.groupOwner,
      };
    case groupConstant.GET_MEMBERS_FAILURE:
      return {
        ...state,
        loadingMembers: false,
        error: action.error,
      };
    case postConstants.LIKE_POST:
      return {
        ...state,
        postLikes: [...state.postLikes, action.post.postId],
        posts: state.posts.map((post) => {
          if (post._id === action.post.postId) {
            return {
              ...post,
              likes: post.likes + 1,
            };
          }
          return {
            ...post,
          };
        }),
      };
    case postConstants.DISLIKE_POST:
      return {
        ...state,
        postLikes: state.postLikes.filter((e) => e !== action.post.postId),
        posts: state.posts.map((post) => {
          if (post._id === action.post.postId) {
            return {
              ...post,
              likes: post.likes - 1,
            };
          }
          return {
            ...post,
          };
        }),
      };

    case groupConstant.UPDATE_GROUP_REQUEST:
      return {
        ...state,
        updating: true,
        error: null,
      };
    case groupConstant.UPDATE_GROUP_SUCCESS:
      return {
        ...state,
        updating: false,
        currentGroup: { ...state.currentGroup, ...action.data },
        error: null,
      };
    case groupConstant.UPDATE_GROUP_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.error,
      };

    case groupConstant.CHANGE_COVER_REQUEST:
      return {
        ...state,
        loadingCoverImage: true,
        error: null,
      };
    case groupConstant.CHANGE_COVER_SUCCESS:
      return {
        ...state,
        loadingCoverImage: false,
        coverImage: action.data.coverImage,
      };
    case groupConstant.CHANGE_COVER_FAILURE:
      return {
        ...state,
        loadingCoverImage: false,
        error: action.error,
      };

    case "CLEAR_POSTS_GROUP":
      return {
        ...state,
        posts: [],
      };
    default:
      return state;
  }
}
