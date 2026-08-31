import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_IMAGE_URL_FAILURE,
  GET_IMAGE_URL_SUCCESS,
  GET_IMAGE_URL_REQUEST,
  RESET_IMAGE_URL_SUCCESS,
} from "./actionConstants";
import { getImageUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const getImageUrlRequested = () => ({
  type: GET_IMAGE_URL_REQUEST,
});

const getImageUrlSuccess = (data) => ({
  type: GET_IMAGE_URL_SUCCESS,
  data,
});

const getImageUrlFailure = (data) => ({
  type: GET_IMAGE_URL_FAILURE,
  data,
});

const getImageUrlReset = (data) => ({
  type: RESET_IMAGE_URL_SUCCESS,
  data,
});

export const getImageUrlUser = (userId, reqId, successCall) => (dispatch) => {
  dispatch(getImageUrlRequested());

  const url = getImageUrl(userId, encodeURIComponent(reqId));

  const onSuccess = (response) => {
    successCall(response);
    dispatch(getImageUrlSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(getImageUrlFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetgetImageUrlUser = () => (dispatch) => {
  dispatch(getImageUrlReset());
};
