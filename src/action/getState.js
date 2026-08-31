import { GET } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_STATE_FAILURE,
  GET_STATE_SUCCESS,
  GET_STATE_REQUEST,
  RESET_STATE_SUCCESS,
} from "./actionConstants";
import { stateUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";
import { ACCESS_TOKEN } from "../comman/constants";

const stateRequested = () => ({
  type: GET_STATE_REQUEST,
});

const stateSuccess = (data) => ({
  type: GET_STATE_SUCCESS,
  data,
});

const stateFailure = (data) => ({
  type: GET_STATE_FAILURE,
  data,
});

const stateReset = (data) => ({
  type: RESET_STATE_SUCCESS,
  data,
});

export const stateUser = (userId) => (dispatch) => {
  dispatch(stateRequested());

  const url = stateUrl(userId);

  const onSuccess = (response) => {
    dispatch(stateSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(stateFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetStateUser = () => (dispatch) => {
  dispatch(stateReset());
};
