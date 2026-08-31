import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_APPROVAL_BY_LAT_LON_FAILURE,
  GET_APPROVAL_BY_LAT_LON_SUCCESS,
  GET_APPROVAL_BY_LAT_LON_REQUEST,
  RESET_APPROVAL_BY_LAT_LON_SUCCESS,
} from "./actionConstants";
import { approvalByLatLonUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const approvalByLatLonRequested = () => ({
  type: GET_APPROVAL_BY_LAT_LON_REQUEST,
});

const approvalByLatLonSuccess = (data) => ({
  type: GET_APPROVAL_BY_LAT_LON_SUCCESS,
  data,
});

const approvalByLatLonFailure = (data) => ({
  type: GET_APPROVAL_BY_LAT_LON_FAILURE,
  data,
});

const approvalByLatLonReset = (data) => ({
  type: RESET_APPROVAL_BY_LAT_LON_SUCCESS,
  data,
});

export const approvalByLatLonUser =
  (
    userId,
    lat,
    lon,
    radius,
    propertyUrl,
    successCallBackApprovalByLatLon,
    urlString = "",
  ) =>
  (dispatch) => {
    dispatch(approvalByLatLonRequested());

    const url = approvalByLatLonUrl(
      userId,
      lat,
      lon,
      radius,
      propertyUrl,
      urlString,
    );

    const onSuccess = (response) => {
      dispatch(approvalByLatLonSuccess(response));
      successCallBackApprovalByLatLon();
    };

    const onFailure = (response) => {
      dispatch(approvalByLatLonFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetapprovalByLatLonUser = () => (dispatch) => {
  dispatch(approvalByLatLonReset());
};
