import { errorReportUrl } from "../comman/urls";
import Platform from "react-platform-js";
import { CONTENT_TYPE_JSON, POST } from "./constants";
import { getUserId } from "./localStorage";
const header = {
  "Content-Type": CONTENT_TYPE_JSON,
  accept: CONTENT_TYPE_JSON,
  "Access-Control-Allow-Headers": "Content-Type",
  "access-control-allow-credentials": true,
  "Access-Control-Allow-Methods": "POST, GET,DELETE",
  "Access-Control-Request-Method": "POST, GET,DELETE",
  "Access-Control-Request-Headers": "POST, GET,DELETE",
};

export function apiCall(
  requestMethod,
  url,
  data,
  onSuccess,
  onFailure,
  dispatch,
  accessToken = null,
  accept = "application/json",
) {
  // TODO: Create a middle ware to handle to refresh token scenario
  if (accessToken != null) {
    header["Authorization"] = accessToken;
    header["Accept"] = accept;
  }

  var formData = {
    method: requestMethod,
    headers: header,
  };

  var formBody = JSON.stringify(data);

  if (data !== undefined && data !== "") {
    formData["body"] = formBody;
  }
  fetch(url, formData, 500)
    .then((response) => {
      // TODO: Need to create all API fallbacks.
      // if (response.status === 401) {
      //   removeAllCookies();
      //   window.location.reload();
      // } else
      response
        .json()
        .then((responseJson) => {
          console.log("responseJson", responseJson);
          if (responseJson.status) {
            onSuccess(responseJson);
          } else {
            onFailure(responseJson);
            logErrors(url, responseJson, accessToken, formBody);
          }
        })
        .catch((err) => {
          console.log("responseJson-err", err);
          logErrors(url, err, accessToken, formBody);
          onFailure(err);
        });
    })
    .catch((error) => {
      console.log("responseJson-error", error);
      logErrors(url, error, accessToken, formBody);
      onFailure(error);
    });
}

// video call

export function apiVideoCall(
  requestMethod,
  url,
  data,
  onSuccess,
  onFailure,
  dispatch,
  accessToken = null,
) {
  // TODO: Create a middle ware to handle to refresh token scenario
  if (accessToken != null) {
    header["Authorization"] = accessToken;
  }

  var formData = {
    method: requestMethod,
    headers: header,
  };

  var formBody = JSON.stringify(data);

  if (data !== undefined && data !== "") {
    formData["body"] = formBody;
  }

  fetch(url, formData)
    .then((response) => {
      // TODO: Need to create all API fallbacks.
      // if (response.status === 401) {
      //   removeAllCookies();
      //   window.location.reload();
      // } else
      response
        .json()
        .then((responseJson) => {
          if (responseJson.status) {
            onSuccess(responseJson);
          } else {
            onFailure(responseJson);
            logErrors(url, responseJson, accessToken, formBody);
          }
        })
        .catch((err) => {
          onFailure(err);
          logErrors(url, err, accessToken, formBody);
        });
    })
    .catch((error) => {
      onFailure(error);
      logErrors(url, error, accessToken, formBody);
    });
}

// refresh token
export async function refreshAccessToken(requestMethod, url, refreshToken) {
  header["Authorization"] = refreshToken;

  var formData = {
    method: requestMethod,
    headers: header,
  };

  // var requestJson = JSON.stringify({
  //   request: "Requested to update access token",
  // });

  return await fetch(url, formData, 500)
    .then((response) => {
      return response
        .json()
        .then((responseJson) => {
          return responseJson;
        })
        .catch((error) => {
          // logErrors(error, refreshToken, requestJson);
        });
    })
    .catch((error) => {
      // logErrors(error, refreshToken, requestJson);
    });
}

// errorReportUrl

export async function logErrors(urlEndPoint, response, accessToken, formBody) {
  var errorDetails = {
    endpoint: urlEndPoint,
    error: response.message,
    "user-id": getUserId(),
    device_info: {
      fe_type: Platform.Browser,
      os_info: Platform.OS,
      os_version: Platform.OSVersion,
      browser_info: Platform.Engine,
      other_details: formBody,
    },
  };

  if (accessToken != null) {
    header["Authorization"] = accessToken;
  }

  var formData = {
    method: POST,
    headers: header,
  };

  if (errorDetails != undefined && errorDetails != "") {
    formData["body"] = JSON.stringify(errorDetails);
  }

  // _getStorageValue('USER_ID').then(userId => {
  //   if (userId != undefined && userId != null) {
  var url = errorReportUrl();

  fetch(url, formData)
    .then((response) => {
      response
        .json()
        .then((responseJson) => {
          if (responseJson.status) {
            console.log("Error logged successfully");
          } else {
            console.log("Failure logging error: ", responseJson);
          }
        })
        .catch((err) => {
          console.log("Caught error: ", err);
        });
    })
    .catch((err) => {
      console.log("Caught error: ", err);
    });
  //   }
  // });
}
