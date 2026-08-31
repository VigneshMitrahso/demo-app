import { GET } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_LOCATION_TRAKING_FAILURE,
  GET_LOCATION_TRAKING_SUCCESS,
  GET_LOCATION_TRAKING_REQUEST,
  RESET_LOCATION_TRAKING_SUCCESS,
} from "./actionConstants";
import { locationTracking } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";
import { ACCESS_TOKEN } from "../comman/constants";

const locationTrackingRequested = () => ({
  type: GET_LOCATION_TRAKING_REQUEST,
});

const locationTrackingSuccess = (data) => ({
  type: GET_LOCATION_TRAKING_SUCCESS,
  data,
});

const locationTrackingFailure = (data) => ({
  type: GET_LOCATION_TRAKING_FAILURE,
  data,
});

const locationTrackingReset = (data) => ({
  type: RESET_LOCATION_TRAKING_SUCCESS,
  data,
});

export const getLocationTracking =
  (userId, emp_id, successCallBack, failureCallBack) => (dispatch) => {
    dispatch(locationTrackingRequested());

    const url = locationTracking(userId, emp_id);

    const onSuccess = (response) => {
      dispatch(locationTrackingSuccess(response));
      successCallBack(response);
    };

    const onFailure = (response) => {
      dispatch(locationTrackingFailure(response));
      failureCallBack(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetLocationTracking = () => (dispatch) => {
  dispatch(locationTrackingReset());
};
