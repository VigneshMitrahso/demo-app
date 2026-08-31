import { toast } from "react-toastify";

import { POST } from "../comman/constants";

import { apiCall } from "../comman/connect";

import moment from "moment";

import {
  SESSON_LOGIN_FAILURE,
  SESSON_LOGIN_SUCCESS,
  SESSON_LOGIN_REQUEST,
} from "./actionConstants";
import { SESSON_LOGIN_URL } from "../comman/urls";

import {
  setAccessToken,
  setUserId,
  setRefreshToken,
  setAccessTokenTime,
  setUserName,
  setVideo,
  setSessonUser,
  setAes,
  setUserAdmin,
} from "../comman/localStorage";

import { decryptRsa } from "../comman/decodeEncodeData";

const sessonLoginRequested = () => ({
  type: SESSON_LOGIN_REQUEST,
});

const sessonLoginSuccess = (data) => ({
  type: SESSON_LOGIN_SUCCESS,
  data,
});

const sessonLoginFailure = (data) => ({
  type: SESSON_LOGIN_FAILURE,
  data,
});

export const sessonLoginUser =
  (email, password, appRef, successCallBack, failureCallBack) => (dispatch) => {
    dispatch(sessonLoginRequested());

    const url = SESSON_LOGIN_URL;

    var userDetail = {
      user_id: email,
      session_id: password,
      app_reference: appRef,
      encryptionDetails: "PKCS1_OAEP",
    };

    const onSuccess = (response) => {
      decryptRsa(response.data.accessToken).then((aesKey) => {
        setAes(aesKey);
        successCallBack(response);
        setAccessToken(response.data.accessToken);
        setUserId(response.data.userId);
        setRefreshToken(response.data.refreshToken);
        setUserName(response.data.userName);
        // setUserAdmin(response.data.admin);
        if (!!response.data.admin) {
          setUserAdmin(!!response.data.admin);
        }
        setAccessTokenTime(moment().format("YYYY-MM-DD HH:mm:ss"));
        setVideo(null);
        setSessonUser(true);
        dispatch(sessonLoginSuccess(response));
        toast.success("Login Successful", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
    };

    const onFailure = (response) => {
      failureCallBack(response);
      dispatch(sessonLoginFailure(response));
      toast.error(response.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    };

    apiCall(POST, url, userDetail, onSuccess, onFailure, dispatch);
  };
