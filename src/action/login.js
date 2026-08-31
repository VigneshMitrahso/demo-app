import { toast } from "react-toastify";
import { POST } from "../comman/constants";
import { apiCall } from "../comman/connect";
import moment from "moment";
import { LOGIN_FAILURE, LOGIN_SUCCESS, LOGIN_REQUEST } from "./actionConstants";
import { LOGIN_URL, RAPID_LOGIN_URL } from "../comman/urls";
import {
  setAccessToken,
  setUserId,
  setRefreshToken,
  setAccessTokenRapid,
  setUserIdRapid,
  setRefreshTokenRapid,
  setAccessTokenTime,
  setUserName,
  setPhoneNumber,
  setVideo,
  setSessonUser,
  setAes,
  setUserAdmin,
  // setUserAdmin,
} from "../comman/localStorage";
import { decryptRsa } from "../comman/decodeEncodeData";

const loginRequested = () => ({
  type: LOGIN_REQUEST,
});

const loginSuccess = (data) => ({
  type: LOGIN_SUCCESS,
  data,
});

const loginFailure = (data) => ({
  type: LOGIN_FAILURE,
  data,
});

export const loginUser =
  (email, password, recaptcha_token, successCallBack, failureCallBack) =>
  (dispatch) => {
    dispatch(loginRequested());

    const url = LOGIN_URL;

    var userDetail = {
      username: email,
      password: password,
      recaptcha_token,
      encryptionDetails: "PKCS1_OAEP",
    };
    // RSA_PKCS1_OAEP_PADDING

    // // Added as helper.

    //   var userDetail = {
    //     email: 'property_test_user',
    //     password: 'property_test_user@123',
    //   };

    const onSuccess = (response) => {
      decryptRsa(response.data.accessToken).then((aesKey) => {
        setAes(aesKey);
        successCallBack(response);
        setAccessToken(response.data.accessToken);
        setUserId(response.data.userId);
        setRefreshToken(response.data.refreshToken);
        setUserName(response.data.userName);
        if (!!response.data.admin) {
          setUserAdmin(!!response.data.admin);
        }
        setAccessTokenTime(moment().format("YYYY-MM-DD HH:mm:ss"));
        setVideo(null);
        setSessonUser(false);
        toast.success("Login Successfull", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
      dispatch(loginSuccess(response));
    };

    const onFailure = (response) => {
      failureCallBack(response);
      dispatch(loginFailure(response));
      toast.error(response.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    };

    apiCall(POST, url, userDetail, onSuccess, onFailure, dispatch);
  };

export const loginRapidUser =
  (username, password, successLogin, failedLogin) => (dispatch) => {
    dispatch(loginRequested());

    var userDetail = {
      username: username,
      password: password,
      encryptionDetails: "PKCS1_OAEP",
    };

    // Added as helper.
    // var userDetail = {
    //   email: 'test_user',
    //   password: 'test_user@321',
    // };

    const onSuccess = (response) => {
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      setUserIdRapid(response.data.userId);
      setUserName(response.data.userName);
      setPhoneNumber(response.data.userPhone);
      successLogin(response);
      setVideo(null);
      setSessonUser(false);
      dispatch(loginSuccess(response));
      toast.success("Login Successful", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    };

    const onFailure = (response) => {
      toast.error(
        "Link has expired. Please login using the latest link sent through SMS",
        {
          position: toast.POSITION.BOTTOM_CENTER,
        },
      );
      dispatch(loginFailure(response));
      failedLogin();
    };

    const url = RAPID_LOGIN_URL;

    apiCall(POST, url, userDetail, onSuccess, onFailure, dispatch);
  };
