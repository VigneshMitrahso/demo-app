import { toast } from "react-toastify";
import { DELETE, REFRESH_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  LOGOUT_FAILURE,
  LOGOUT_SUCCESS,
  LOGOUT_REQUEST,
} from "./actionConstants";
import { LOGOUT_URL, SESSON_LOGOUT_URL } from "../comman/urls";
import {
  removeAllCookies,
  _getStorageValue,
  getSessonUser,
} from "../comman/localStorage";

const logoutRequested = () => ({
  type: LOGOUT_REQUEST,
});

const logoutSuccess = (data) => ({
  type: LOGOUT_SUCCESS,
  data,
});

const logoutFailure = (data) => ({
  type: LOGOUT_FAILURE,
  data,
});

export const logoutUser = (logOutCallBack) => (dispatch) => {
  dispatch(logoutRequested());

  var setUrl = getSessonUser();

  if (setUrl) {
    var url = SESSON_LOGOUT_URL;
  } else {
    var url = LOGOUT_URL;
  }

  const onSuccess = (response) => {
    dispatch(logoutSuccess(response));
    logOutCallBack();
    removeAllCookies();
    toast.success("Logout Successful", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  };

  const onFailure = (response) => {
    if (response.status === false) {
      logOutCallBack();
      removeAllCookies();
      toast.success("Logout Successful", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    dispatch(logoutFailure(response));
  };
  _getStorageValue(REFRESH_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(DELETE, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};
