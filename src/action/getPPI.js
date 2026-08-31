import { GET } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_PPIPINCODE_SUCCESS,
  GET_PPIPINCODE_REQUEST,
  GET_PPIPINCODE_FAILURE,
  RESET_PPIPINCODE_SUCCESS,
  GET_PPIPROPRTY_SUCCESS,
  GET_PPIPROPRTY_REQUEST,
  GET_PPIPROPRTY_FAILURE,
  RESET_PPIPROPRTY_SUCCESS,
  GET_PPIUNIT_FAILURE,
  GET_PPIUNIT_SUCCESS,
  GET_PPIUNIT_REQUEST,
  RESET_PPIUNIT_SUCCESS,
  GET_PPIAGE_FAILURE,
  GET_PPIAGE_SUCCESS,
  GET_PPIAGE_REQUEST,
  RESET_PPIAGE_SUCCESS,
  GET_PPIANALYTICS_FAILURE,
  GET_PPIANALYTICS_SUCCESS,
  GET_PPIANALYTICS_REQUEST,
  RESET_PPIANALYTICS_SUCCESS,
} from "./actionConstants";
import { proprtyIndex } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";
import { ACCESS_TOKEN } from "../comman/constants";
//PinCode
const ppiRequested = () => ({
  type: GET_PPIPINCODE_REQUEST,
});

const ppiSuccess = (data) => ({
  type: GET_PPIPINCODE_SUCCESS,
  data,
});

const ppiFailure = (data) => ({
  type: GET_PPIPINCODE_FAILURE,
  data,
});
const ppiReset = (data) => ({
  type: RESET_PPIPINCODE_SUCCESS,
  data,
});

export const propertyPinCodeIndexUrl = (appendUrl) => (dispatch) => {
  dispatch(ppiRequested());

  const url = proprtyIndex(appendUrl);

  const onSuccess = (response) => {
    dispatch(ppiSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(ppiFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};
export const resetPincodeUser = () => (dispatch) => {
  dispatch(ppiReset());
};
//Property Type
const ppiPropertyFailure = (data) => ({
  type: GET_PPIPROPRTY_FAILURE,
  data,
});

const ppiPropertyRequested = () => ({
  type: GET_PPIPROPRTY_REQUEST,
});

const ppiPropertySuccess = (data) => ({
  type: GET_PPIPROPRTY_SUCCESS,
  data,
});
const ppiPropertyReset = (data) => ({
  type: RESET_PPIPROPRTY_SUCCESS,
  data,
});
export const propertyTypeIndexUrl = (appendUrl) => (dispatch) => {
  dispatch(ppiPropertyRequested());

  const url = proprtyIndex(appendUrl);

  const onSuccess = (response) => {
    dispatch(ppiPropertySuccess(response));
  };

  const onFailure = (response) => {
    dispatch(ppiPropertyFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};
export const resetPropertyTypeUser = () => (dispatch) => {
  dispatch(ppiPropertyReset());
};
//Unit Type
const ppiUnitFailure = (data) => ({
  type: GET_PPIUNIT_FAILURE,
  data,
});

const ppiUnitRequested = () => ({
  type: GET_PPIUNIT_REQUEST,
});

const ppiUnitSuccess = (data) => ({
  type: GET_PPIUNIT_SUCCESS,
  data,
});
const ppiUnitReset = (data) => ({
  type: RESET_PPIUNIT_SUCCESS,
  data,
});
export const unitTypeIndexUrl = (appendUrl) => (dispatch) => {
  dispatch(ppiUnitRequested());

  const url = proprtyIndex(appendUrl);

  const onSuccess = (response) => {
    dispatch(ppiUnitSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(ppiUnitFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetUnitUser = () => (dispatch) => {
  dispatch(ppiUnitReset());
};
//Age Range
const ppiAgeRangeFailure = (data) => ({
  type: GET_PPIAGE_FAILURE,
  data,
});

const ppiAgeRangeRequested = () => ({
  type: GET_PPIAGE_REQUEST,
});

const ppiAgeRangeSuccess = (data) => ({
  type: GET_PPIAGE_SUCCESS,
  data,
});
const ppiAgeRangeReset = (data) => ({
  type: RESET_PPIAGE_SUCCESS,
  data,
});

export const ageRangeIndexUrl = (appendUrl) => (dispatch) => {
  dispatch(ppiAgeRangeRequested());

  const url = proprtyIndex(appendUrl);

  const onSuccess = (response) => {
    dispatch(ppiAgeRangeSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(ppiAgeRangeFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetAgeRangeUser = () => (dispatch) => {
  dispatch(ppiAgeRangeReset());
};
//PPI Bar Analytics
const ppiAnalyticsFailure = (data) => ({
  type: GET_PPIANALYTICS_FAILURE,
  data,
});

const ppiAnalyticsRequested = () => ({
  type: GET_PPIANALYTICS_REQUEST,
});

const ppiAnalyticsSuccess = (data) => ({
  type: GET_PPIANALYTICS_SUCCESS,
  data,
});

const ppiAnalyticsReset = (data) => ({
  type: RESET_PPIANALYTICS_SUCCESS,
  data,
});
export const analyticsIndexUrl =
  (analyticsUrl, successPpiAnalytics, failuerPpiAnalytics) => (dispatch) => {
    dispatch(ppiAnalyticsRequested());

    const url = proprtyIndex(analyticsUrl);

    const onSuccess = (response) => {
      dispatch(ppiAnalyticsSuccess(response));
      successPpiAnalytics(response);
    };

    const onFailure = (response) => {
      dispatch(ppiAnalyticsFailure(response));
      failuerPpiAnalytics(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetAnalyticsUser = () => (dispatch) => {
  dispatch(ppiAnalyticsReset());
};
