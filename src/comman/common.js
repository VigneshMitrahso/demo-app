// helper login
import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";
import moment from "moment";
import { REFERSH_URL, SESSON_REFERSH_URL } from "./urls";
import { POST } from "./constants";
import { refreshAccessToken } from "./connect";
import {
  getUserId,
  getUserIdRapid,
  getAccessToken,
  getRefreshToken,
  removeAllCookies,
  setAccessToken,
  setUserId,
  setUserName,
  setRefreshToken,
  setAccessTokenTime,
  getSessonUser,
  getUserAdmin,
} from "./localStorage";

export const userLoggedIn = () => {
  if (getUserId()) {
    return true;
  } else {
    return false;
  }
};

export const isAdmin = () => {
  if (getUserAdmin()) {
    return true;
  } else {
    return false;
  }
};

export const rapidLoggedIn = () => {
  if (getUserIdRapid()) {
    return true;
  } else {
    return false;
  }
};
// export const callback = () => {
//   try {
//     setInterval(async () => {
//       var urls = getSessonUser();

//         var access = jwt_decode(getAccessToken());
//         if (access.exp <= Math.round(new Date().getTime() / 1000)) {

//           var urls = getSessonUser();
//           if(urls) {
//             var url = SESSON_REFERSH_URL
//           } else {
//             var url = REFERSH_URL
//           }

//           refreshAccessToken(POST, url, getRefreshToken()).then(
//             (respones) => {
//               if (respones.status) {
//                 setAccessToken(respones.data.accessToken);
//                 setUserId(respones.data.userId);
//                 setRefreshToken(respones.data.refreshToken);
//                 setUserName(respones.data.userName);
//                 setAccessTokenTime(moment().format("YYYY-MM-DD HH:mm:ss"));
//               } else {
//                 removeAllCookies();
//                 window.location.reload();

//               }
//             }
//           );
//         }
//     }, 1000);
//   } catch (e) {
//     console.log(e);
//   }
// };

const cookies = new Cookies();

// export async function _getStorageValue(storageKey) {
//   if (storageKey === "ACCESS_TOKEN") {
//     var refresh = jwt_decode(getRefreshToken());
//     if (refresh.exp <= Math.round(new Date().getTime() / 1000)) {
//       removeAllCookies();
//       window.location.reload();
//     } else {
//       var access = jwt_decode(getAccessToken());
//       if (access.exp <= Math.round(new Date().getTime() / 1000)) {
//         refreshAccessToken(POST, REFERSH_URL, getRefreshToken()).then(
//           (respones) => {
//             if (respones.status === false) {
//               removeAllCookies();
//               window.location.reload();
//             } else {
//               var accessToken = respones.data.accessToken;
//               setAccessToken(respones.data.accessToken);
//               setUserId(respones.data.userId);
//               setRefreshToken(respones.data.refreshToken);
//               setUserName(respones.data.userName);
//               setAccessTokenTime(moment().format("YYYY-MM-DD HH:mm:ss"));
//               return cookies.get(accessToken);
//             }
//           }
//         );
//       } else {
//         return cookies.get(storageKey);
//       }
//     }
//   }

//   return cookies.get(storageKey);
// }
