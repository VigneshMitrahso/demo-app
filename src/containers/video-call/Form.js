import React, { useCallback, useEffect, useState } from "react";

// plugin
import { connect, useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";

// import RNSecureKeyStore from "react-native-secure-key-store";

// function
// import {
//   ACCESS_TOKEN,
//   POST,
//   REFRESH_TOKEN,
//   REQ_ID,
//   USER_ID,
//   USER_NAME
// } from "../../common/applicationConstants";
// import { setRsaKey, _getStorageValue } from "../../common/localStorage";
// import Navigation from "../../component/Navigation/Navigation";
// import {
//   locationUpdateWatcher,
//   getLocationWatcher,
//   getBankDataReset,
//   geoTrackingWatcher,
//   LogoutCheckWatcher,
//   LogoutCheckDayWatcher,
//   GetReportWatcher,
//   UpdateReportWatcher
// } from "../../store/actions";
// import { logoutCheckURL, logoutCheckDayURL, reportURL, updateReportURL} from "../../store/config";
// style
// import { styles } from "./styles";
// import { AuthContext } from "../../../AuthContext";
// import Geolocation, { watchPosition } from "react-native-geolocation-service";
// import ReactNativeForegroundService from "@supersami/rn-foreground-service";
// import { colors } from "../../styles/style-credentials";
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from "react-native-responsive-screen";
// import Colors from "../../common/Colors";
// import Strings from "../../common/strings";
// import { decryptStatic, encryptStatic } from "../../common/decodeEncodeData";
// import Button from "../../component/Button/Button";
// import { styless } from "../../styles/styles";
// import { ENCRYPT_URL, geoTrack } from "../../store/config";
// import AuthTokenCompare from "../../common/AuthTokenCompare";
// import NetworkUtils from "../../common/NetworkUtills";
// import { RFPercentage as rf } from "react-native-responsive-fontsize";
// import { GetNewToken } from "../../common/helper";
// import AsyncStorage from "@react-native-community/async-storage";
// import LoaderModal from "../../component/LoaderModal";
// import { apiCall } from "../../common/connect";
// import Images from "../../common/Images";
// import BackNav from "../../common/BackNav";
// import reactotron from "reactotron-react-native";
import ResLand from "./ResLand";
import {
  commercialBuilding,
  commercialLand,
  commercialOffice,
  commercialRetail,
  industrialLand,
  industrialUnit,
  propertyCinima,
  propertyHospital,
  propertyHotels,
  propertyInstitude,
  propertyMalls,
  propertyMarriage,
  propertyWarehouses,
  residentialFlat,
  residentialHouse,
  residentialLand,
} from "./formDataSource";
import { _getStorageValue } from "../../comman/localStorage";
import { USER_ID } from "../../comman/constants";
import { getReportData, updateReportApi } from "../../action/reportUser";

const Form = (props) => {
  // const [animation] = React.useState(new Animated.Value(0));
  // const { height } = Dimensions.get('window')

  const reducerVaue = useSelector((state) => state.bankData.selectedTypes);

  const [selectedData, setSelectedData] = useState(reducerVaue?.propType ?? "");
  const [selectedunitType, setSelectedUnitType] = useState(
    reducerVaue?.unitType ?? "",
  );
  const [resKey, setResKey] = useState("");
  const [images, setImages] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, sesFormFields] = useState([]);
  const dispatch = useDispatch();

  const getCall = async (item, formList) => {
    setIsLoading(true);

    _getStorageValue(USER_ID).then((userId) => {
      dispatch(
        getReportData(
          userId,
          props.reqId,
          selectedData?.toUpperCase() ?? "",
          item?.toUpperCase() ?? "",
          successApi,
          failiur,
        ),
      );
    });

    const successApi = (res) => {
      if (res.data.report_details.length > 0) {
        let response = res.data.report_details[0];
        let updatedValue = formList.map((data) => {
          if (data.field === "boundry") {
            return {
              ...data,
              options: [
                {
                  boundSouth: response.bound_south,
                  boundWest: response.bound_west,
                  boundEast: response.bound_east,
                  boundNorth: response.bound_north,
                },
              ],
            };
          } else {
            return !!response[data?.key]
              ? { ...data, value: String(response[data?.key] ?? "") }
              : data;
          }
        });
        setImages(response?.download_urls);
        sesFormFields(updatedValue);
      } else {
        setImages([]);
      }
    };

    const failiur = (data) => {
      console.log("failiur", data);
    };
  };

  useEffect(() => {
    let item = selectedunitType;
    let dynamicForm = [];
    if (selectedData === "Residential" && item === "Land") {
      dynamicForm = residentialLand;
    } else if (selectedData === "Residential" && item === "Flat") {
      dynamicForm = residentialFlat;
    } else if (selectedData === "Residential" && item === "Independent House") {
      dynamicForm = residentialHouse;
    } else if (selectedData === "Commercial" && item === "Land") {
      dynamicForm = commercialLand;
    } else if (selectedData === "Commercial" && item === "Office") {
      dynamicForm = commercialOffice;
    } else if (selectedData === "Commercial" && item === "Retail") {
      dynamicForm = commercialRetail;
    } else if (
      selectedData === "Commercial" &&
      item === "Independent Building"
    ) {
      dynamicForm = commercialBuilding;
    } else if (selectedData === "Industrial" && item === "Land") {
      dynamicForm = industrialLand;
    } else if (selectedData === "Industrial" && item === "Unit") {
      dynamicForm = industrialUnit;
    } else if (selectedData === "Specialised property" && item === "Hospital") {
      dynamicForm = propertyHospital;
    } else if (
      selectedData === "Specialised property" &&
      item === "Function Hall/Marriage Garden"
    ) {
      dynamicForm = propertyMarriage;
    } else if (
      selectedData === "Specialised property" &&
      item === "Educational Institute"
    ) {
      dynamicForm = propertyInstitude;
    } else if (
      selectedData === "Specialised property" &&
      item === "Cinema Halls"
    ) {
      dynamicForm = propertyCinima;
    } else if (selectedData === "Specialised property" && item === "Malls") {
      dynamicForm = propertyMalls;
    } else if (selectedData === "Specialised property" && item === "Hotels") {
      dynamicForm = propertyHotels;
    } else if (
      selectedData === "Specialised property" &&
      item === "Warehouses"
    ) {
      dynamicForm = propertyWarehouses;
    }

    sesFormFields(dynamicForm);
    getCall(item, dynamicForm);
  }, [selectedData, selectedunitType]);

  const callbackFunction = useCallback(
    async (data) => {
      let payloadData = {
        property_type: selectedData.toUpperCase(),
        unit_type: selectedunitType.toUpperCase(),
        ...data,
      };
      setIsLoading(true);
      _getStorageValue(USER_ID).then((userId) => {
        dispatch(
          updateReportApi(
            userId,
            props.reqId,
            payloadData,
            successApi,
            failiur,
          ),
        );
      });

      const successApi = (res) => {
        // if(res.data.report_details.length>0){
        // }else{
        //   setImages([]);
        // }
        toast.success("Report updated successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      };

      const failiur = (data) => {
        toast.error(data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      };
    },
    [selectedData, selectedunitType],
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {formFields.length > 0 && (
        <ResLand
          saveBtn={props.saveBtn}
          images={images}
          formFields={formFields}
          saveCallBack={callbackFunction}
          propertyTypeData={selectedData}
          unitType={selectedunitType}
          {...props}
        />
      )}
      {/* {formFields.length > 0 && <ResLand images={images} formFields={formFields} saveCallBack={callbackFunction} propertyTypeData={selectedData} unitType={selectedunitType} {...props}/>} */}
    </div>
  );
};

function mapStateToProps({ bankData }) {
  const selectedTypes = bankData.selectedTypes;
  return { selectedTypes };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Form);
