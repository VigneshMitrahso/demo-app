import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  CATEGORY_TYPE_STATE_CITY_FAILURE,
  CATEGORY_TYPE_STATE_CITY_SUCCESS,
  CATEGORY_TYPE_STATE_CITY_REQUEST,
} from "./actionConstants";
import { categoryTypeStateCityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const categoryTypeRequested = () => ({
  type: CATEGORY_TYPE_STATE_CITY_REQUEST,
});

const categoryTypeSuccess = (data) => ({
  type: CATEGORY_TYPE_STATE_CITY_SUCCESS,
  data,
});

const categoryTypeFailure = (data) => ({
  type: CATEGORY_TYPE_STATE_CITY_FAILURE,
  data,
});

export const categoryTypeStateCityUser =
  (userId, stateId, cityId, miscData, successCallBack) => (dispatch) => {
    dispatch(categoryTypeRequested());

    const url = categoryTypeStateCityUrl(userId, stateId, cityId, miscData);

    const onSuccess = (response) => {
      dispatch(categoryTypeSuccess(response));
      successCallBack();
    };

    const onFailure = (response) => {
      dispatch(categoryTypeFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };
