import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_AGENCY_ZONES_FAILURE,
  GET_AGENCY_ZONES_SUCCESS,
  GET_AGENCY_ZONES_REQUEST,
  RESET_AGENCY_ZONES_SUCCESS,
} from "./actionConstants";
import { getZonesUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const agencyZoneRequested = () => ({
  type: GET_AGENCY_ZONES_REQUEST,
});

const agencyZoneSuccess = (data) => ({
  type: GET_AGENCY_ZONES_SUCCESS,
  data,
});

const agenyZoneFailure = (data) => ({
  type: GET_AGENCY_ZONES_FAILURE,
  data,
});

const agencyZoneReset = (data) => ({
  type: RESET_AGENCY_ZONES_SUCCESS,
  data,
});

export const getAgencyZone = (userId) => (dispatch) => {
  dispatch(agencyZoneRequested());

  const url = getZonesUrl(userId);
  const onSuccess = (response) => {
    dispatch(agencyZoneSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(agenyZoneFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetAgencyZone = () => (dispatch) => {
  dispatch(agencyZoneReset());
};
