/*
 * Helper methods to access local cookie storage.
 */
// import react from "react";
import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";
import moment from "moment";
import { REFERSH_URL, SESSON_REFERSH_URL } from "./urls";
import { AES_KEY, POST, PRIVATE_KEY } from "./constants";
import { refreshAccessToken } from "./connect";

// constant

import {
  ACCESS_TOKEN,
  USER_ID,
  PHONE_NUMBER,
  REFRESH_TOKEN,
  ACCESS_TOKEN_TIME,
  DISTANCE,
  TIME,
  REPORTDATA,
  USER_NAME,
  VIDEO_CERDENTIAL,
  SESSON_USER,
  ACCESS_TOKEN_RAPID,
  REFRESH_TOKEN_RAPID,
  USER_ID_RAPID,
  USER_ADMIN,
} from "./constants";
import { layerGroup } from "leaflet";

const cookies = new Cookies();

export const _getStorageValueRapid = async (storageKey) =>
  new Promise(async function (resolve, reject) {
    let currentAccessToken = await cookies.get(storageKey);
    if (storageKey === "ACCESS_TOKEN") {
      var refresh = jwt_decode(getRefreshToken());
      if (refresh.exp <= Math.round(new Date().getTime() / 1000)) {
        removeAllCookies();
        window.location.reload();
      } else {
        var access = jwt_decode(getAccessToken());
        if (access.exp < Math.round(new Date().getTime() / 1000)) {
          var setUrls = getSessonUser();
          if (setUrls) {
            var url = SESSON_REFERSH_URL;
          } else {
            var url = REFERSH_URL;
          }
          refreshAccessToken(POST, url, getRefreshToken()).then((response) => {
            if (response.status === false) {
              removeAllCookies();
              window.location.reload();
            } else {
              setAccessToken(response.data.accessToken);
              setUserIdRapid(response.data.userId);
              setRefreshToken(response.data.refreshToken);
              setUserName(response.data.userName);
              return response.data.accessToken;
            }
          });
        } else {
          resolve(currentAccessToken);
        }
      }
    } else {
      resolve(currentAccessToken);
    }
  });

export const _getStorageValue = (storageKey) =>
  new Promise(async function (resolve, reject) {
    //do something
    let currentAccessToken = await cookies.get(storageKey);

    if (storageKey === "ACCESS_TOKEN") {
      var refresh = jwt_decode(getRefreshToken());
      if (refresh.exp <= Math.round(new Date().getTime() / 1000)) {
        removeAllCookies();
        window.location.reload();
      } else {
        var access = jwt_decode(getAccessToken());
        if (access.exp < Math.round(new Date().getTime() / 1000)) {
          var setUrls = getSessonUser();
          if (setUrls) {
            var url = SESSON_REFERSH_URL;
          } else {
            var url = REFERSH_URL;
          }

          refreshAccessToken(POST, url, getRefreshToken()).then((respones) => {
            if (respones?.status === false) {
              removeAllCookies();
              window.location.reload();
            } else {
              if (respones && respones.data) {
                setAccessToken(respones.data.accessToken);
                setUserId(respones.data.userId);
                setRefreshToken(respones.data.refreshToken);
                setUserName(respones.data.userName);
                setVideo(null);
                setAccessTokenTime(moment().format("YYYY-MM-DD HH:mm:ss"));
                resolve(respones.data.accessToken);
              }
            }
          });
        } else {
          resolve(currentAccessToken);
        }
      }
    } else {
      resolve(currentAccessToken);
    }
  });

export const setAccessToken = (accessToken) => {
  cookies.set(ACCESS_TOKEN, accessToken);
};

export const getAccessToken = () => {
  return cookies.get(ACCESS_TOKEN);
};

export const setAccessTokenRapid = (accessTokenRapid) => {
  cookies.set(ACCESS_TOKEN_RAPID, accessTokenRapid);
};

export const getAccessTokenRapid = () => {
  return cookies.get(ACCESS_TOKEN_RAPID);
};

export const setRefreshTokenRapid = (refreshTokenRapid) => {
  cookies.set(REFRESH_TOKEN_RAPID, refreshTokenRapid);
};

export const getRefreshTokenRapid = () => {
  return cookies.get(REFRESH_TOKEN_RAPID);
};

export const setUserIdRapid = (userIdRapid) => {
  cookies.set(USER_ID_RAPID, userIdRapid);
};

export const getUserIdRapid = () => {
  return cookies.get(USER_ID_RAPID);
};

export const setPhoneNumber = (phoneNumber) => {
  cookies.set(PHONE_NUMBER, phoneNumber);
};

export const getPhoneNumber = () => {
  return cookies.get(PHONE_NUMBER);
};

export const setUserId = (userId) => {
  cookies.set(USER_ID, userId);
};

export const getUserId = () => {
  return cookies.get(USER_ID);
};

export const setVideo = (videoCredential) => {
  cookies.set(VIDEO_CERDENTIAL, videoCredential);
};

export const getVideo = () => {
  return cookies.get(VIDEO_CERDENTIAL);
};

export const setUserName = (userName) => {
  cookies.set(USER_NAME, userName);
};

export const getUserName = () => {
  return cookies.get(USER_NAME);
};

export const setUserAdmin = (userAdmin) => {
  cookies.set(USER_ADMIN, userAdmin);
};

export const getUserAdmin = () => {
  return cookies.get(USER_ADMIN);
};
export const setRefreshToken = (refreshToken) => {
  cookies.set(REFRESH_TOKEN, refreshToken);
};

export const getRefreshToken = () => {
  return cookies.get(REFRESH_TOKEN);
};

export const setAccessTokenTime = (refreshToken) => {
  cookies.set(ACCESS_TOKEN_TIME, refreshToken);
};

export const getAccessTokenTime = () => {
  return cookies.get(ACCESS_TOKEN_TIME);
};

export const setTime = (time) => {
  cookies.set(TIME, time);
};

export const getTime = () => {
  return cookies.get(TIME);
};

export const setDistance = (distance) => {
  cookies.set(DISTANCE, distance);
};

export const getDistance = () => {
  return cookies.get(DISTANCE);
};

export const setReportData = (reportData) => {
  cookies.set(REPORTDATA, reportData);
};

export const getReportData = () => {
  return cookies.get(REPORTDATA);
};

export const setSessonUser = (sessonUser) => {
  cookies.set(SESSON_USER, sessonUser);
};

export const getSessonUser = () => {
  return cookies.get(SESSON_USER);
};

export const setRsaPrivate = (key) => {
  cookies.set(PRIVATE_KEY, key);
};

export const setAes = (key) => {
  cookies.set(AES_KEY, key);
};

export const removeAllCookies = () => {
  // window.addEventListener(
  //   "beforeunload",
  cookies.remove(ACCESS_TOKEN);
  cookies.remove(USER_ID);
  cookies.remove(REFRESH_TOKEN);
  cookies.remove(ACCESS_TOKEN_TIME);
  cookies.remove(USER_NAME);
  cookies.remove(SESSON_USER);
  cookies.remove(USER_ADMIN);
  cookies.remove(VIDEO_CERDENTIAL);
  cookies.remove(ACCESS_TOKEN, { path: "/customer-connect" });
  cookies.remove(USER_ID, { path: "/customer-connect" });
  cookies.remove(REFRESH_TOKEN, { path: "/customer-connect" });
  cookies.remove(ACCESS_TOKEN_TIME, { path: "/customer-connect" });
  cookies.remove(USER_NAME, { path: "/customer-connect" });
  cookies.remove(SESSON_USER, { path: "/customer-connect" });
  cookies.set(VIDEO_CERDENTIAL, null);
  cookies.set(AES_KEY, "Aes");
};

export const removeAllCookies1 = () => {
  // cookies.remove(ACCESS_TOKEN);
  // cookies.remove(USER_ID);
  // cookies.remove(REFRESH_TOKEN);
  cookies.remove(ACCESS_TOKEN_TIME);
  cookies.remove(USER_ADMIN);
  // cookies.remove(USER_NAME);
  // cookies.remove(SESSON_USER);
  // cookies.remove(VIDEO_CERDENTIAL);
  // cookies.set(SESSON_USER, sessonUser);
};
