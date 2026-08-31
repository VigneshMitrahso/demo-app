import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_BRANCH_REPORT_FAILURE,
  GET_BRANCH_REPORT_SUCCESS,
  GET_BRANCH_REPORT_REQUEST,
  RESET_BRANCH_REPORT_SUCCESS,
} from "./actionConstants";
import { getBranchReportUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const branchReportRequested = () => ({
  type: GET_BRANCH_REPORT_REQUEST,
});

const branchReportSuccess = (data) => ({
  type: GET_BRANCH_REPORT_SUCCESS,
  data,
});

const branchReportFailure = (data) => ({
  type: GET_BRANCH_REPORT_FAILURE,
  data,
});

const branchReportReset = (data) => ({
  type: RESET_BRANCH_REPORT_SUCCESS,
  data,
});

export const getBranchReport = (userId, branchCode, date) => (dispatch) => {
  dispatch(branchReportRequested());

  const url = getBranchReportUrl(userId, branchCode, date);

  const onSuccess = (response) => {
    dispatch(branchReportSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(branchReportFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetBranchReport = () => (dispatch) => {
  dispatch(branchReportReset());
};
