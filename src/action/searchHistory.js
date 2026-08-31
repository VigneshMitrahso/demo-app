import { GET, ACCESS_TOKEN, POST } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_SEARCH_HISTORY_FAILURE,
  GET_SEARCH_HISTORY_SUCCESS,
  GET_SEARCH_HISTORY_REQUEST,
  RESET_SEARCH_HISTORY_SUCCESS,
} from "./actionConstants";
import {
  searchHistoryUserUrl,
  calculatorUrl,
  calculatoTablerUrl,
  calculatorCityurl,
  calculatorSuggestedData,
  calculatorCounterUrl,
} from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const searchHistoryUserRequested = () => ({
  type: GET_SEARCH_HISTORY_REQUEST,
});

const searchHistoryUserSuccess = (data) => ({
  type: GET_SEARCH_HISTORY_SUCCESS,
  data,
});

const searchHistoryUserFailure = (data) => ({
  type: GET_SEARCH_HISTORY_FAILURE,
  data,
});

const searchHistoryUserReset = (data) => ({
  type: RESET_SEARCH_HISTORY_SUCCESS,
  data,
});

export const searchHistoryUser =
  (userId, reqId, successHistorCallBack, failureHistoryCallBack) =>
  (dispatch) => {
    dispatch(searchHistoryUserRequested());

    const url = searchHistoryUserUrl(userId, reqId);

    const onSuccess = (response) => {
      successHistorCallBack(response);
      dispatch(searchHistoryUserSuccess(response));
    };

    const onFailure = (response) => {
      failureHistoryCallBack(response);
      dispatch(searchHistoryUserFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getCalculatorState =
  (userId, query, successHistorCallBack, failureHistoryCallBack) =>
  (dispatch) => {
    dispatch(searchHistoryUserRequested());

    const url = calculatorUrl(userId, query);

    const onSuccess = (response) => {
      successHistorCallBack(response);
    };

    const onFailure = (response) => {
      failureHistoryCallBack(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetsearchHistoryUserUser = () => (dispatch) => {
  dispatch(searchHistoryUserReset());
};

export const getCalculatorTable =
  (userId, query, successHistorCallBack, failureHistoryCallBack) =>
  (dispatch) => {
    dispatch(searchHistoryUserRequested());
    const url = calculatoTablerUrl(userId, query);

    const onSuccess = (response) => {
      successHistorCallBack(response);
    };

    const onFailure = (response) => {
      failureHistoryCallBack(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getCalculatorCity =
  (userId, successHistorCallBack, failureHistoryCallBack) => (dispatch) => {
    dispatch(searchHistoryUserRequested());
    const url = calculatorCityurl(userId);

    const onSuccess = (response) => {
      successHistorCallBack(response);
    };

    const onFailure = (response) => {
      failureHistoryCallBack(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getCalculatorSuggested =
  (userId, city, successHistorCallBack, failureHistoryCallBack) =>
  (dispatch) => {
    dispatch(searchHistoryUserRequested());
    const url = calculatorSuggestedData(userId, city);

    const onSuccess = (response) => {
      successHistorCallBack(response);
    };

    const onFailure = (response) => {
      failureHistoryCallBack(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };




  export const calculatorCounter =
  (userId, calculatorType, successHistorCallBack, failureHistoryCallBack) =>
  (dispatch) => {

    const url = calculatorCounterUrl(userId);
    const data  = {"module":calculatorType}


    const onSuccess = (response) => {
      successHistorCallBack(response);
    };

    const onFailure = (response) => {
      failureHistoryCallBack(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(POST, url, data, onSuccess, onFailure, dispatch, token);
      }
    });
  };