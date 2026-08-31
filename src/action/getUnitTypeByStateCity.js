import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_UNIT_TYPE_STATE_CITY_FAILURE,
  GET_UNIT_TYPE_STATE_CITY_SUCCESS,
  GET_UNIT_TYPE_STATE_CITY_REQUEST,
  RESET_UNIT_TYPE_STATE_CITY_SUCCESS,
} from "./actionConstants";
import { unitTypeByCityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const unitTypeByStateCityRequested = () => ({
  type: GET_UNIT_TYPE_STATE_CITY_REQUEST,
});

const unitTypeByStateCitySuccess = (data) => ({
  type: GET_UNIT_TYPE_STATE_CITY_SUCCESS,
  data,
});

const unitTypeByStateCityFailure = (data) => ({
  type: GET_UNIT_TYPE_STATE_CITY_FAILURE,
  data,
});

const unitTypeByStateCityReset = (data) => ({
  type: RESET_UNIT_TYPE_STATE_CITY_SUCCESS,
  data,
});

export const unitTypeByStateCityUser =
  (userId, stateId, cityId, unitType, successCallBackUnit) => (dispatch) => {
    dispatch(unitTypeByStateCityRequested());

    const url = unitTypeByCityUrl(userId, stateId, cityId, unitType);

    const onSuccess = (response) => {
      dispatch(unitTypeByStateCitySuccess(response));
      successCallBackUnit();
    };

    const onFailure = (response) => {
      dispatch(unitTypeByStateCityFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetunitTypeByStateCityUser = () => (dispatch) => {
  dispatch(unitTypeByStateCityReset());
};
