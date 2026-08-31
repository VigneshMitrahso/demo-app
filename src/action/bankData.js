import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_BANK_DATA_FAILURE,
  GET_BANK_DATA_SUCCESS,
  GET_BANK_DATA_REQUEST,
  RESET_BANK_DATA_SUCCESS,
  SET_PRO_UNI_TYPE,
} from "./actionConstants";
import { bankDataUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const bankDataRequested = () => ({
  type: GET_BANK_DATA_REQUEST,
});

const bankDataSuccess = (data) => ({
  type: GET_BANK_DATA_SUCCESS,
  data,
});

const bankDataFailure = (data) => ({
  type: GET_BANK_DATA_FAILURE,
  data,
});

const bankDataReset = (data) => ({
  type: RESET_BANK_DATA_SUCCESS,
  data,
});

const setPropertyUnitTypes = (data) => ({
  type: SET_PRO_UNI_TYPE,
  data,
});

export const bankDataUser =
  (userId, reqId, successBankCall, failureBankCall) => (dispatch) => {
    resetbankDataUser();
    dispatch(bankDataRequested());

    const url = bankDataUrl(userId, encodeURIComponent(reqId));

    const onSuccess = (response) => {
      successBankCall(response);
      dispatch(bankDataSuccess(response));
    };

    const onFailure = (response) => {
      failureBankCall(response);
      dispatch(bankDataFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetbankDataUser = () => (dispatch) => {
  dispatch(bankDataReset());
};

export const setPropertyUnitType = (data) => (dispatch) => {
  dispatch(setPropertyUnitTypes(data));
};
