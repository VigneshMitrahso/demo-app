import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_JOIN_CALL_FAILURE,
  GET_JOIN_CALL_SUCCESS,
  GET_JOIN_CALL_REQUEST,
  RESET_JOIN_CALL_SUCCESS,
} from "./actionConstants";
import { joinVideoCall } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const videoCallRequest = () => ({
  type: GET_JOIN_CALL_REQUEST,
});

const videoCallSuccess = (data) => ({
  type: GET_JOIN_CALL_SUCCESS,
  data,
});

const videoCallFailure = (data) => ({
  type: GET_JOIN_CALL_FAILURE,
  data,
});

const videoCallReset = (data) => ({
  type: RESET_JOIN_CALL_SUCCESS,
  data,
});

export const joinCallDetails =
  (userId, reqId, successResCall, failureResCall) => (dispatch) => {
    videoCallReset();
    dispatch(videoCallRequest());

    const url = joinVideoCall(userId, encodeURIComponent(reqId));
    const onSuccess = (response) => {
      successResCall(response);
      dispatch(videoCallSuccess(response));
    };

    const onFailure = (response) => {
      failureResCall(response);
      dispatch(videoCallFailure(response));
    };

    let token =
      " eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2ODM2MDkwOTQsIm5iZiI6MTY4MzYwOTA5NCwianRpIjoiOGM3OWRmMGUtZWNkNy00YzBmLWJhMTUtYWNhMGM4Y2MyZmM0IiwiZXhwIjoxNjgzNjEwODk0LCJpZGVudGl0eSI6IjcyNGMzNTJjLTBiOTItNDVlNy04NjI0LTk3Y2EzNGQ1ZGYxZCIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyIsInVzZXJfY2xhaW1zIjp7ImlzQWRtaW4iOmZhbHNlLCJ1c2VyQWNjZXNzIjp7InByb3BlcnR5LWRhc2hib2FyZCI6eyJpc0FkbWluIjpmYWxzZX19fX0.X0_OmVYgwU_xwbdS5Sgv3IRA17ZaHKnLm5nlZkV0vdYvZQdLrPdx2_rVP2a11RXwbMfYIT4Wv1W7Hzntftvg4-_lHbsbAou_SC4HCzp39RdaB3V8IrDr36z2J9lN17XzZiYpm0ojF8KUCnb0NXo13qWCk55ydNmQUA6JwLeI1WhyZ4m2MirlwHeJiDIW-ii0foJDasbYeMr24GUPGr-g15OTy7rnrvaMOQDXx1-h5i44PViTKUIoe65eESim7VIMEXiuWbb3-A3I9WkNwBWTfoBF-UCcJNeQ3dvmf65j91LqPNczog35fhZMQxYJcxQS5Z5Ks9f3-ZkxfrVf6S-LIQ";
    apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
  };
