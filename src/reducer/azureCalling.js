import {
  GET_CREATE_CALL_FAILURE,
  GET_CREATE_CALL_SUCCESS,
  GET_CREATE_CALL_REQUEST,
  RESET_CREATE_CALL_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingSearchReq: false,
  error: false,
  status: "",
  callDataValue: [],
};

const azureCalling = (state = initialState, action) => {
  switch (action.type) {
    case GET_CREATE_CALL_REQUEST:
      return {
        ...state,
        isFetchingSearchReq: true,
      };
 
      case GET_CREATE_CALL_FAILURE:
        return {
          ...state,
          isFetchingSearchReq: false,
          error: true,
          status: action.data.status,
          message: "failed to get call data",
        };
        // "bank_id": "8:acs:1d7a4fe3-f6dd-444e-8f43-90864320dcd7_00000018-3d16-362a-ec78-c93a0d00a2de",
        // "call_created": "Thu, 20 Apr 2023 05:48:01 GMT",
        // "call_status": "in-progress",
        // "customer_id": "8:acs:1d7a4fe3-f6dd-444e-8f43-90864320dcd7_00000018-3d16-362a-ec78-c93a0d00a2de",
        // "token_result": 
      case GET_CREATE_CALL_SUCCESS:
        var dataSet = action.data.data;
        var dataArr = [];
        console.log("action.data.data",action.data.data)
        for (let list in dataSet) {
          var obj = {
            call_created: dataSet[list].call_created,
            call_status: dataSet[list].call_status,
            room_id: dataSet[list].room_id,
            token:dataSet[list].token,
            MeetId: dataSet[list].video_call_room_id
          };
          dataArr.push(obj);
        }
  
        return {
          ...state,
          isFetchingSearchReq: false,
          error: false,
          status: action.data.status,
          callDataValue: dataArr,
          message: "Successfully Logged In",
        };
  
      case RESET_CREATE_CALL_SUCCESS:
        return {
          ...state,
          isFetchingSearchReq: false,
          error: false,
          status: false,
          callDataValue: [],
          message: "Successfully Logged In",
        };
      default:
        return state;
    }
  };
  
  export default azureCalling;
  
