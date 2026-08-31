import { GET, POST } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_VALUE_STATE_FAILURE,
  GET_VALUE_STATE_SUCCESS,
  GET_VALUE_STATE_REQUEST,
  RESET_VALUE_STATE_SUCCESS,
  GET_AVMDATA_ICICI_REQUEST_SUCCESS,
  GET_AVMDATA_TST_REQUEST_SUCCESS,
  GET_AVMDATA_MARKET_REQUEST_SUCCESS,
} from "./actionConstants";
import {
  automatedValuationStateUrl,
  getAvmDataUrl,
  getAVMurl,
  getCategoryUrl,
  updateAvmDataUrl,
} from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";
import { ACCESS_TOKEN } from "../comman/constants";

const stateRequested = () => ({
  type: GET_VALUE_STATE_REQUEST,
});

const stateLoadingICICIAVMData = (data) => ({
  type: GET_AVMDATA_ICICI_REQUEST_SUCCESS,
  data,
});

const stateLoadingTSTAVMData = (data) => ({
  type: GET_AVMDATA_TST_REQUEST_SUCCESS,
  data,
});

const stateLoadingMARKETAVMData = (data) => ({
  type: GET_AVMDATA_MARKET_REQUEST_SUCCESS,
  data,
});

const stateSuccess = (data) => ({
  type: GET_VALUE_STATE_SUCCESS,
  data,
});

const stateFailure = (data) => ({
  type: GET_VALUE_STATE_FAILURE,
  data,
});

const stateReset = (data) => ({
  type: RESET_VALUE_STATE_SUCCESS,
  data,
});

export const valuationStateUser =
  (userId, successCallBack, failureCallBack) => (dispatch) => {
    dispatch(stateRequested());

    const url = automatedValuationStateUrl(userId);

    const onSuccess = (response) => {
      dispatch(stateSuccess(response));
      successCallBack(response);
    };

    const onFailure = (response) => {
      dispatch(stateFailure(response));
      failureCallBack(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetStateUser = () => (dispatch) => {
  dispatch(stateReset());
};

export const getAVMVData =
  (userId, urlParams, successCallBack, failureCallBack, type) =>
  async (dispatch) => {
    dispatch(stateLoadingICICIAVMData(true));
    dispatch(stateLoadingTSTAVMData(true));
    dispatch(stateLoadingMARKETAVMData(true));

    const url = getAVMurl(userId, urlParams);

    const onSuccess = (response) => {
      successCallBack(response);
      if (type === "tst") {
        dispatch(stateLoadingTSTAVMData(false));
      }
      if (type === "icici") {
        dispatch(stateLoadingICICIAVMData(false));
      }
      if (type === "market") {
        dispatch(stateLoadingMARKETAVMData(false));
      }
    };

    const onFailure = (response) => {
      dispatch(stateLoadingICICIAVMData(false));
      dispatch(stateLoadingTSTAVMData(false));
      dispatch(stateLoadingMARKETAVMData(false));
      failureCallBack(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getCategorytList =
  (userId, id, successCallBack, failureCallBack) => (dispatch) => {
    dispatch(stateRequested());
    const url = getCategoryUrl(userId, id);
    const onSuccess = (response) => {
      // dispatch(stateSuccess(response));
      successCallBack(response);
    };
    const onFailure = (response) => {
      // dispatch(stateFailure(response));
      failureCallBack(response);
    };
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getAvmData =
  (
    userId,
    requestID,
    propertyType,
    unitType,
    successCallBack,
    failureCallBack,
  ) =>
  (dispatch) => {
    const url = getAvmDataUrl(userId, requestID, propertyType, unitType);
    const onSuccess = (response) => {
      successCallBack(response);
    };
    const onFailure = (response) => {
      failureCallBack(response);
    };
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const updateAvmData =
  (userId, data, successCallBack, failureCallBack) => (dispatch) => {
    const url = updateAvmDataUrl(userId);

    const onSuccess = (response) => {
      successCallBack(response);
    };

    const onFailure = (response) => {
      failureCallBack(response);
    };
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(POST, url, data, onSuccess, onFailure, dispatch, token);
      }
    });
  };
