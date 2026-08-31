import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import { toast } from "react-toastify";
import {
  GET_BUILDING_NAME_FAILURE,
  GET_BUILDING_NAME_SUCCESS,
  GET_BUILDING_NAME_REQUEST,
  RESET_BUILDING_NAME_SUCCESS,
} from "./actionConstants";
import { approvalBuildingNameUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const buildingNameRequested = () => ({
  type: GET_BUILDING_NAME_REQUEST,
});

const buildingNameSuccess = (data) => ({
  type: GET_BUILDING_NAME_SUCCESS,
  data,
});

const buildingNameFailure = (data) => ({
  type: GET_BUILDING_NAME_FAILURE,
  data,
});

const buildingNameReset = (data) => ({
  type: RESET_BUILDING_NAME_SUCCESS,
  data,
});

export const buildingNameUser =
  (
    userId,
    approvalNumber,
    projectName,
    successCallBackApprovalValuation,
    failuerCallBackApprovalValuation,
  ) =>
  (dispatch) => {
    dispatch(buildingNameRequested());

    const url = approvalBuildingNameUrl(userId, approvalNumber, projectName);

    const onSuccess = (response) => {
      dispatch(buildingNameSuccess(response));
      successCallBackApprovalValuation(response);
    };

    const onFailure = (response) => {
      dispatch(buildingNameFailure(response));
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

export const resetbuildingNameUser = () => (dispatch) => {
  dispatch(buildingNameReset());
};
