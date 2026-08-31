import { GET, ACCESS_TOKEN, POST } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_CREATE_CALL_FAILURE,
  GET_CREATE_CALL_SUCCESS,
  GET_CREATE_CALL_REQUEST,
  RESET_CREATE_CALL_SUCCESS,
  CANCEL_CALL_FAILURE,
  CANCEL_CALL_SUCCESS,
  CANCEL_CALL_REQUEST,
} from "./actionConstants";
import {
  createVideoCall,
  cancelVideoCall,
  customerVideoCall,
  uploadImageURL,
  getUserLocationURL,
  customerAddressURL,
} from "../comman/urls";
import { _getStorageValue, getAccessToken } from "../comman/localStorage";

const videoCallRequest = () => ({
  type: GET_CREATE_CALL_REQUEST,
});

const videoCallSuccess = (data) => ({
  type: GET_CREATE_CALL_SUCCESS,
  data,
});

const videoCallFailure = (data) => ({
  type: GET_CREATE_CALL_FAILURE,
  data,
});

const videoCallCancelRequest = () => ({
  type: CANCEL_CALL_REQUEST,
});

const videoCallCancelSuccess = (data) => ({
  type: CANCEL_CALL_SUCCESS,
  data,
});

const videoCallCancelFailure = (data) => ({
  type: CANCEL_CALL_FAILURE,
  data,
});

const videoCallReset = (data) => ({
  type: RESET_CREATE_CALL_SUCCESS,
  data,
});

export const getCallDetails =
  (userId, reqId, successResCall, failureResCall) => (dispatch) => {
    videoCallReset();
    dispatch(videoCallRequest());
    const url = customerVideoCall(userId, encodeURIComponent(reqId));
    const onSuccess = (response) => {
      successResCall(response);
      dispatch(videoCallSuccess(response));
    };

    const onFailure = (response) => {
      failureResCall(response);
      dispatch(videoCallFailure(response));
    };
    //  let token  ='eyJ0eXAiOiJKV1QiLCJhbGci/OiJSUzI1NiJ9.eyJpYXQiOjE2ODk2NjY3OTMsIm5iZiI6MTY4OTY2Njc5MywianRpIjoiZjU5OGU1NTctMDM2Mi00NTgzLTlhNzItMzg5NzQ2ZTIwNTNhIiwiZXhwIjoxNjg5NjY4NTkzLCJpZGVudGl0eSI6ImY2M2JlZGExLTdhNWEtMTFlYi1iM2M2LTAwMDAwMDAwMDAwMCIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyIsInVzZXJfY2xhaW1zIjp7ImlzQWRtaW4iOmZhbHNlLCJ1c2VyQWNjZXNzIjp7InByb3BlcnR5LWRhc2hib2FyZCI6eyJpc0FkbWluIjpmYWxzZX19fX0.lGmXapTCIxDIhko0f-O6JklmpupwFjPenm-jAKICv-fcidYOIcxdVRCy-FzBptBvgJwt7B_Dr0jbwzRDvm7WnMagDQRJJotygYcqnwvOT24pSpnrtNWWW2PmhOU9tVVFjlC3rl1dcsqXrJQqFUGO7GAfxp3y-dy105en7WUBDU9vzS2YtVRtxTdRxuCBYucVZayl93lOqBgirw3knlAjFTjKxJPjsJx_5h7S_oustAF4is6l8qhSjYlpaW7QOT-UTC-_5i0PhTfh-NGS42MoWirEK46S6ep9nS_VChZAed8SFzkhlwjgoVIExvmtkMAS3QABg4NL5O0bplWEV0AqcQ'
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
    //  getAccessToken
    //   apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
  };

  export const getCustomerAddress =
  (userId, lat,long, successResCall, failureResCall) => (dispatch) => {
    videoCallReset();
    dispatch(videoCallRequest());
    const url = customerAddressURL(userId, lat,long);
    const onSuccess = (response) => {
      successResCall(response);
      // dispatch(videoCallSuccess(response));
    };

    const onFailure = (response) => {
      failureResCall(response);
      dispatch(videoCallFailure(response));
    };
    //  let token  ='eyJ0eXAiOiJKV1QiLCJhbGci/OiJSUzI1NiJ9.eyJpYXQiOjE2ODk2NjY3OTMsIm5iZiI6MTY4OTY2Njc5MywianRpIjoiZjU5OGU1NTctMDM2Mi00NTgzLTlhNzItMzg5NzQ2ZTIwNTNhIiwiZXhwIjoxNjg5NjY4NTkzLCJpZGVudGl0eSI6ImY2M2JlZGExLTdhNWEtMTFlYi1iM2M2LTAwMDAwMDAwMDAwMCIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyIsInVzZXJfY2xhaW1zIjp7ImlzQWRtaW4iOmZhbHNlLCJ1c2VyQWNjZXNzIjp7InByb3BlcnR5LWRhc2hib2FyZCI6eyJpc0FkbWluIjpmYWxzZX19fX0.lGmXapTCIxDIhko0f-O6JklmpupwFjPenm-jAKICv-fcidYOIcxdVRCy-FzBptBvgJwt7B_Dr0jbwzRDvm7WnMagDQRJJotygYcqnwvOT24pSpnrtNWWW2PmhOU9tVVFjlC3rl1dcsqXrJQqFUGO7GAfxp3y-dy105en7WUBDU9vzS2YtVRtxTdRxuCBYucVZayl93lOqBgirw3knlAjFTjKxJPjsJx_5h7S_oustAF4is6l8qhSjYlpaW7QOT-UTC-_5i0PhTfh-NGS42MoWirEK46S6ep9nS_VChZAed8SFzkhlwjgoVIExvmtkMAS3QABg4NL5O0bplWEV0AqcQ'
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
   
  };

export const createCall =
  (userId, reqId, successResCall, failureResCall) => (dispatch) => {
    const url = createVideoCall(userId, reqId);
    const onSuccess = (response) => {
      successResCall(response);
      dispatch(videoCallSuccess(response));
    };

    const onFailure = (response) => {
      failureResCall(response);
      dispatch(videoCallFailure(response));
    };
    //  let token  ='eyJ0eXAiOiJKV1QiLCJhbGci/OiJSUzI1NiJ9.eyJpYXQiOjE2ODk2NjY3OTMsIm5iZiI6MTY4OTY2Njc5MywianRpIjoiZjU5OGU1NTctMDM2Mi00NTgzLTlhNzItMzg5NzQ2ZTIwNTNhIiwiZXhwIjoxNjg5NjY4NTkzLCJpZGVudGl0eSI6ImY2M2JlZGExLTdhNWEtMTFlYi1iM2M2LTAwMDAwMDAwMDAwMCIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyIsInVzZXJfY2xhaW1zIjp7ImlzQWRtaW4iOmZhbHNlLCJ1c2VyQWNjZXNzIjp7InByb3BlcnR5LWRhc2hib2FyZCI6eyJpc0FkbWluIjpmYWxzZX19fX0.lGmXapTCIxDIhko0f-O6JklmpupwFjPenm-jAKICv-fcidYOIcxdVRCy-FzBptBvgJwt7B_Dr0jbwzRDvm7WnMagDQRJJotygYcqnwvOT24pSpnrtNWWW2PmhOU9tVVFjlC3rl1dcsqXrJQqFUGO7GAfxp3y-dy105en7WUBDU9vzS2YtVRtxTdRxuCBYucVZayl93lOqBgirw3knlAjFTjKxJPjsJx_5h7S_oustAF4is6l8qhSjYlpaW7QOT-UTC-_5i0PhTfh-NGS42MoWirEK46S6ep9nS_VChZAed8SFzkhlwjgoVIExvmtkMAS3QABg4NL5O0bplWEV0AqcQ'
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
    //  getAccessToken
    //   apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
  };

export const cancelVideCall =
  (userId, reqId, successResCall, failureResCall) => (dispatch) => {
    videoCallReset();
    dispatch(videoCallCancelRequest());
    const url = cancelVideoCall(userId, reqId);
    const onSuccess = (response) => {
      successResCall();
      dispatch(videoCallCancelSuccess(response));
    };

    const onFailure = (response) => {
      failureResCall();
      dispatch(videoCallCancelFailure(response));
    };
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const imageuploadVideoKYC =
  (userId, reqId, data, successResCall, failureResCall) => (dispatch) => {
    // videoCallReset();
    // dispatch(videoCallCancelRequest());
    const url = uploadImageURL("app", "Rapid", userId, reqId);
    
    const onSuccess = (response) => {
      successResCall(response);
      // dispatch(videoCallCancelSuccess(response));
    };

    const onFailure = (response) => {
      failureResCall(response);
      // dispatch(videoCallCancelFailure(response));
    };
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(POST, url, data, onSuccess, onFailure, dispatch,token);
      }
    });
  };

export const getCustomerLatLong =
  (userId, reqId, successResCall, failureResCall) => (dispatch) => {
    // videoCallReset();
    // dispatch(videoCallCancelRequest());
    const url = getUserLocationURL(userId, reqId);
    const onSuccess = (response) => {
      successResCall(response);
    };

    const onFailure = (response) => {
      failureResCall(response);
    };
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };
