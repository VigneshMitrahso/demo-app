import {
  REQUEST_GET_VOICE_RECORD,
  FAILED_GET_VOICE_RECORD,
  SUCCESS_GET_VOICE_RECORD,
} from "./actionConstants";
import { recordingGetURL } from "../comman/urls";
import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import { _getStorageValue } from "../comman/localStorage";

const requestGetRecord = () => ({
  type: REQUEST_GET_VOICE_RECORD,
});
const successGetRecord = (record) => ({
  type: SUCCESS_GET_VOICE_RECORD,
  record,
});
const failGetRecord = (response) => ({
  type: FAILED_GET_VOICE_RECORD,
  response,
});

export const getRecordedFile =
  (user, reqID, propertyType, unitType) => (dispatch) => {
    dispatch(requestGetRecord());
    const onSuccess = (response) => {
      dispatch(successGetRecord(response));
    };

    const onFailure = (response) => {
      dispatch(failGetRecord(response));
    };

    const url = recordingGetURL(
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
