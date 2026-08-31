import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_BRANCH_STATES_FAILURE,
  GET_BRANCH_STATES_SUCCESS,
  GET_BRANCH_STATES_REQUEST,
  RESET_BRANCH_STATES_SUCCESS,
} from "./actionConstants";
import { getBranchStateUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const branchStatesRequested = () => ({
  type: GET_BRANCH_STATES_REQUEST,
});

const branchStatesSuccess = (data) => ({
  type: GET_BRANCH_STATES_SUCCESS,
  data,
});

const branchStatesFailure = (data) => ({
  type: GET_BRANCH_STATES_FAILURE,
  data,
});

const branchStatesReset = (data) => ({
  type: RESET_BRANCH_STATES_SUCCESS,
  data,
});

export const getBranchStates = (userId) => (dispatch) => {
  dispatch(branchStatesRequested());

  const url = getBranchStateUrl(userId);

  const onSuccess = (response) => {
    dispatch(branchStatesSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(branchStatesFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetBranchStates = () => (dispatch) => {
  dispatch(branchStatesReset());
};
