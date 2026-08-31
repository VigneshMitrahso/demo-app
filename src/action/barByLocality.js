import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_BAR_LOCALITY_FAILURE,
  GET_BAR_LOCALITY_SUCCESS,
  GET_BAR_LOCALITY_REQUEST,
  RESET_BAR_LOCALITY_SUCCESS,
} from "./actionConstants";
import { localityByCityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const barByLocalityRequested = () => ({
  type: GET_BAR_LOCALITY_REQUEST,
});

const barByLocalitySuccess = (data) => ({
  type: GET_BAR_LOCALITY_SUCCESS,
  data,
});

const barByLocalityFailure = (data) => ({
  type: GET_BAR_LOCALITY_FAILURE,
  data,
});

const barByLocalityReset = (data) => ({
  type: RESET_BAR_LOCALITY_SUCCESS,
  data,
});

export const barByLocalityUser =
  (userId, stateId, cityId, successCallBackBarLoc) => (dispatch) => {
    dispatch(barByLocalityRequested());

    const url = localityByCityUrl(userId, stateId, cityId);

    const onSuccess = (response) => {
      dispatch(barByLocalitySuccess(response));
      successCallBackBarLoc(response);
    };

    const onFailure = (response) => {
      dispatch(barByLocalityFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetbarByLocalityUser = () => (dispatch) => {
  dispatch(barByLocalityReset());
};
