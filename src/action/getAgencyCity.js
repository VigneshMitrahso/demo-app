import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_AGENCY_CITIES_FAILURE,
  GET_AGENCY_CITIES_SUCCESS,
  GET_AGENCY_CITIES_REQUEST,
  RESET_AGENCY_CITIES_SUCCESS,
} from "./actionConstants";
import { getAgencyCityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const agencyCitiesRequested = () => ({
  type: GET_AGENCY_CITIES_REQUEST,
});

const agencyCitiesSuccess = (data) => ({
  type: GET_AGENCY_CITIES_SUCCESS,
  data,
});

const agencyCitiesFailure = (data) => ({
  type: GET_AGENCY_CITIES_FAILURE,
  data,
});

const agencyCitiesReset = (data) => ({
  type: RESET_AGENCY_CITIES_SUCCESS,
  data,
});

export const getAgencyCities = (userId, stateName) => (dispatch) => {
  dispatch(agencyCitiesRequested());

  const url = getAgencyCityUrl(userId, stateName);

  const onSuccess = (response) => {
    dispatch(agencyCitiesSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(agencyCitiesFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetAgencyCities = () => (dispatch) => {
  dispatch(agencyCitiesReset());
};
