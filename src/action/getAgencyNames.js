import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_AGENCY_NAMES_FAILURE,
  GET_AGENCY_NAMES_SUCCESS,
  GET_AGENCY_NAMES_REQUEST,
  RESET_AGENCY_NAMES_SUCCESS,
} from "./actionConstants";
import { getAgencyListUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const agencyNamesRequested = () => ({
  type: GET_AGENCY_NAMES_REQUEST,
});

const agencyNamesSuccess = (data) => ({
  type: GET_AGENCY_NAMES_SUCCESS,
  data,
});

const agencyNamesFailure = (data) => ({
  type: GET_AGENCY_NAMES_FAILURE,
  data,
});

const agencyNamesReset = (data) => ({
  type: RESET_AGENCY_NAMES_SUCCESS,
  data,
});

export const getAgencyNames = (userId, stateName, cityName) => (dispatch) => {
  dispatch(agencyNamesRequested());

  const url = getAgencyListUrl(userId, stateName, cityName);

  const onSuccess = (response) => {
    dispatch(agencyNamesSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(agencyNamesFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetAgencyNames = () => (dispatch) => {
  dispatch(agencyNamesReset());
};
