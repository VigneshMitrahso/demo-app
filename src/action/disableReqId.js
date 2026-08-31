import { toast } from "react-toastify";
import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_DISABLE_REQ_ID_FAILURE,
  GET_DISABLE_REQ_ID_SUCCESS,
  GET_DISABLE_REQ_ID_REQUEST,
  RESET_DISABLE_REQ_ID_SUCCESS,
} from "./actionConstants";
import { disableReqIdUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const disableReqIdRequested = () => ({
  type: GET_DISABLE_REQ_ID_REQUEST,
});

const disableReqIdSuccess = (data) => ({
  type: GET_DISABLE_REQ_ID_SUCCESS,
  data,
});

const disableReqIdFailure = (data) => ({
  type: GET_DISABLE_REQ_ID_FAILURE,
  data,
});

const disableReqIdReset = (data) => ({
  type: RESET_DISABLE_REQ_ID_SUCCESS,
  data,
});

export const disableReqIdUser = (userId, name, mobileNo) => (dispatch) => {
  dispatch(disableReqIdRequested());

  const url = disableReqIdUrl(userId, encodeURIComponent(name), mobileNo);

  const onSuccess = (response) => {
    toast.success(response.data.status, {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    dispatch(disableReqIdSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(disableReqIdFailure(response));
    // Toastr.error(response.message);
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetdisableReqIdUser = () => (dispatch) => {
  dispatch(disableReqIdReset());
};
