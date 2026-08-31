import React, { useEffect, useState } from "react";
import AzureVideoApp from "../../components/azure-video/deskTopVideoApp";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelVideCall,
  createCall,
  getCustomerLatLong,
  imageuploadVideoKYC,
} from "../../action/azureCalling";
import { _getStorageValue } from "../../comman/localStorage";
import { USER_ID } from "../../comman/constants";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const DeskTopCall = (props) => {
  const [createCallData, setCallData] = useState("");
  const [showScreenShot, setShowScreenShot] = useState(false);
  const [imageData, setImageData] = useState("");
  const [customerData,setCustomerData] = useState({
    address:"",
    latitude:"",
    longitude:"",
  });

  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const reducerVaue = useSelector((state) => state.bankData.selectedTypes);

  const history = useHistory();

  useEffect(() => {
    let call = new URLSearchParams(props.location.search).get("call");
    if (!call) {
      history.push("/customer-connect");
      props.setToggle();
    }
  }, [props?.location?.search]);

  const successApi = (data) => {
    setCallData(data.data[0]);
  };

  const failiur = (data) => {
    setLoading(false);
  };

  useEffect(() => {
    _getStorageValue(USER_ID).then((userId) => {
      dispatch(createCall(userId, props.reqID, successApi, failiur));
    });
  }, []);

  const endCallBack = (data = true) => {
    if (data) {
      history.push("/customer-connect");
      props.setToggle();
      // _getStorageValue(USER_ID).then((userId) => {
      //   dispatch(cancelVideCall(userId,props.reqID,successApi,failiur));
      // });
    } else {
      props.setToggle();
      setTimeout(() => {
        window.location.reload();
      });
    }
  };

  const takeScreenShot = (data) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
    const successApi = (data) => {
      toast.success("Screenshot taken Success", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    };
    const failiur = (data) => {
      setLoading(false);
      toast.error(data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    };
    _getStorageValue(USER_ID).then((userId) => {
      if( customerData.latitude === "" ){
        dispatch(
          getCustomerLatLong(userId, props.reqID, successApiCallBack, failiur),
        );
      }else{
        const latitude = customerData.latitude;
        const longitude = customerData.longitude;
        let imageInfo = {
          "image-base64": data.replace("data:image/png;base64,", ""),
          "image-name": String(Math.ceil(Math.random() * 100000000)) + ".jpg",
          latitude: `${latitude}`,
          longitude: `${longitude}`,
          property_type: reducerVaue.propType.toUpperCase(),
          unit_type: reducerVaue.unitType.toUpperCase(),
        };
        _getStorageValue(USER_ID).then((userId) => {
          dispatch(
            imageuploadVideoKYC(
              userId,
              props.reqID,
              imageInfo,
              successApi,
              failiur,
            ),
          );
        });
        setImageData(imageInfo);
      }
    });

    const successApiCallBack = (response) => {
      // navigator.geolocation.getCurrentPosition(function(position) {
      if (
        !!response?.data?.customer_details[0]?.latitude &&
        !!response?.data?.customer_details[0]?.longitude
      ) {
        const latitude = response.data.customer_details[0].latitude;
        const longitude = response.data.customer_details[0].longitude;
        const address = response.data.customer_details[0].address;
        setCustomerData({address:address,
          latitude:latitude,
          longitude:longitude,})
        let imageInfo = {
          "image-base64": data.replace("data:image/png;base64,", ""),
          "image-name": String(Math.ceil(Math.random() * 100000000)) + ".jpg",
          latitude: `${latitude}`,
          longitude: `${longitude}`,
          property_type: reducerVaue.propType.toUpperCase(),
          unit_type: reducerVaue.unitType.toUpperCase(),
        };
        _getStorageValue(USER_ID).then((userId) => {
          dispatch(
            imageuploadVideoKYC(
              userId,
              props.reqID,
              imageInfo,
              successApi,
              failiur,
            ),
          );
        });
        setImageData(imageInfo);
      } else {
        toast.error("Problem with getting customer location", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
  };

  console.log("customerData",customerData);
  return (
    <div>
      {!!createCallData && !showScreenShot ? (
        <AzureVideoApp
          reqID={props.reqID}
          isLoading={isLoading}
          takeScreenShot={takeScreenShot}
          endCallBack={endCallBack}
          customerID={createCallData.customer_id}
          azureToken={createCallData.token}
          isDeskTop={true}
          customerData={customerData}
        />
      ) : (
        <>
          <label className={"loader-circle"}></label>
          <label
            style={{ color: "#e77817", position: "absolute", top: "52%" }}
          ></label>
        </>
      )}
    </div>
  );
};

export default DeskTopCall;
