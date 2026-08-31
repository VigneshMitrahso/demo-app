import {
  REQUEST_GET_VIDEO_RECORD,
  FAILED_GET_VIDEO_RECORD,
  SUCCESS_GET_VIDEO_RECORD,
} from "./actionConstants";
import { videoRecordingGetURL } from "../comman/urls";
import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import { _getStorageValue } from "../comman/localStorage";

const requestGetVideoRecord = () => ({
  type: REQUEST_GET_VIDEO_RECORD,
});
const successGetVideoRecord = (record) => ({
  type: SUCCESS_GET_VIDEO_RECORD,
  record,
});
const failGetVideoRecord = (response) => ({
  type: FAILED_GET_VIDEO_RECORD,
  response,
});

export const getVideoRecordedFile =
  (user, reqID, propertyType, unitType) => (dispatch) => {
    dispatch(requestGetVideoRecord());
    const onSuccess = (response) => {
      dispatch(successGetVideoRecord(response));
    };

    const onFailure = (response) => {
      dispatch(failGetVideoRecord(response));
    };

    const url = videoRecordingGetURL(
      user,
      encodeURIComponent(reqID),
      propertyType,
      unitType,
    );
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token != undefined && token != null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };
