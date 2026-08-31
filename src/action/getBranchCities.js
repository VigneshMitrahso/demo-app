import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_BRANCH_CITIES_FAILURE,
  GET_BRANCH_CITIES_SUCCESS,
  GET_BRANCH_CITIES_REQUEST,
  RESET_BRANCH_CITIES_SUCCESS,
} from "./actionConstants";
import { getBranchCityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const branchCitiesRequested = () => ({
  type: GET_BRANCH_CITIES_REQUEST,
});

const branchCitiesSuccess = (data) => ({
  type: GET_BRANCH_CITIES_SUCCESS,
  data,
});

const branchCitiesFailure = (data) => ({
  type: GET_BRANCH_CITIES_FAILURE,
  data,
});

const branchCitiesReset = (data) => ({
  type: RESET_BRANCH_CITIES_SUCCESS,
  data,
});

export const getBranchCities = (userId, stateName) => (dispatch) => {
  dispatch(branchCitiesRequested());

  const url = getBranchCityUrl(userId, stateName);

  const onSuccess = (response) => {
    dispatch(branchCitiesSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(branchCitiesFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetBranchCities = () => (dispatch) => {
  dispatch(branchCitiesReset());
};
