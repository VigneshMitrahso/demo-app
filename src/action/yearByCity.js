import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_YEAR_STATE_CITY_FAILURE,
  GET_YEAR_STATE_CITY_SUCCESS,
  GET_YEAR_STATE_CITY_REQUEST,
  RESET_YEAR_STATE_CITY_SUCCESS,
} from "./actionConstants";
import { yearByCityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const yearByStateCityRequested = () => ({
  type: GET_YEAR_STATE_CITY_REQUEST,
});

const yearByStateCitySuccess = (data) => ({
  type: GET_YEAR_STATE_CITY_SUCCESS,
  data,
});

const yearByStateCityFailure = (data) => ({
  type: GET_YEAR_STATE_CITY_FAILURE,
  data,
});

const yearByStateCityReset = (data) => ({
  type: RESET_YEAR_STATE_CITY_SUCCESS,
  data,
});

export const yearByStateCityUser =
  (userId, stateId, cityId, propertyTypeUrl, successCallBackYear) =>
  (dispatch) => {
    dispatch(yearByStateCityRequested());

    const url = yearByCityUrl(userId, stateId, cityId, propertyTypeUrl);

    const onSuccess = (response) => {
      dispatch(yearByStateCitySuccess(response));
      successCallBackYear();
    };

    const onFailure = (response) => {
      dispatch(yearByStateCityFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetyearByStateCityUser = () => (dispatch) => {
  dispatch(yearByStateCityReset());
};
