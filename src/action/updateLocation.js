// constant
import { ACCESS_TOKEN, POST } from "../comman/constants";

// api call
import { apiCall } from "../comman/connect";

// action constant
import {
  LOCATION_UPDATE_FAILURE,
  LOCATION_UPDATE_SUCCESS,
  LOCATION_UPDATE_REQUEST,
} from "./actionConstants";

// url
import { updateLocationURL } from "../comman/urls";

// function
import { _getStorageValue } from "../comman/localStorage";

const locationRequested = () => ({
  type: LOCATION_UPDATE_REQUEST,
});

const locationSuccess = (data) => ({
  type: LOCATION_UPDATE_SUCCESS,
  data,
});

const locationFailure = (data) => ({
  type: LOCATION_UPDATE_FAILURE,
  data,
});

export const updateLocation =
  (userID, reqID, lat, lng, suucess, failure) => (dispatch) => {
    dispatch(locationRequested());
    const onSuccess = (response) => {
      if (response.status) {
        console.log("response11", response);
        // dispatch(locationSuccess(response));
        suucess(response);
      } else {
        onFailure();
        failure();
      }
    };

    const onFailure = (response) => {
      dispatch(locationFailure(response));
      failure();
    };

    const url = updateLocationURL(userID, encodeURIComponent(reqID), lat, lng);

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token != undefined && token != null) {
        apiCall(POST, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };
