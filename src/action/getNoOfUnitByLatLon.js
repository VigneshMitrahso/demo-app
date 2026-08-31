import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_NO_OF_UNIT_BY_LAT_LON_FAILURE,
  GET_NO_OF_UNIT_BY_LAT_LON_SUCCESS,
  GET_NO_OF_UNIT_BY_LAT_LON_REQUEST,
  RESET_NO_OF_UNIT_BY_LAT_LON_SUCCESS,
} from "./actionConstants";
import { noOfUnitByLatLonUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const noOfUnitByLatLonRequested = () => ({
  type: GET_NO_OF_UNIT_BY_LAT_LON_REQUEST,
});

const noOfUnitByLatLonSuccess = (data) => ({
  type: GET_NO_OF_UNIT_BY_LAT_LON_SUCCESS,
  data,
});

const noOfUnitByLatLonFailure = (data) => ({
  type: GET_NO_OF_UNIT_BY_LAT_LON_FAILURE,
  data,
});

const noOfUnitByLatLonReset = (data) => ({
  type: RESET_NO_OF_UNIT_BY_LAT_LON_SUCCESS,
  data,
});

export const noOfUnitByLatLonUser =
  (userId, lat, lon, radius) => (dispatch) => {
    dispatch(noOfUnitByLatLonRequested());

    const url = noOfUnitByLatLonUrl(userId, lat, lon, radius);

    const onSuccess = (response) => {
      dispatch(noOfUnitByLatLonSuccess(response));
    };

    const onFailure = (response) => {
      dispatch(noOfUnitByLatLonFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetnoOfUnitByLatLonUser = () => (dispatch) => {
  dispatch(noOfUnitByLatLonReset());
};
