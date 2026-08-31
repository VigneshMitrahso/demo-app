import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_AGENCY_STATES_FAILURE,
  GET_AGENCY_STATES_SUCCESS,
  GET_AGENCY_STATES_REQUEST,
  RESET_AGENCY_STATES_SUCCESS,
} from "./actionConstants";
import { getAgencyStateUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const agencyStatesRequested = () => ({
  type: GET_AGENCY_STATES_REQUEST,
});

const agencyStatesSuccess = (data) => ({
  type: GET_AGENCY_STATES_SUCCESS,
  data,
});

const agencyStatesFailure = (data) => ({
  type: GET_AGENCY_STATES_FAILURE,
  data,
});

const agencyStatesReset = (data) => ({
  type: RESET_AGENCY_STATES_SUCCESS,
  data,
});

export const getAgencyStates = (userId, zone) => (dispatch) => {
  dispatch(agencyStatesRequested());

  const url = getAgencyStateUrl(userId, zone);

  const onSuccess = (response) => {
    dispatch(agencyStatesSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(agencyStatesFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetAgencyStates = () => (dispatch) => {
  dispatch(agencyStatesReset());
};
