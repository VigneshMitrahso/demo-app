import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_MONTH_BY_CITY_FAILURE,
  GET_MONTH_BY_CITY_SUCCESS,
  GET_MONTH_BY_CITY_REQUEST,
  RESET_MONTH_BY_CITY_SUCCESS,
} from "./actionConstants";
import { monthByCityUrl } from "../comman/urls";

import { getAccessToken } from "../comman/localStorage";
import { _getStorageValue } from "../comman/localStorage";

const monthByStateCityRequested = () => ({
  type: GET_MONTH_BY_CITY_REQUEST,
});

const monthByStateCitySuccess = (data) => ({
  type: GET_MONTH_BY_CITY_SUCCESS,
  data,
});

const monthByStateCityFailure = (data) => ({
  type: GET_MONTH_BY_CITY_FAILURE,
  data,
});

const monthByStateCityReset = (data) => ({
  type: RESET_MONTH_BY_CITY_SUCCESS,
  data,
});

export const monthByStateCityUser =
  (userId, stateId, cityId, propertyType) => (dispatch) => {
    // var token = getAccessToken();

    dispatch(monthByStateCityRequested());

    const url = monthByCityUrl(userId, stateId, cityId, propertyType);

    const onSuccess = (response) => {
      dispatch(monthByStateCitySuccess(response));
    };

    const onFailure = (response) => {
      dispatch(monthByStateCityFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetmonthByStateCityUser = () => (dispatch) => {
  dispatch(monthByStateCityReset());
};
