import { GET } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_LOGIN_ENC_FAILURE,
  GET_LOGIN_ENC_SUCCESS,
  GET_LOGIN_ENC_REQUEST,
  RESET_LOGIN_ENC_SUCCESS,
} from "./actionConstants";
import { LOG_IN_ENCRYPT_URL } from "../comman/urls";

// import { _getStorageValue } from "../comman/localStorage";
// import { ACCESS_TOKEN } from "../comman/constants";

const loginEncRequested = () => ({
  type: GET_LOGIN_ENC_REQUEST,
});

const loginEncSuccess = (data) => ({
  type: GET_LOGIN_ENC_SUCCESS,
  data,
});

const loginEncFailure = (data) => ({
  type: GET_LOGIN_ENC_FAILURE,
  data,
});

const loginEncReset = (data) => ({
  type: RESET_LOGIN_ENC_SUCCESS,
  data,
});

export const loginEncUser = (successCallBack) => (dispatch) => {
  dispatch(loginEncRequested());

  const url = LOG_IN_ENCRYPT_URL;

  const onSuccess = (response) => {
    dispatch(loginEncSuccess(response));
    successCallBack(response);
  };

  const onFailure = (response) => {
    dispatch(loginEncFailure(response));
  };

  //   _getStorageValue(ACCESS_TOKEN).then((token) => {
  // if (token !== undefined && token !== null) {
  apiCall(GET, url, "", onSuccess, onFailure, dispatch, "");
  // }
  //   });
};

export const resetloginEncUser = () => (dispatch) => {
  dispatch(loginEncReset());
};
