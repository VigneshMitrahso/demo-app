import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_NO_OF_UNIT_BY_CITY_FAILURE,
  GET_NO_OF_UNIT_BY_CITY_SUCCESS,
  GET_NO_OF_UNIT_BY_CITY_REQUEST,
  RESET_NO_OF_UNIT_BY_CITY_SUCCESS,
} from "./actionConstants";
import { noOfUnitByCityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const noOfUnitByCityRequested = () => ({
  type: GET_NO_OF_UNIT_BY_CITY_REQUEST,
});

const noOfUnitByCitySuccess = (data) => ({
  type: GET_NO_OF_UNIT_BY_CITY_SUCCESS,
  data,
});

const noOfUnitByCityFailure = (data) => ({
  type: GET_NO_OF_UNIT_BY_CITY_FAILURE,
  data,
});

const noOfUnitByCityReset = (data) => ({
  type: RESET_NO_OF_UNIT_BY_CITY_SUCCESS,
  data,
});

export const noOfUnitByCityUser = (userId, stateId, cityId) => (dispatch) => {
  dispatch(noOfUnitByCityRequested());

  const url = noOfUnitByCityUrl(userId, stateId, cityId);

  const onSuccess = (response) => {
    dispatch(noOfUnitByCitySuccess(response));
  };

  const onFailure = (response) => {
    dispatch(noOfUnitByCityFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetnoOfUnitByCityUser = () => (dispatch) => {
  dispatch(noOfUnitByCityReset());
};
