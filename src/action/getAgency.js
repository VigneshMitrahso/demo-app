import jwt_decode from "jwt-decode";

import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_AGENCY_FAILURE,
  GET_AGENCY_SUCCESS,
  GET_AGENCY_REQUEST,
  RESET_AGENCY_SUCCESS,
} from "./actionConstants";
import { agencyUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const agencyRequested = () => ({
  type: GET_AGENCY_REQUEST,
});

const agencySuccess = (data) => ({
  type: GET_AGENCY_SUCCESS,
  data,
});

const agencyFailure = (data) => ({
  type: GET_AGENCY_FAILURE,
  data,
});

const agencyReset = () => ({
  type: RESET_AGENCY_SUCCESS,
});

export const agencyUser =
  (userId, branchStatus, agencyStatus, urls) => (dispatch) => {
    dispatch(agencyRequested());

    const url = agencyUrl(userId, branchStatus, agencyStatus, urls);

    const onSuccess = (response) => {
      dispatch(agencySuccess(response));
    };

    const onFailure = (response) => {
      dispatch(agencyFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetagencyUser = () => (dispatch) => {
  dispatch(agencyReset());
};
