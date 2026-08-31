import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_APPROVAL_BY_CITY_FAILURE,
  GET_APPROVAL_BY_CITY_SUCCESS,
  GET_APPROVAL_BY_CITY_REQUEST,
  RESET_APPROVAL_BY_CITY_SUCCESS,
} from "./actionConstants";
import { approvalByCityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const approvalByCityRequested = () => ({
  type: GET_APPROVAL_BY_CITY_REQUEST,
});

const approvalByCitySuccess = (data) => ({
  type: GET_APPROVAL_BY_CITY_SUCCESS,
  data,
});

const approvalByCityFailure = (data) => ({
  type: GET_APPROVAL_BY_CITY_FAILURE,
  data,
});

const approvalByCityReset = (data) => ({
  type: RESET_APPROVAL_BY_CITY_SUCCESS,
  data,
});

export const approvalByCityUser =
  (userId, stateId, cityId, propertyUrl, successCallBackApproval) =>
  (dispatch) => {
    dispatch(approvalByCityRequested());

    const url = approvalByCityUrl(userId, stateId, cityId, propertyUrl);

    const onSuccess = (response) => {
      dispatch(approvalByCitySuccess(response));
      successCallBackApproval();
    };

    const onFailure = (response) => {
      dispatch(approvalByCityFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetapprovalByCityUser = () => (dispatch) => {
  dispatch(approvalByCityReset());
};
