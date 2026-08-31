import { GET } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_HISTORY_FAILURE,
  GET_HISTORY_SUCCESS,
  GET_HISTORY_REQUEST,
  RESET_HISTORY_SUCCESS,
} from "./actionConstants";
import { getHistoryUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";
import { ACCESS_TOKEN } from "../comman/constants";

const historyRequested = () => ({
  type: GET_HISTORY_REQUEST,
});

const historySuccess = (data) => ({
  type: GET_HISTORY_SUCCESS,
  data,
});

const historyFailure = (data) => ({
  type: GET_HISTORY_FAILURE,
  data,
});

const historyReset = (data) => ({
  type: RESET_HISTORY_SUCCESS,
  data,
});

export const historyUser = (userId) => (dispatch) => {
  dispatch(historyRequested());

  const url = getHistoryUrl(userId);

  const onSuccess = (response) => {
    dispatch(historySuccess(response));
  };

  const onFailure = (response) => {
    dispatch(historyFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resethistoryUser = () => (dispatch) => {
  dispatch(historyReset());
};
