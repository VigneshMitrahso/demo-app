import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_BAR_ZONE_FAILURE,
  GET_BAR_ZONE_SUCCESS,
  GET_BAR_ZONE_REQUEST,
  RESET_BAR_ZONE_SUCCESS,
} from "./actionConstants";
import { zoneByCityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const barByZoneRequested = () => ({
  type: GET_BAR_ZONE_REQUEST,
});

const barByZoneSuccess = (data) => ({
  type: GET_BAR_ZONE_SUCCESS,
  data,
});

const barByZoneFailure = (data) => ({
  type: GET_BAR_ZONE_FAILURE,
  data,
});

const barByZoneReset = (data) => ({
  type: RESET_BAR_ZONE_SUCCESS,
  data,
});

export const barByZoneUser =
  (userId, stateId, cityId, successCallBackZone) => (dispatch) => {
    dispatch(barByZoneRequested());

    const url = zoneByCityUrl(userId, stateId, cityId);

    const onSuccess = (response) => {
      dispatch(barByZoneSuccess(response));
      successCallBackZone(response);
    };

    const onFailure = (response) => {
      dispatch(barByZoneFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetbarByZoneUser = () => (dispatch) => {
  dispatch(barByZoneReset());
};
