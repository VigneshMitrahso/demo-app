import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_PROPERTY_STATE_CITY_FAILURE,
  GET_PROPERTY_STATE_CITY_SUCCESS,
  GET_PROPERTY_STATE_CITY_REQUEST,
  RESET_PROPERTY_STATE_CITY_SUCCESS,
} from "./actionConstants";
import { propertyByCityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const propertyByCityRequested = () => ({
  type: GET_PROPERTY_STATE_CITY_REQUEST,
});

const propertyByCitySuccess = (data) => ({
  type: GET_PROPERTY_STATE_CITY_SUCCESS,
  data,
});

const propertyByCityFailure = (data) => ({
  type: GET_PROPERTY_STATE_CITY_FAILURE,
  data,
});

const propertyByCityReset = (data) => ({
  type: RESET_PROPERTY_STATE_CITY_SUCCESS,
  data,
});

export const propertyByCityUser =
  (userId, stateId, cityId, category, successCallBackProperty) =>
  (dispatch) => {
    dispatch(propertyByCityRequested());

    const url = propertyByCityUrl(userId, stateId, cityId, category);

    const onSuccess = (response) => {
      dispatch(propertyByCitySuccess(response));
      successCallBackProperty();
    };

    const onFailure = (response) => {
      dispatch(propertyByCityFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetpropertyByCityUser = () => (dispatch) => {
  dispatch(propertyByCityReset());
};
