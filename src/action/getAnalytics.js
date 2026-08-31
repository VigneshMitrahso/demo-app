import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_ANALYTICS_FAILURE,
  GET_ANALYTICS_SUCCESS,
  GET_ANALYTICS_REQUEST,
  RESET_ANALYTICS_SUCCESS,
} from "./actionConstants";
import { analyticsUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const analyticsRequested = () => ({
  type: GET_ANALYTICS_REQUEST,
});

const analyticsSuccess = (data) => ({
  type: GET_ANALYTICS_SUCCESS,
  data,
});

const analyticsFailure = (data) => ({
  type: GET_ANALYTICS_FAILURE,
  data,
});

const analyticsReset = (data) => ({
  type: RESET_ANALYTICS_SUCCESS,
  data,
});

export const analyticsUser =
  (
    userId,
    stateId,
    cityId,
    urls,
    onSuccesCallBackAnalytics,
    onFailureCallBackAnalytics,
  ) =>
  (dispatch) => {
    dispatch(analyticsRequested());

    const url = analyticsUrl(userId, stateId, cityId, urls);

    const onSuccess = (response) => {
      onSuccesCallBackAnalytics(response);
      dispatch(analyticsSuccess(response));
    };

    const onFailure = (response) => {
      onFailureCallBackAnalytics(response);
      dispatch(analyticsFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetanalyticsUser = () => (dispatch) => {
  dispatch(analyticsReset());
};
