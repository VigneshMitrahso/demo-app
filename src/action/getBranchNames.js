import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_BRANCH_NAMES_FAILURE,
  GET_BRANCH_NAMES_SUCCESS,
  GET_BRANCH_NAMES_REQUEST,
  RESET_BRANCH_NAMES_SUCCESS,
} from "./actionConstants";
import { getBranchListUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const branchNamesRequested = () => ({
  type: GET_BRANCH_NAMES_REQUEST,
});

const branchNamesSuccess = (data) => ({
  type: GET_BRANCH_NAMES_SUCCESS,
  data,
});

const branchNamesFailure = (data) => ({
  type: GET_BRANCH_NAMES_FAILURE,
  data,
});

const branchNamesReset = (data) => ({
  type: RESET_BRANCH_NAMES_SUCCESS,
  data,
});

export const getBranchNames = (userId, stateName, cityName) => (dispatch) => {
  dispatch(branchNamesRequested());

  const url = getBranchListUrl(userId, stateName, cityName);

  const onSuccess = (response) => {
    dispatch(branchNamesSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(branchNamesFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetBranchNames = () => (dispatch) => {
  dispatch(branchNamesReset());
};
