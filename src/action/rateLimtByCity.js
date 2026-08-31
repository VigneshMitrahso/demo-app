import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_RATE_LIMT_BY_CITY_FAILURE,
  GET_RATE_LIMT_BY_CITY_SUCCESS,
  GET_RATE_LIMT_BY_CITY_REQUEST,
  RESET_RATE_LIMT_BY_CITY_SUCCESS,
} from "./actionConstants";
import { rateLimitByCityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const rateLimitByStateCityRequested = () => ({
  type: GET_RATE_LIMT_BY_CITY_REQUEST,
});

const rateLimitByStateCitySuccess = (data) => ({
  type: GET_RATE_LIMT_BY_CITY_SUCCESS,
  data,
});

const rateLimitByStateCityFailure = (data) => ({
  type: GET_RATE_LIMT_BY_CITY_FAILURE,
  data,
});

const rateLimitByStateCityReset = (data) => ({
  type: RESET_RATE_LIMT_BY_CITY_SUCCESS,
  data,
});

export const rateLimitByStateCityUser =
  (userId, stateId, cityId) => (dispatch) => {
    dispatch(rateLimitByStateCityRequested());

    const url = rateLimitByCityUrl(userId, stateId, cityId);

    const onSuccess = (response) => {
      dispatch(rateLimitByStateCitySuccess(response));
    };

    const onFailure = (response) => {
      dispatch(rateLimitByStateCityFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetrateLimitByStateCityUser = () => (dispatch) => {
  dispatch(rateLimitByStateCityReset());
};
