import {
  REQUEST_GET_VOICE_RECORD,
  SUCCESS_GET_VOICE_RECORD,
  FAILED_GET_VOICE_RECORD,
} from "../action/actionConstants";

const initialState = {
  records: [],
  status: "",
  error: false,
  isFetching: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_GET_VOICE_RECORD:
      return {
        ...state,
        isFetching: true,
      };
    case SUCCESS_GET_VOICE_RECORD:
      return {
        ...state,
        records: action.record.data.recording_details,
        status: action.record.data.status,
        error: false,
        isFetching: false,
      };
    case FAILED_GET_VOICE_RECORD:
      return {
        ...state,
        error: true,
        isFetching: false,
      };
    default:
      return state;
  }
}
