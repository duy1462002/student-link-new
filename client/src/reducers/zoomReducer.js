import { zoomConstant } from "../_constants/zoomConstants";

const initialState = {
  meetings: [],
  isLoading: false,
  error: null,
};

export function zoom(state = initialState, action) {
  switch (action.type) {
    case zoomConstant.GET_MEETINGS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case zoomConstant.GET_MEETING_SUCCESS:
      return {
        ...state,
        meetings: [...action.response],
        isLoading: false,
      };

    case zoomConstant.GET_MEETING_FAILURE:
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    default:
      return state;
  }
}
