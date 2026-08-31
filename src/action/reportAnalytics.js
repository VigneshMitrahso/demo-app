import { GET } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_REPORT_YEAR_FAILURE,
  GET_REPORT_YEAR_SUCCESS,
  GET_REPORT_YEAR_REQUEST,
  GET_ANALATICS_REPORT_REQUEST,
  GET_ANALATICS_REPORT_SUCCESS,
  GET_ANALATICS_REPORT_FAILURE,
  GET_STATE_BY_CITY_REQUEST,
  GET_STATE_BY_CITY_SUCCESS,
  GET_STATE_BY_CTY_FAILURE,
  GET_BRANCH_REPORT_DATA_REQUEST,
  GET_BRANCH_REPORT_DATA_SUCCESS,
  GET_BRANCH_REPORT_DATA_FAILURE,
  GET_AGENCY_REPORT_DATA_REQUEST,
  GET_AGENCY_REPORT_DATA_SUCCESS,
  GET_AGENCY_REPORT_DATA_FAILURE,
  GET_ANALYTICS_DATA_FROM_CITY,
  GET_AGENCY_BRANCH_COUNT,
  GET_AGENCY_BRANCH_COUNT_FAILURE,
} from "./actionConstants";
import {
  getReportYearUrl,
  getBranchAgencyAnalyticsReportUrl,
  getAgencyContactDataUrl,
  getBranchContactDataUrl,
  getBranchAgencyUrl,
  getStateByCityZoneUrl,
  getTotalCountUrl,
} from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";
import { ACCESS_TOKEN } from "../comman/constants";
import { getAgencyReport } from "./getAgencyReport";

const getReportYearRequest = () => ({
  type: GET_REPORT_YEAR_REQUEST,
});

const getReportYearSuccess = (data) => ({
  type: GET_REPORT_YEAR_SUCCESS,
  data,
});

const getReportYearFailiur = (data) => ({
  type: GET_REPORT_YEAR_FAILURE,
  data,
});

export const getReportYear = (userId, property_type) => (dispatch) => {
  dispatch(getReportYearRequest());

  const url = getReportYearUrl(userId, property_type);

  const onSuccess = (response) => {
    dispatch(getReportYearSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(getReportYearFailiur(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

const getAnalyticsReportRequest = () => ({
  type: GET_ANALATICS_REPORT_REQUEST,
});

const getAnalyticsReportSuccess = (data) => ({
  type: GET_ANALATICS_REPORT_SUCCESS,
  data,
});

const getAnalyticsReportFailiur = (data) => ({
  type: GET_ANALATICS_REPORT_FAILURE,
  data,
});

export const getAnalyticsReport =
  (userId, property_type, aggrigation, timeLine, year) => (dispatch) => {
    dispatch(getAnalyticsReportRequest());
    const url = getBranchAgencyAnalyticsReportUrl(
      userId,
      property_type,
      aggrigation,
      timeLine,
      year,
    );

    const onSuccess = (response) => {
      dispatch(getAnalyticsReportSuccess(response));
    };

    const onFailure = (response) => {
      dispatch(getAnalyticsReportFailiur(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

const getStateByCityRequest = () => ({
  type: GET_STATE_BY_CITY_REQUEST,
});

const getStateByCitySuccess = (data) => ({
  type: GET_STATE_BY_CITY_SUCCESS,
  data,
});

const getStateByCityFailiur = (data) => ({
  type: GET_STATE_BY_CTY_FAILURE,
  data,
});

export const getStateRequestReport =
  (userId, property_type, aggrigation, timeLine, year, aggregation_name) =>
  (dispatch) => {
    dispatch(getStateByCityRequest());

    const url = getStateByCityZoneUrl(
      userId,
      property_type,
      aggrigation,
      timeLine,
      year,
      aggregation_name,
    );

    const onSuccess = (response) => {
      dispatch(getStateByCitySuccess(response));
    };

    const onFailure = (response) => {
      dispatch(getStateByCityFailiur(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

const getBranchRequest = () => ({
  type: GET_STATE_BY_CITY_REQUEST,
});

const getBranchSuccess = (data) => ({
  type: GET_STATE_BY_CITY_SUCCESS,
  data,
});

const getBranchFailiur = (data) => ({
  type: GET_STATE_BY_CTY_FAILURE,
  data,
});

const getBranchReportDataRequest = (data) => ({
  type: GET_BRANCH_REPORT_DATA_REQUEST,
});
const getBranchReportDataSuccess = (data) => ({
  type: GET_BRANCH_REPORT_DATA_SUCCESS,
  data,
});
const getBranchReportDataFailure = (data) => ({
  type: GET_BRANCH_REPORT_DATA_FAILURE,
  data,
});

const getAgencyReportDataRequest = (data) => ({
  type: GET_AGENCY_REPORT_DATA_REQUEST,
});
const getAgencyReportDataSuccess = (data) => ({
  type: GET_AGENCY_REPORT_DATA_SUCCESS,
  data,
});
const getAgencyReportDataFailure = (data) => ({
  type: GET_AGENCY_REPORT_DATA_FAILURE,
  data,
});

const getAnalyticsDataFromCity = (data) => ({
  type: GET_ANALYTICS_DATA_FROM_CITY,
  data,
});

const getAgencyBranchCount = (data) => ({
  type: GET_AGENCY_BRANCH_COUNT,
  data,
});
const getAgencyBranchCountFailure = (data) => ({
  type: GET_AGENCY_BRANCH_COUNT_FAILURE,
  data,
});

export const getBranchAgencyRequestReport =
  (userId, property_type, aggrigation, timeLine, year, aggregation_name) =>
  (dispatch) => {
    dispatch(getBranchRequest());

    const url = getBranchAgencyUrl(
      userId,
      property_type,
      aggrigation,
      timeLine,
      year,
      aggregation_name,
    );

    const onSuccess = (response) => {
      dispatch(getBranchSuccess(response));
    };

    const onFailure = (response) => {
      dispatch(getBranchFailiur(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getBranchContactData =
  (userId, branchcode, timeLine, year) => (dispatch) => {
    dispatch(getBranchReportDataRequest());
    const url = getBranchContactDataUrl(userId, branchcode, timeLine, year);
    const onSuccess = (response) => {
      dispatch(getBranchReportDataSuccess(response));
    };
    const onFailure = (response) => {
      dispatch(getBranchReportDataFailure(response));
    };
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getAgencyContactData =
  (userId, agencyId, timeLine, year) => (dispatch) => {
    dispatch(getAgencyReportDataRequest());
    const url = getAgencyContactDataUrl(userId, agencyId, timeLine, year);
    const onSuccess = (response) => {
      dispatch(getAgencyReportDataSuccess(response));
    };
    const onFailure = (response) => {
      dispatch(getAgencyReportDataFailure(response));
    };
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getTotalAgencyBranchCount =
  (userId, propertyType, aggregation, timeLine, year) => (dispatch) => {
    const url = getTotalCountUrl(
      userId,
      propertyType,
      aggregation,
      timeLine,
      year,
    );
    const onSuccess = (response) => {
      dispatch(getAgencyBranchCount(response));
    };
    const onFailure = (response) => {
      dispatch(getAgencyBranchCountFailure(response));
    };
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (!!token && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

// export const getAnalyticsFromCity = (userId) => (dispatch) =>{
//   const url = getAnalyticsFromCityUrl(userId);
//
//   const onSuccess = (response) => {
//     dispatch(getAnalyticsDataFromCity(response));
//   }

//   const onFailure = (response) =>{

//   }

//   _getStorageValue(ACCESS_TOKEN).then((token) => {
//     if(!!token && token !== null){
//       apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
//     }
//   })
// }
