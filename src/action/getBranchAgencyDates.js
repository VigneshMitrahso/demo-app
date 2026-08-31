import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_BRANCH_AGENCY_DATES_FAILURE,
  GET_BRANCH_AGENCY_DATES_SUCCESS,
  GET_BRANCH_AGENCY_DATES_REQUEST,
  RESET_BRANCH_AGENCY_DATES_SUCCESS,
} from "./actionConstants";
import { getBranchAgencyDatesUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const branchAgencyDatesRequested = () => ({
  type: GET_BRANCH_AGENCY_DATES_REQUEST,
});

const branchAgencyDatesSuccess = (data) => ({
  type: GET_BRANCH_AGENCY_DATES_SUCCESS,
  data,
});

const branchAgencyDatesFailure = (data) => ({
  type: GET_BRANCH_AGENCY_DATES_FAILURE,
  data,
});

const branchAgencyDatesReset = (data) => ({
  type: RESET_BRANCH_AGENCY_DATES_SUCCESS,
  data,
});

export const getBranchAgencyDates = (userId, type, code) => (dispatch) => {
  dispatch(branchAgencyDatesRequested());

  const url = getBranchAgencyDatesUrl(userId, type, code);

  const onSuccess = (response) => {
    dispatch(branchAgencyDatesSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(branchAgencyDatesFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetBranchAgencyDates = () => (dispatch) => {
  dispatch(branchAgencyDatesReset());
};
