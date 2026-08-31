import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_BUILDER_FAILURE,
  GET_BUILDER_SUCCESS,
  GET_BUILDER_REQUEST,
  RESET_BUILDER_SUCCESS,
} from "./actionConstants";
import { builderUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const builderRequested = () => ({
  type: GET_BUILDER_REQUEST,
});

const builderSuccess = (data) => ({
  type: GET_BUILDER_SUCCESS,
  data,
});

const builderFailure = (data) => ({
  type: GET_BUILDER_FAILURE,
  data,
});

const builderReset = (data) => ({
  type: RESET_BUILDER_SUCCESS,
  data,
});

export const builderUser =
  (userId, stateId, cityId, propertyUrl, successCallBackBuilder) =>
  (dispatch) => {
    dispatch(builderRequested());

    const url = builderUrl(userId, stateId, cityId, propertyUrl);

    const onSuccess = (response) => {
      dispatch(builderSuccess(response));
      successCallBackBuilder();
    };

    const onFailure = (response) => {
      dispatch(builderFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetbuilderUser = () => (dispatch) => {
  dispatch(builderReset());
};
