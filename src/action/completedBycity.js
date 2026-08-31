import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_COMPLETED_BY_CITY_FAILURE,
  GET_COMPLETED_BY_CITY_SUCCESS,
  GET_COMPLETED_BY_CITY_REQUEST,
  RESET_COMPLETED_BY_CITY_SUCCESS,
} from "./actionConstants";
import { completedByCityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const completedByStateCityRequested = () => ({
  type: GET_COMPLETED_BY_CITY_REQUEST,
});

const completedByStateCitySuccess = (data) => ({
  type: GET_COMPLETED_BY_CITY_SUCCESS,
  data,
});

const completedByStateCityFailure = (data) => ({
  type: GET_COMPLETED_BY_CITY_FAILURE,
  data,
});

const completedByStateCityReset = (data) => ({
  type: RESET_COMPLETED_BY_CITY_SUCCESS,
  data,
});

export const completedByStateCityUser =
  (userId, stateId, cityId) => (dispatch) => {
    dispatch(completedByStateCityRequested());

    const url = completedByCityUrl(userId, stateId, cityId);

    const onSuccess = (response) => {
      dispatch(completedByStateCitySuccess(response));
    };

    const onFailure = (response) => {
      dispatch(completedByStateCityFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetcompletedByStateCityUser = () => (dispatch) => {
  dispatch(completedByStateCityReset());
};
