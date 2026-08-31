import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_PROJECT_NAME_FAILURE,
  GET_PROJECT_NAME_SUCCESS,
  GET_PROJECT_NAME_REQUEST,
  RESET_PROJECT_NAME_SUCCESS,
} from "./actionConstants";
import { projectNameUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const projectNameRequested = () => ({
  type: GET_PROJECT_NAME_REQUEST,
});

const projectNameSuccess = (data) => ({
  type: GET_PROJECT_NAME_SUCCESS,
  data,
});

const projectNameFailure = (data) => ({
  type: GET_PROJECT_NAME_FAILURE,
  data,
});

const projectNameReset = (data) => ({
  type: RESET_PROJECT_NAME_SUCCESS,
  data,
});

export const projectNameUser =
  (userId, stateId, cityId, propertyUrl, successCallBackProject) =>
  (dispatch) => {
    dispatch(projectNameRequested());

    const url = projectNameUrl(userId, stateId, cityId, propertyUrl);

    const onSuccess = (response) => {
      dispatch(projectNameSuccess(response));
      successCallBackProject();
    };

    const onFailure = (response) => {
      dispatch(projectNameFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetprojectNameUser = () => (dispatch) => {
  dispatch(projectNameReset());
};
