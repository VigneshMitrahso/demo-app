import { POST, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_POST_REPORT_FAILURE,
  GET_POST_REPORT_SUCCESS,
  GET_POST_REPORT_REQUEST,
  RESET_POST_REPORT_SUCCESS,
} from "./actionConstants";
import { postImageDataUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const reportImageRequested = () => ({
  type: GET_POST_REPORT_REQUEST,
});

const reportImageSuccess = (data) => ({
  type: GET_POST_REPORT_SUCCESS,
  data,
});

const reportImageFailure = (data) => ({
  type: GET_POST_REPORT_FAILURE,
  data,
});

const reportImageReset = (data) => ({
  type: RESET_POST_REPORT_SUCCESS,
  data,
});

export const reportImageUser =
  (userId, reqId, status, reportObject, succesReport, failureReport) =>
  (dispatch) => {
    dispatch(reportImageRequested());

    const url = postImageDataUrl(userId, encodeURIComponent(reqId), status);

    const onSuccess = (response) => {
      dispatch(reportImageSuccess(response));
      succesReport(response);
    };

    const onFailure = (response) => {
      dispatch(reportImageFailure(response));
      failureReport(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(POST, url, reportObject, onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetreportImageUser = () => (dispatch) => {
  dispatch(reportImageReset());
};
