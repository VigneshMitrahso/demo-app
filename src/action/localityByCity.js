import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_LOCALITY_CITY_FAILURE,
  GET_LOCALITY_CITY_SUCCESS,
  GET_LOCALITY_CITY_REQUEST,
  RESET_LOCALITY_CITY_SUCCESS,
} from "./actionConstants";
import { localityByCityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const localityByCityRequested = () => ({
  type: GET_LOCALITY_CITY_REQUEST,
});

const localityByCitySuccess = (data) => ({
  type: GET_LOCALITY_CITY_SUCCESS,
  data,
});

const localityByCityFailure = (data) => ({
  type: GET_LOCALITY_CITY_FAILURE,
  data,
});

const localityByCityReset = (data) => ({
  type: RESET_LOCALITY_CITY_SUCCESS,
  data,
});

export const localityByCityUser =
  (userId, stateId, cityId, localitystr) => (dispatch) => {
    dispatch(localityByCityRequested());

    const url = localityByCityUrl(userId, stateId, cityId, localitystr);

    const onSuccess = (response) => {
      dispatch(localityByCitySuccess(response));
    };

    const onFailure = (response) => {
      dispatch(localityByCityFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetlocalityByCityUser = () => (dispatch) => {
  dispatch(localityByCityReset());
};
