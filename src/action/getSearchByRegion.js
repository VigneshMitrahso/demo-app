import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_SEARCH_BY_REGION_FAILURE,
  GET_SEARCH_BY_REGION_SUCCESS,
  GET_SEARCH_BY_REGION_REQUEST,
  RESET_SEARCH_BY_REGION_SUCCESS,
} from "./actionConstants";
import { searchRegionUrl, searchReqUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const stateByRegionRequested = () => ({
  type: GET_SEARCH_BY_REGION_REQUEST,
});

const stateByRegionSuccess = (data) => ({
  type: GET_SEARCH_BY_REGION_SUCCESS,
  data,
});

const stateByRegionFailure = (data) => ({
  type: GET_SEARCH_BY_REGION_FAILURE,
  data,
});

const stateByRegionReset = () => ({
  type: RESET_SEARCH_BY_REGION_SUCCESS,
});

export const getStateByRegionUser =
  (
    userId,
    stateId,
    cityId,
    urls,
    onSuccessCallBackRegion,
    onFailureCallBackRegion,
  ) =>
  (dispatch) => {
    dispatch(stateByRegionRequested());

    const url = searchRegionUrl(userId, stateId, cityId, urls);

    const onSuccess = (response) => {
      dispatch(stateByRegionSuccess(response));
      onSuccessCallBackRegion(response);
    };

    const onFailure = (response) => {
      dispatch(stateByRegionFailure(response));
      onFailureCallBackRegion(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getByReq =
  (
    userId,
    cat,
    reqID,
    onSuccessCallBackRegion = () => {},
    onFailureCallBackRegion = () => {},
  ) =>
  (dispatch) => {
    dispatch(stateByRegionRequested());

    const url = searchReqUrl(userId, cat, reqID);

    const onSuccess = (response) => {
      dispatch(stateByRegionSuccess(response));
      onSuccessCallBackRegion(response);
    };

    const onFailure = (response) => {
      dispatch(stateByRegionFailure(response));
      onFailureCallBackRegion(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetStateByRegionUSer = () => (dispatch) => {
  dispatch(stateByRegionRequested());
  dispatch(stateByRegionReset());
};
