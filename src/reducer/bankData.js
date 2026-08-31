import {
  GET_BANK_DATA_FAILURE,
  GET_BANK_DATA_SUCCESS,
  GET_BANK_DATA_REQUEST,
  RESET_BANK_DATA_SUCCESS,
  SET_PRO_UNI_TYPE,
} from "../action/actionConstants";

const initialState = {
  isFetchingSearchReq: false,
  error: false,
  status: "",
  bankDataValue: [],
  selectedTypes: {},
};

const bankData = (state = initialState, action) => {
  switch (action.type) {
    case GET_BANK_DATA_REQUEST:
      return {
        ...state,
        isFetchingSearchReq: true,
      };
    case GET_BANK_DATA_FAILURE:
      return {
        ...state,
        isFetchingSearchReq: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };

    case GET_BANK_DATA_SUCCESS:
      var dataSet = action.data.data.customer_details;

      var dataArr = [];

      for (let list in dataSet) {
        var obj = {
          name: dataSet[list].request_id,
          id: dataSet[list].mobile_number,
          userName: dataSet[list].customer_name,
          status: dataSet[list].status,
        };
        dataArr.push(obj);
      }

      return {
        ...state,
        isFetchingSearchReq: false,
        error: false,
        status: action.data.status,
        bankDataValue: dataArr,
        message: "Successfully Logged In",
      };

    case RESET_BANK_DATA_SUCCESS:
      return {
        ...state,
        isFetchingSearchReq: false,
        error: false,
        status: false,
        bankDataValue: [],
        message: "Successfully Logged In",
      };
    case SET_PRO_UNI_TYPE: {
      return {
        ...state,
        selectedTypes: { ...action.data },
      };
    }
    default:
      return state;
  }
};

export default bankData;
