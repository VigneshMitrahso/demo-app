import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_BAR_ANALYITICS_FAILURE,
  GET_BAR_ANALYITICS_SUCCESS,
  GET_BAR_ANALYITICS_REQUEST,
  RESET_BAR_ANALYITICS_SUCCESS,
} from "./actionConstants";
import { barAnalyticsUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const barAnalyiticsRequested = () => ({
  type: GET_BAR_ANALYITICS_REQUEST,
});

const barAnalyiticsSuccess = (data) => ({
  type: GET_BAR_ANALYITICS_SUCCESS,
  data,
});

const barAnalyiticsFailure = (data) => ({
  type: GET_BAR_ANALYITICS_FAILURE,
  data,
});

const barAnalyiticsReset = (data) => ({
  type: RESET_BAR_ANALYITICS_SUCCESS,
  data,
});

export const barAnalyiticsUser =
  (userId, stateId, cityId, barUrl, onSuccessAnalyticts, onFailureAnalytics) =>
  (dispatch) => {
    dispatch(barAnalyiticsRequested());

    const url = barAnalyticsUrl(userId, stateId, cityId, barUrl);

    const onSuccess = (response) => {
      dispatch(barAnalyiticsSuccess(response));
      onSuccessAnalyticts(response);
    };

    const onFailure = (response) => {
      dispatch(barAnalyiticsFailure(response));
      onFailureAnalytics(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetbarAnalyiticsUser = () => (dispatch) => {
  dispatch(barAnalyiticsReset());
};
