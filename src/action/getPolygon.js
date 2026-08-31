import { POST, ACCESS_TOKEN, GET } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_POLYGON_FAILURE,
  GET_POLYGON_SUCCESS,
  GET_POLYGON_REQUEST,
  RESET_POLYGON_SUCCESS,
} from "./actionConstants";
import { polygonAreaUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const polygonRequested = () => ({
  type: GET_POLYGON_REQUEST,
});

const polygonSuccess = (data) => ({
  type: GET_POLYGON_SUCCESS,
  data,
});

const polygonFailure = (data) => ({
  type: GET_POLYGON_FAILURE,
  data,
});

const polygonReset = (data) => ({
  type: RESET_POLYGON_SUCCESS,
  data,
});

export const getpolygonUser = () => (dispatch) => {
  dispatch(polygonRequested({ isFetchingpolygon: true }));
  const url = polygonAreaUrl();

  const onSuccess = (response) => {
    dispatch(polygonSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(polygonFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetpolygonUser = () => (dispatch) => {
  dispatch(polygonReset());
};
