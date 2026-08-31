import {
  GET_HISTORY_FAILURE,
  GET_HISTORY_SUCCESS,
  GET_HISTORY_REQUEST,
  RESET_HISTORY_SUCCESS,
} from "../action/actionConstants";
// import {
//   AES_KEY,
// } from "../comman/constants";
// import {
//   decryptStatic,
// } from "../comman/decodeEncodeData";

// import { _getStorageValue } from "../comman/localStorage";
const initialState = {
  isFetching: false,
  error: false,
  status: "",
  historyData: [],
};

const getHistory = (state = initialState, action) => {
  switch (action.type) {
    case GET_HISTORY_REQUEST:
      return {
        ...state,
        isFetchingHistory: true,
      };
    case GET_HISTORY_FAILURE:
      return {
        ...state,
        isFetchingHistory: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_HISTORY_SUCCESS:
      // var historyReq = [];
      // _getStorageValue(AES_KEY).then((key) => {
      //   var historyStatus = action.data.data.status_details;
      //   for (let i in historyStatus) {
      //     var historyObj = {
      //       request_id: decryptStatic(historyStatus[i].request_id, key),
      //       status: historyStatus[i].status,
      //       update_date: historyStatus[i].update_date

      //     };
      //     historyReq.push(historyObj);
      //   }
      // });
      return {
        ...state,
        isFetchingHistory: false,
        error: false,
        status: action.data.status,
        historyData: action.data.data.status_details,
        // historyData: historyReq,
        message: "Successfully Logged In",
      };

    case RESET_HISTORY_SUCCESS:
      return {
        ...state,
        isFetchingHistory: false,
        error: false,
        status: false,
        historyData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getHistory;
