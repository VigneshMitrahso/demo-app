import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_RECALL_REPORT_FAILURE,
  GET_RECALL_REPORT_SUCCESS,
  GET_RECALL_REPORT_REQUEST,
  RESET_RECALL_REPORT_SUCCESS,
} from "./actionConstants";
import { reCallReportUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const reCallReportRequested = () => ({
  type: GET_RECALL_REPORT_REQUEST,
});

const reCallReportSuccess = (data) => ({
  type: GET_RECALL_REPORT_SUCCESS,
  data,
});

const reCallReportFailure = (data) => ({
  type: GET_RECALL_REPORT_FAILURE,
  data,
});

const reCallReportReset = (data) => ({
  type: RESET_RECALL_REPORT_SUCCESS,
  data,
});

export const reCallReportUser =
  (userId, reqId, successReCall, faulierReCall) => (dispatch) => {
    dispatch(reCallReportRequested());

    const url = reCallReportUrl(userId, encodeURIComponent(reqId));

    const onSuccess = (response) => {
      dispatch(reCallReportSuccess(response));
      successReCall(response);
    };

    const onFailure = (response) => {
      dispatch(reCallReportFailure(response));
      faulierReCall(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetreCallReportUser = () => (dispatch) => {
  dispatch(reCallReportReset());
};
