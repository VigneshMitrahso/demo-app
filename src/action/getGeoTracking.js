import {
  FAILED_GET_GEO_LOCATIONS,
  SUCCESS_GET_GEO_LOCATIONS,
  REQUEST_GET_GEO_LOCATIONS,
  REQUEST_GET_AGENT_DATA,
  FAILED_GET_AGENT_DATA,
  SUCCESS_GET_AGENT_DATA,
  SET_EMPTY_LOCATION,
} from "./actionConstants";
import {
  getLocationURL,
  getAgentGeoData,
  getTimelineURL,
} from "../comman/urls";
import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import { _getStorageValue } from "../comman/localStorage";

const requestGeoTrackingBank = () => ({
  type: REQUEST_GET_GEO_LOCATIONS,
});

export const setEmptyLocation = () => ({
  type: SET_EMPTY_LOCATION,
});
const successGeoTrackingBank = (record) => ({
  type: SUCCESS_GET_GEO_LOCATIONS,
  record,
});
const failGeoTrackingBank = (response) => ({
  type: FAILED_GET_GEO_LOCATIONS,
  response,
});
const requestAgentData = () => ({
  type: REQUEST_GET_AGENT_DATA,
});
const successAgentData = (record) => ({
  type: SUCCESS_GET_AGENT_DATA,
  record,
});
const failAgentData = (response) => ({
  type: FAILED_GET_AGENT_DATA,
  response,
});
// getTimelineURL
export const getGeoTimeLine =
  (user, timeline, timelineFilter) => (dispatch) => {
    dispatch(requestGeoTrackingBank());
    const onSuccess = (response) => {
      dispatch(successGeoTrackingBank(response));
    };

    const onFailure = (response) => {
      dispatch(failGeoTrackingBank(response));
    };

    const url = getTimelineURL(user, timeline, timelineFilter);
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token != undefined && token != null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };
// http://localhost:5050/skies/v1/user/f63beda1-7a5a-11eb-b3c6-000000000000/
// bank-user-location?start-date=2022-01-24&end-date=2022-01-26
export const getGeoLocations =
  (user, startDateG, endDateG, filter) => (dispatch) => {
    dispatch(requestGeoTrackingBank());
    const onSuccess = (response) => {
      dispatch(successGeoTrackingBank(response));
    };

    const onFailure = (response) => {
      dispatch(failGeoTrackingBank(response));
    };

    const url = getLocationURL(user, startDateG, endDateG, filter);
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token != undefined && token != null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getAgentData =
  (
    user,
    agentID,
    agentTimeLine,
    agentidStart,
    agentidEnd,
    successAgCallBack,
    failureAgCallBack,
  ) =>
  (dispatch) => {
    dispatch(requestAgentData());
    const onSuccess = (response) => {
      dispatch(successAgentData(response));
      successAgCallBack(response);
    };

    const onFailure = (response) => {
      dispatch(failAgentData(response));
      failureAgCallBack(response);
    };

    const url = getAgentGeoData(
      user,
      agentID,
      agentTimeLine,
      agentidStart,
      agentidEnd,
    );
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token != undefined && token != null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };
