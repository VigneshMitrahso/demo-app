import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_PROJECT_NAME_BY_LAT_LON_FAILURE,
  GET_PROJECT_NAME_BY_LAT_LON_SUCCESS,
  GET_PROJECT_NAME_BY_LAT_LON_REQUEST,
  RESET_PROJECT_NAME_BY_LAT_LON_SUCCESS,
} from "./actionConstants";
import { projectByLatLonUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const projectByLatLonRequested = () => ({
  type: GET_PROJECT_NAME_BY_LAT_LON_REQUEST,
});

const projectByLatLonSuccess = (data) => ({
  type: GET_PROJECT_NAME_BY_LAT_LON_SUCCESS,
  data,
});

const projectByLatLonFailure = (data) => ({
  type: GET_PROJECT_NAME_BY_LAT_LON_FAILURE,
  data,
});

const projectByLatLonReset = (data) => ({
  type: RESET_PROJECT_NAME_BY_LAT_LON_SUCCESS,
  data,
});

export const projectByLatLonUser =
  (
    userId,
    lat,
    lon,
    radius,
    propertyUrl,
    successCallBackProjectByLatLon,
    urlString = "",
  ) =>
  (dispatch) => {
    dispatch(projectByLatLonRequested());

    const url = projectByLatLonUrl(
      userId,
      lat,
      lon,
      radius,
      propertyUrl,
      urlString,
    );

    const onSuccess = (response) => {
      dispatch(projectByLatLonSuccess(response));
      successCallBackProjectByLatLon();
    };

    const onFailure = (response) => {
      dispatch(projectByLatLonFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetprojectByLatLonUser = () => (dispatch) => {
  dispatch(projectByLatLonReset());
};
