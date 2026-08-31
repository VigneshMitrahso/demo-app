import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_ZONE_CITY_FAILURE,
  GET_ZONE_CITY_SUCCESS,
  GET_ZONE_CITY_REQUEST,
  RESET_ZONE_CITY_SUCCESS,
} from "./actionConstants";
import { zoneByCityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const zoneByCityRequested = () => ({
  type: GET_ZONE_CITY_REQUEST,
});

const zoneByCitySuccess = (data) => ({
  type: GET_ZONE_CITY_SUCCESS,
  data,
});

const zoneByCityFailure = (data) => ({
  type: GET_ZONE_CITY_FAILURE,
  data,
});

const zoneByCityReset = (data) => ({
  type: RESET_ZONE_CITY_SUCCESS,
  data,
});

export const zoneByCityUser =
  (userId, stateId, cityId, successZoneCallBack) => (dispatch) => {
    dispatch(zoneByCityRequested());

    const url = zoneByCityUrl(userId, stateId, cityId);

    const onSuccess = (response) => {
      dispatch(zoneByCitySuccess(response));
      successZoneCallBack();
    };

    const onFailure = (response) => {
      dispatch(zoneByCityFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetzoneByCityUser = () => (dispatch) => {
  dispatch(zoneByCityReset());
};
