import { GET, ACCESS_TOKEN, POST } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_USER_REPORT_DATA_FAILURE,
  GET_USER_REPORT_DATA_SUCCESS,
  GET_USER_REPORT_DATA_REQUEST,
  RESET_USER_REPORT_DATA_SUCCESS,
  GET_REPORT_REQUEST,
  GET_REPORT_SUCCESS,
  GET_REPORT_FAILURE,
} from "./actionConstants";
import {
  getReportURL,
  marketTransactionUrl,
  reportUserUrl,
  updateReportURL,
} from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const reportUserRequested = () => ({
  type: GET_USER_REPORT_DATA_REQUEST,
});

const reportUserSuccess = (data) => ({
  type: GET_USER_REPORT_DATA_SUCCESS,
  data,
});

const reportUserFailure = (data) => ({
  type: GET_USER_REPORT_DATA_FAILURE,
  data,
});

const reportUserReset = (data) => ({
  type: RESET_USER_REPORT_DATA_SUCCESS,
  data,
});

export const reportUser =
  (userId, reqId, successLatLonCall, failiur = () => {}) =>
  (dispatch) => {
    dispatch(reportUserRequested());

    const url = reportUserUrl(userId, encodeURIComponent(reqId));

    const onSuccess = (response) => {
      successLatLonCall(response.data.report_details);
      dispatch(reportUserSuccess(response));
    };

    const onFailure = (response) => {
      dispatch(reportUserFailure(response));
      failiur(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetreportUserUser = () => (dispatch) => {
  dispatch(reportUserReset());
};

export const getReportData =
  (userId, reqId, proprtyType, unitType, successCallBack, failiurCallBack) =>
  (dispatch) => {
    dispatch(getReportRequested());

    const url = getReportURL(
      userId,
      encodeURIComponent(reqId),
      proprtyType,
      unitType,
    );

    const onSuccess = (response) => {
      successCallBack(response);
      dispatch(getReportSuccess(response));
    };

    const onFailure = (response) => {
      dispatch(getReportFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

const getReportRequested = () => ({
  type: GET_REPORT_REQUEST,
});

const getReportSuccess = (data) => ({
  type: GET_REPORT_SUCCESS,
  data,
});

const getReportFailure = (data) => ({
  type: GET_REPORT_FAILURE,
  data,
});

export const updateReportApi =
  (userId, reqId, data, successCallBack, failiurCallBack) => (dispatch) => {
    dispatch(getReportRequested());

    const url = updateReportURL(userId, encodeURIComponent(reqId));

    const onSuccess = (response) => {
      successCallBack(response);
      dispatch(getReportSuccess(response));
    };

    const onFailure = (response) => {
      failiurCallBack(response);
      dispatch(getReportFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(POST, url, data, onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const marketTransactionUpdate =
  (userId, data, successCallBack, failiurCallBack) => (dispatch) => {
    // dispatch(getReportRequested());

    const url = marketTransactionUrl(userId);

    const onSuccess = (response) => {
      successCallBack(response);
    };

    const onFailure = (response) => {
      failiurCallBack(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(POST, url, data, onSuccess, onFailure, dispatch, token);
      }
    });
  };
