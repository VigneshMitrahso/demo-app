import { toast } from "react-toastify";
import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_REMOVE_IMAGE_FAILURE,
  GET_REMOVE_IMAGE_SUCCESS,
  GET_REMOVE_IMAGE_REQUEST,
  RESET_REMOVE_IMAGE_SUCCESS,
} from "./actionConstants";
import { removeImageUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const removeImageUserRequested = () => ({
  type: GET_REMOVE_IMAGE_REQUEST,
});

const removeImageUserSuccess = (data) => ({
  type: GET_REMOVE_IMAGE_SUCCESS,
  data,
});

const removeImageUserFailure = (data) => ({
  type: GET_REMOVE_IMAGE_FAILURE,
  data,
});

const removeImageUserReset = (data) => ({
  type: RESET_REMOVE_IMAGE_SUCCESS,
  data,
});

export const removeImageUserAction =
  (userId, imageUrl, reqId) => (dispatch) => {
    dispatch(removeImageUserRequested());

    const url = removeImageUrl(userId, imageUrl, encodeURIComponent(reqId));

    const onSuccess = (response) => {
      toast.success("Image Removed Successfully", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      dispatch(removeImageUserSuccess(response));
    };

    const onFailure = (response) => {
      toast.error(response.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      dispatch(removeImageUserFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetremoveImageUserUser = () => (dispatch) => {
  dispatch(removeImageUserReset());
};
