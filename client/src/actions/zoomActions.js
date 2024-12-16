import { zoomConstant } from "../_constants/zoomConstants";
import { zoomService } from "../_services/zoomService";

export const zoomAction = {
    getMeetings,
};

function getMeetings(data) {
  return (dispatch) => {
    dispatch(request());

    zoomService.getMeetings(data).then(
      (response) => {
        dispatch(success(response));
      },
      (error) => {
        dispatch(failure(error));
      }
    );
  };
  function request() {
    return { type: zoomConstant.GET_MEETINGS_REQUEST };
  }
  function success(response) {
    return { type: zoomConstant.GET_MEETING_SUCCESS, response };
  }
  function failure(error) {
    return { type: zoomConstant.GET_MEETING_FAILURE, error };
  }
}
