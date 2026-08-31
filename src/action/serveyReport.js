import { GET, POST, USER_ID } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_SERVEY_REQUEST,
  GET_SERVEY_SUCCESS,
  GET_SERVEY_FAILURE,
  GET_SERVEY_REPORT_FAILURE,
  GET_SERVEY_REPORT_SUCCESS,
  GET_SERVEY_REPORT_REQUEST,
  GET_SERVEY_REPORTS_FAILURE,
  GET_SERVEY_REPORTS_SUCCESS,
  GET_SERVEY_REPORTS_REQUEST,
} from "./actionConstants";
import {
  serveyReportUrl,
  serveyReportDataUrl,
  serveyReportRequestUrl,
  serveyReportCoverageRequestUrl,
  getVendorStateUrl,
  getVendorCityUrl,
  getVendorListUrl,
  getMapMyindia,
  getVendorAgencyListUrl,
  getAnalyticalListUrl,
  surveyReportUserUrl,
} from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";
import { ACCESS_TOKEN } from "../comman/constants";
import { toast } from "react-toastify";

const getServeyRequest = () => ({
  type: GET_SERVEY_REQUEST,
});

const getServeyYearSuccess = (data) => ({
  type: GET_SERVEY_SUCCESS,
  data,
});

const getServeyYearFailiur = (data) => ({
  type: GET_SERVEY_FAILURE,
  data,
});

export const getServeyReport =
  (
    userId,
    screen,
    state,
    city,
    sucessCallback = () => {},
    failurCallback = () => {},
  ) =>
  (dispatch) => {
    dispatch(getServeyRequest());

    const url = serveyReportUrl(userId, screen, state, city);

    const onSuccess = (response) => {
      dispatch(getServeyYearSuccess(response));
      sucessCallback(false);
    };

    const onFailure = (response) => {
      dispatch(getServeyYearFailiur(response));
      failurCallback(false);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

  export const getSurveyUserReport =
  (
    userId,
    sucessCallback = () => {},
    failurCallback = () => {},
  ) =>
  (dispatch) => {
    dispatch(getServeyRequest());

    const url = surveyReportUserUrl(userId);

    const onSuccess = (response) => {
      dispatch(getServeyYearSuccess(response));
      sucessCallback(false);
    };

    const onFailure = (response) => {
      dispatch(getServeyYearFailiur(response));
      failurCallback(false);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

const getServeyReportRequest = () => ({
  type: GET_SERVEY_REPORT_REQUEST,
});

const getServeyReportSuccess = (data) => ({
  type: GET_SERVEY_REPORT_SUCCESS,
  data,
});

const getServeyReportFailiur = (data) => ({
  type: GET_SERVEY_REPORT_FAILURE,
  data,
});

export const getServeyReportData = (userId, reqid) => (dispatch) => {
  dispatch(getServeyReportRequest());

  const url = serveyReportDataUrl(userId, reqid);

  const onSuccess = (response) => {
    dispatch(getServeyReportSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(getServeyReportFailiur(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

const getServeyReport_Request = () => ({
  type: GET_SERVEY_REPORTS_REQUEST,
});

const getServeyRequestSuccess = (data) => ({
  type: GET_SERVEY_REPORTS_SUCCESS,
  data,
});

const getServeyYearRequestFailure = (data) => ({
  type: GET_SERVEY_REPORTS_FAILURE,
  data,
});

export const getServeyRequestReport =
  (userId, data, screen, state, city, updateLat, updateLong) => (dispatch) => {
    dispatch(getServeyReport_Request());

    const url = serveyReportRequestUrl(userId);

    const onSuccess = (response) => {
      setTimeout(() => {
        toast.success(
          response?.data?.details,
          {
            position: toast.POSITION.BOTTOM_CENTER,
          },
          100,
        );
        updateLat("");
        updateLong("");
        dispatch(getServeyRequestSuccess(response));
        _getStorageValue(USER_ID).then((id) => {
          dispatch(getServeyReport(id, screen, state, city));
        });
      }, 3000);
    };

    const onFailure = (response) => {
      toast.error(response?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      updateLat("");
      updateLong("");
      dispatch(getServeyYearRequestFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(POST, url, data, onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const getServeyReportCoverage =
  (userId, setTableData, loding) => (dispatch) => {
    loding(true);

    const url = serveyReportCoverageRequestUrl(userId);

    const onSuccess = (response) => {
      setTableData(response.data);
      loding(false);

      // toast.error(response?.message, {
      //   position: toast.POSITION.BOTTOM_CENTER,
      // });
      // dispatch(getServeyReport());
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



  export const getVendorStateList =
  (userId, success,failiure ) => (dispatch) => {

    const url = getVendorStateUrl(userId);

    const onSuccess = (response) => {
      success(response.data);
    };

    const onFailure = (response) => {
      toast.error(response?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };


  export const getVendorCityList =
  (userId,state, success,failiure ) => (dispatch) => {

    const url = getVendorCityUrl(userId,state);

    const onSuccess = (response) => {
      success(response.data);
    };

    const onFailure = (response) => {
      toast.error(response?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };


  export const getVendorAgencyList =
  (userId,state, city, success ) => (dispatch) => {

    const url = getVendorAgencyListUrl(userId,state, city);

    const onSuccess = (response) => {
      success(response.data);
    };

    const onFailure = (response) => {
      toast.error(response?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };



  export const getVendorList =
  (userId,state, city,agencyName,success ) => (dispatch) => {

    const url = getVendorListUrl(userId,state, city,agencyName);

    const onSuccess = (response) => {
      success(response.data);
    };

    const onFailure = (response) => {
      toast.error(response?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };


  export const mapMyIndiaToken = (userId,success ) => (dispatch) => {
    const url = getMapMyindia(userId);
    
    const onSuccess = (response) => {
      success(response.data);
    };
    const onFailure = (response) => {
      toast.error(response?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    };
    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

  export const getAnalyticsList = (userId,queryString,success,setTableData ) => (dispatch) => {
    const url = getAnalyticalListUrl(userId,queryString);
    
    const onSuccess = (response) => {
      success(response.data);
    };
    const onFailure = (response) => {
      setTableData([]);
      toast.error(response?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };