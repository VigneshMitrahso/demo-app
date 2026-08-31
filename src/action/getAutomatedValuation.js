import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import { toast } from "react-toastify";
import {
  GET_APPROVAL_FAILURE,
  GET_APPROVAL_SUCCESS,
  GET_APPROVAL_REQUEST,
  RESET_APPROVAL_SUCCESS,
} from "./actionConstants";
import { approvalValuationUrl } from "../comman/urls";

import { _getStorageValue } from "../comman/localStorage";

const approvalValuationRequested = () => ({
  type: GET_APPROVAL_REQUEST,
});

const approvalValuationSuccess = (data) => ({
  type: GET_APPROVAL_SUCCESS,
  data,
});

const approvalValuationFailure = (data) => ({
  type: GET_APPROVAL_FAILURE,
  data,
});

const approvalValuationReset = (data) => ({
  type: RESET_APPROVAL_SUCCESS,
  data,
});

export const approvalValuationUser =
  (
    userId,
    propertyAnalyticsUrl,
    successCallBackApprovalValuation,
    failuerCallBackApprovalValuation,
  ) =>
  (dispatch) => {
    dispatch(approvalValuationRequested());

    const url = approvalValuationUrl(userId, propertyAnalyticsUrl);

    const onSuccess = (response) => {
      dispatch(approvalValuationSuccess(response));
      successCallBackApprovalValuation(response);
    };

    const onFailure = (response) => {
      dispatch(approvalValuationFailure(response));
      failuerCallBackApprovalValuation(response);
      toast.error("Please Enter Correct Value", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetapprovalValuationUser = () => (dispatch) => {
  dispatch(approvalValuationReset());
};
