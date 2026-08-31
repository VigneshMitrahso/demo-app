import { GET, ACCESS_TOKEN, POST } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  INSERT_USER_REQUEST,
  INSERT_USER_SUCCESS,
  INSERT_USER_FAILURE,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
} from "./actionConstants";
import { getEmployeeListUrl, getUserUrl, insertUserUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";
import { toast } from "react-toastify";

const insertUserRequested = () => ({
  type: INSERT_USER_REQUEST,
});

const insertUserSuccess = (data) => ({
  type: INSERT_USER_SUCCESS,
  data,
});

const insertUserFailure = (data) => ({
  type: INSERT_USER_FAILURE,
  data,
});

export const insertUsers =
  (userId, payload, setAdd, setCurrentuser, isUpdate = false, history) =>
  (dispatch) => {
    dispatch(insertUserRequested());
    const url = insertUserUrl(userId);
    const onSuccess = (response) => {
      if (response.data[0].code === 200) {
        dispatch(insertUserSuccess(response));
        history.push("/users");
        setAdd(false);
        setCurrentuser(false);
        toast.success(
          !isUpdate
            ? "Employee created successfully"
            : "Employee updated successfully",
          {
            position: toast.POSITION.BOTTOM_CENTER,
          },
        );
      } else {
        dispatch(insertUserFailure(response));
        toast.error(response.data[0].message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };

    const onFailure = (response) => {
      dispatch(insertUserFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(POST, url, payload, onSuccess, onFailure, dispatch, token);
      }
    });
  };

const getUsesrsRequested = () => ({
  type: GET_USERS_REQUEST,
});

const getUsesrsSuccess = (data) => ({
  type: GET_USERS_SUCCESS,
  data,
});

const getUsesrsFailure = (data) => ({
  type: GET_USERS_FAILURE,
});

export const getUsers =
  (userId, pageNumber, sucessCallback = () => {}, failurCallback = () => {}) =>
  (dispatch) => {
    dispatch(getUsesrsRequested());

    const url = getEmployeeListUrl(userId, pageNumber);

    const onSuccess = (response) => {
      dispatch(getUsesrsSuccess(response));
    };

    const onFailure = (response) => {
      dispatch(getUsesrsFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

const getUserRequested = () => ({
  type: GET_USER_REQUEST,
});

const getUsersSuccess = (data) => ({
  type: GET_USER_SUCCESS,
  data,
});

const getUserFailure = (data) => ({
  type: GET_USER_FAILURE,
});

export const getUserByID = (userId, empID) => (dispatch) => {
  dispatch(getUserRequested());
  const url = getUserUrl(userId, empID);
  const onSuccess = (response) => {
    if (response.data.length > 0) {
      dispatch(getUsersSuccess(response));
      toast.success("userAlready exist");
    } else {
      dispatch(getUserFailure(response));
    }
  };

  const onFailure = (response) => {
    dispatch(getUserFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};
