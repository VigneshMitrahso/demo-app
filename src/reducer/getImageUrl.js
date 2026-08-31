import {
  GET_IMAGE_URL_FAILURE,
  GET_IMAGE_URL_SUCCESS,
  GET_IMAGE_URL_REQUEST,
  RESET_IMAGE_URL_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingImageUrl: false,
  error: false,
  status: "",
  imageUrlData: [],
  measurmentData: [],
};

const getImageUrl = (state = initialState, action) => {
  switch (action.type) {
    case GET_IMAGE_URL_REQUEST:
      return {
        ...state,
        isFetchingImageUrl: true,
      };
    case GET_IMAGE_URL_FAILURE:
      return {
        ...state,
        isFetchingImageUrl: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_IMAGE_URL_SUCCESS:
      var sortBfMap = action.data.data.image_details;

      sortBfMap.sort(function (a, b) {
        return (a.selected === false) - (b.selected === false);
      });

      var mesure = action.data.data.measurement_details;

      var dataset = [];
      for (let list in mesure) {
        dataset = mesure[list].measure;
      }

      return {
        ...state,
        isFetchingImageUrl: false,
        error: false,
        status: action.data.status,
        imageUrlData: sortBfMap,
        measurmentData: dataset,
        message: "Successfully Logged In",
      };

    case RESET_IMAGE_URL_SUCCESS:
      return {
        ...state,
        isFetchingImageUrl: false,
        error: false,
        status: false,
        imageUrlData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getImageUrl;
