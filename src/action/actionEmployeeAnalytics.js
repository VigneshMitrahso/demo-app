import { GET, POST } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_EMPLOYEE_ANALYTIC_REQUEST,
  GET_EMPLOYEE_ANALYTIC_SUCCESS,
  GET_EMPLOYEE_ANALYTIC_FAILURE,
  GET_EMPLOYEE_ANALYTIC_DETAILS_FAILURE,
  GET_EMPLOYEE_ANALYTIC_DETAILS_SUCCESS,
  GET_EMPLOYEE_ANALYTIC_DETAILS_REQUEST,
} from "./actionConstants";
import {
  advariskListurl,
  avmReportListUrl,
  employeeAnalyticDetailsUrl,
  employeeAnalyticsurl,
  exportEmployeeAnalyticsurl,
  reportAnalyticsurl,
  saveAdvariskUrl,
  advariskDetailUrl,
  getAdvariskStatsUrl,
  getAdvariskDistrictUrl,
  getAdvariskPincodeUrl,
  getAdvariskAggr,
} from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";
import { ACCESS_TOKEN } from "../comman/constants";
import axios from "axios";
import { toast } from "react-toastify";

const getEmployeeAnalyticRequest = () => ({
  type: GET_EMPLOYEE_ANALYTIC_REQUEST,
});

const getEmployeeAnalyticSuccess = (data) => ({
  type: GET_EMPLOYEE_ANALYTIC_SUCCESS,
  data,
});

const getEmployeeAnalyticFailiur = (data) => ({
  type: GET_EMPLOYEE_ANALYTIC_FAILURE,
  data,
});

export const getEmployeeAnalytic =
  (
    userId,
    screen,
    state,
    city,
    startDate,
    endDate,
    sucessCallback = () => {},
    failurCallback = () => {},
  ) =>
  (dispatch) => {
    dispatch(getEmployeeAnalyticRequest());

    const url = employeeAnalyticsurl(
      userId,
      screen,
      state,
      city,
      startDate,
      endDate,
    );

    const onSuccess = (response) => {
      dispatch(getEmployeeAnalyticSuccess(response));
      sucessCallback(response.data?.total_employess_added || null);
    };

    const onFailure = (response) => {
      dispatch(getEmployeeAnalyticFailiur(response));
      failurCallback(false);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getAdvariskData =
  (userId, pageNumber, sucessCallback = () => {}, failurCallback = () => {}) =>
  (dispatch) => {
    const url = advariskListurl(userId, pageNumber);

    const onSuccess = (response) => {
      sucessCallback(response);
    };

    const onFailure = (response) => {
      failurCallback(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getAvmReportData =
  (userId, pageNumber,search, sucessCallback = () => {}, failurCallback = () => {}) =>
  (dispatch) => {
    const url = avmReportListUrl(userId, pageNumber,search);

    const onSuccess = (response) => {
      sucessCallback(response);
    };

    const onFailure = (response) => {
      failurCallback(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getAdvariskAggrData =
  (userId, setTableData, loding) => (dispatch) => {
    loding(true);

    const url = getAdvariskAggr(userId);

    const onSuccess = (response) => {
      setTableData(response.data);
      loding(false);
    };
    const onFailure = (response) => {
      toast.error(response?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      loding(false);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getAdvariskDetail =
  (userId, orderId, sucessCallback = () => {}, failurCallback = () => {}) =>
  (dispatch) => {
    const url = advariskDetailUrl(userId, orderId);

    const onSuccess = (response) => {
      sucessCallback(response);
    };

    const onFailure = (response) => {
      failurCallback(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const saveAdvariskData =
  (userId, data, sucessCallback = () => {}, failurCallback = () => {}) =>
  (dispatch) => {
    const url = saveAdvariskUrl(userId);

    const onSuccess = (response) => {
      sucessCallback(response);
    };

    const onFailure = (response) => {
      failurCallback(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(POST, url, data, onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getAdvariskStateData =
  (userId, sucessCallback = () => {}, failurCallback = () => {}) =>
  (dispatch) => {
    const url = getAdvariskStatsUrl(userId);

    const onSuccess = (response) => {
      sucessCallback(response);
    };

    const onFailure = (response) => {
      failurCallback(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

//{{baseUrl}}/avm/:user_id/get_advarisk_region?state_name=Andhra Pradesh&query_type=district

export const getAdvariskDistrictData =
  (userId, state, sucessCallback = () => {}, failurCallback = () => {}) =>
  (dispatch) => {
    const url = getAdvariskDistrictUrl(userId, state);

    const onSuccess = (response) => {
      sucessCallback(response);
    };

    const onFailure = (response) => {
      failurCallback(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

// pincode

export const getAdvariskpincode =
  (
    userId,
    state,
    district,
    sucessCallback = () => {},
    failurCallback = () => {},
  ) =>
  (dispatch) => {
    const url = getAdvariskPincodeUrl(userId, state, district);

    const onSuccess = (response) => {
      sucessCallback(response);
    };

    const onFailure = (response) => {
      failurCallback(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getReportAnalytics =
  (
    userId,
    startDate,
    endDate,
    empId,
    module,
    sucessCallback = () => {},
    failurCallback = () => {},
  ) =>
  (dispatch) => {
    // dispatch(getEmployeeAnalyticRequest());

    const url = reportAnalyticsurl(userId, startDate, endDate, empId, module);

    const onSuccess = (response) => {
      // dispatch(getEmployeeAnalyticSuccess(response));
      sucessCallback(response.data || null);
    };

    const onFailure = (response) => {
      // dispatch(getEmployeeAnalyticFailiur(response));
      failurCallback(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

const getEmployeeDetailsDataRequest = () => ({
  type: GET_EMPLOYEE_ANALYTIC_DETAILS_REQUEST,
});

const getEmployeeDetailsDataSuccess = (data) => ({
  type: GET_EMPLOYEE_ANALYTIC_DETAILS_SUCCESS,
  data,
});

const getEmployeeDetailsDataFailiur = (data) => ({
  type: GET_EMPLOYEE_ANALYTIC_DETAILS_FAILURE,
  data,
});

export const getEmployeeDetailsData =
  (userId, empId, callback) => (dispatch) => {
    dispatch(getEmployeeDetailsDataRequest());

    const url = employeeAnalyticDetailsUrl(userId, empId);

    const onSuccess = (response) => {
      dispatch(getEmployeeDetailsDataSuccess(response));
      callback(response);
    };

    const onFailure = (response) => {
      dispatch(getEmployeeDetailsDataFailiur(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const exportEmployeeAnalytic =
  (userId, screen, state, city, startDate, endDate) => (dispatch) => {
    const urlString = exportEmployeeAnalyticsurl(
      userId,
      screen,
      state,
      city,
      startDate,
      endDate,
    );

    _getStorageValue(ACCESS_TOKEN).then(async (token) => {
      if (token !== undefined && token !== null) {
        const response = await axios.get(urlString, {
          headers: {
            authorization: token,
          },
          responseType: "blob", // Important for binary data like PDFs
        });
        const blob = new Blob([response.data], { type: "application/xlsx" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `employee${new Date()}.xlsx`;
        a.click();
      }
    });
  };
