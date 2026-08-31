import { GET } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_GRID_FAILURE,
  GET_GRID_SUCCESS,
  GET_GRID_REQUEST,
  RESET_GRID_SUCCESS,
} from "./actionConstants";
import { gridUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";
import { ACCESS_TOKEN } from "../comman/constants";

const gridRequested = () => ({
  type: GET_GRID_REQUEST,
});

const gridSuccess = (data) => ({
  type: GET_GRID_SUCCESS,
  data,
});

const gridFailure = (data) => ({
  type: GET_GRID_FAILURE,
  data,
});

const gridReset = (data) => ({
  type: RESET_GRID_SUCCESS,
  data,
});

export const gridUser = (bbox) => (dispatch) => {
  dispatch(gridRequested());

  const url = gridUrl(bbox);

  const onSuccess = (response) => {
    dispatch(gridSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(gridFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetgridUser = () => (dispatch) => {
  dispatch(gridReset());
};
