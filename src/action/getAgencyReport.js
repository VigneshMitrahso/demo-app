import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_AGENCY_REPORT_FAILURE,
  GET_AGENCY_REPORT_SUCCESS,
  GET_AGENCY_REPORT_REQUEST,
  RESET_AGENCY_REPORT_SUCCESS,
} from "./actionConstants";
import { getAgencyReportUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const agencyReportRequested = () => ({
  type: GET_AGENCY_REPORT_REQUEST,
});

const agencyReportSuccess = (data) => ({
  type: GET_AGENCY_REPORT_SUCCESS,
  data,
});

const agencyReportFailure = (data) => ({
  type: GET_AGENCY_REPORT_FAILURE,
  data,
});

const agencyReportReset = (data) => ({
  type: RESET_AGENCY_REPORT_SUCCESS,
  data,
});

export const getAgencyReport = (userId, agencyID, reportDate) => (dispatch) => {
  dispatch(agencyReportRequested());

  const url = getAgencyReportUrl(userId, agencyID, reportDate);

  const onSuccess = (response) => {
    dispatch(agencyReportSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(agencyReportFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetAgencyReport = () => (dispatch) => {
  dispatch(agencyReportReset());
};
