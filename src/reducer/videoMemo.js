import {
  REQUEST_GET_VIDEO_RECORD,
  SUCCESS_GET_VIDEO_RECORD,
  FAILED_GET_VIDEO_RECORD,
} from "../action/actionConstants";

const initialState = {
  records: [],
  status: "",
  error: false,
  isFetching: false,
};

export default function reducerVideo(state = initialState, action) {
  switch (action.type) {
    case REQUEST_GET_VIDEO_RECORD:
      return {
        ...state,
        isFetching: true,
      };
    case SUCCESS_GET_VIDEO_RECORD:
      return {
        ...state,
        records: action.record.data.video_recording_details,
        status: action.record.data.status,
        error: false,
        isFetching: false,
      };
    case FAILED_GET_VIDEO_RECORD:
      return {
        ...state,
        error: true,
        isFetching: false,
      };
    default:
      return state;
  }
}
