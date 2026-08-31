import React, { useState, useEffect, useRef, useCallback } from "react";
// import { launchCamera } from 'react-native-image-picker';
// import ImageResizer from "react-native-image-resizer";
import { connect } from "react-redux";
import Slider from "react-slick";
import { bindActionCreators } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload } from "@fortawesome/free-solid-svg-icons";

// import { _getStorageValue } from "../../common/localStorage";
// import { Notifier, NotifierComponents } from "react-native-notifier";
// import { getStateDataURL, getCityDataURL, getBranchDataURL, uploadImageBranchURL, uploadBranchDataURL, getEmpIdURL, getEmpListURL, getBranchUpdateDataURL, saveMarketTransactionURL, uploadImageURL } from '../../store/config';
// import { GetStateDataWatcher, GetCityDataWatcher, GetBranchDataWatcher, ImageUploadBranchWatcher, UploadBranchDataWatcher, GetEmpIdWatcher, GetEmpListWatcher, GetBranchUpdateDataWatcher, ImageUploadWatcher } from "../../store/actions";
// import Progressbar from "../../component/ProgressBar/ProgressBar";
// import LoaderModal from "../../component/LoaderModal";
// import Geolocation from "react-native-geolocation-service";
// import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
// import Images from "../../common/Images";
// import RNFS from "react-native-fs";
// import Entypo from "react-native-vector-icons/Entypo";
// import {
//     ACCESS_TOKEN,
//     REFRESH_TOKEN,
//     REQ_ID,
//     USER_ID,
// } from "../../common/applicationConstants";

// import styles from '../market-transaction/style';
// import { resolve } from 'path';
// import reactotron from 'reactotron-react-native';
// import { useFocusEffect } from "@react-navigation/native";
// import { getNetworkBandwidth } from '../../common/checkInternetStrength';
// import AuthTokenCompare from '../../common/AuthTokenCompare';
// import { GetNewToken } from '../../common/helper';
// import AsyncStorage from '@react-native-community/async-storage';
// import { Colors } from 'react-native/Libraries/NewAppScreen';
// import BackNav from '../../common/BackNav';
// import Navigation from '../../component/Navigation/Navigation';
// import { open } from 'fs';
// import { encryptStatic } from '../../common/decodeEncodeData';

const wholeKeys = [
  "number_of_tenants",
  "no_of_buildings_on_site",
  "no_of_beds",
  "no_of_students",
  "no_of_teaching_and_non_teaching_staff",
  "no_of_screens",
  "total_capacity",
  "no_of_keys",
  "no_of_restaurants",
  "no_of_banquet_halls_meeting_rooms",
  "number_of_flats_per_floor",
  "number_of_wings_blocks_in_society",
  "number_of_floors_in_the_building",
  "number_of_units",
];

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "black",
        paddingLeft: "30px",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "black",
        zIndex: 9999,
        paddingRight: "30px",
      }}
      onClick={onClick}
      disabled={false}
    />
  );
}

const settings = {
  dots: false,
  infinite: false,
  speed: 1000,
  slidesToShow: 4,
  slidesToScroll: 5,
  arrows: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,

  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 4, slidesToScroll: 3, infinite: false },
    },
  ],
};

const ALLForm = (props) => {
  const [fieldsValue, setFieldValues] = useState(props.formFields);
  const [open, setOpenData] = useState(
    props.formFields.map((data) => ({ open: data?.open ?? false })),
  );
  const [bounds, setBounds] = useState({
    boundSouth: "",
    boundWest: "",
    boundEast: "",
    boundNorth: "",
  });
  const [imageSrc, setImageSrc] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [isTenant, setTenant] = useState("tenants");

  useEffect(() => {
    setFieldValues(props.formFields);
    let isBoundry = props.formFields.filter((item) => item.field === "boundry");
    if (isBoundry.length !== 0 && isBoundry[0].options.length === 1) {
      setBounds(isBoundry[0].options[0]);
    }
    if (isBoundry.length !== 0 && isBoundry[0].options.length === 0) {
      setBounds({
        boundSouth: "",
        boundWest: "",
        boundEast: "",
        boundNorth: "",
      });
    }
  }, [props.formFields]);

  useEffect(() => {
    setImageSrc(props.images);
  }, [props.images]);

  const handleSubmitData = () => {
    let isBoundry = false;
    isBoundry = fieldsValue.filter((item) => item.field === "boundry");
    isBoundry = isBoundry.length === 0 ? false : true;
    if (isBoundry) {
      let fields = fieldsValue.filter((item) => !!item?.value);
      let payloadData = {};
      fields.forEach((item) => {
        payloadData[item.key] = item.value;
      });
      payloadData["bound_south"] = bounds.boundSouth;
      payloadData["bound_west"] = bounds.boundWest;
      payloadData["bound_east"] = bounds.boundEast;
      payloadData["bound_north"] = bounds.boundNorth;
      let payloadDatas = payloadData;
      props.saveCallBack(payloadDatas);
    } else {
      let fields = fieldsValue.filter((item) => !!item?.value);
      let payloadData = {};
      fieldsValue.forEach((item) => {
        payloadData[item.key] = item.value;
      });
      props.saveCallBack(payloadData);
    }
  };

  const setUpdate = (item, count, regg = false) => {
    if (regg !== false) {
      if (regg.test(item) || item == "") {
        let updatedValue = fieldsValue.map((mapdata, index) => {
          if (index === count) {
            return { ...mapdata, value: item };
          } else {
            return mapdata;
          }
        });
        setFieldValues(updatedValue);
      } else {
        //     Notifier.showNotification({
        //         title: "Please enter valid input",
        //         Component: NotifierComponents.Alert,
        //         componentProps: {
        //             alertType: "error",
        //         },
        //     });
      }
    } else {
      let updatedValue = fieldsValue.map((mapdata, index) => {
        if (index === count) {
          return { ...mapdata, value: item };
        } else {
          return mapdata;
        }
      });
      setFieldValues(updatedValue);
    }

    // reactotron.log("update",item,index)
  };

  useEffect(() => {
    if (props.saveBtn != "") {
      handleSubmitData();
    }
  }, [props.saveBtn]);

  const setValue = (callback, count) => {
    // this.setState({ value: callback() })
    let updatedValue = fieldsValue.map((mapdata, index) => {
      if (index == count) {
        // reactotron.log("count",count,index);
        return { ...mapdata, value: callback() };
      } else {
        return mapdata;
      }
    });
    setFieldValues(updatedValue);
  };

  const setOpen = (item) => {
    let updatedValue = open.map((mapdata, index) => {
      if (index === item) {
        return { ...mapdata, open: !mapdata?.open ?? false };
      } else {
        return { ...mapdata };
      }
    });
    setOpenData(updatedValue);
  };

  const downloadAllImages = async (images) => {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    let urls = images;
    for (const url of urls) {
      const a = document.createElement("a");
      a.download = "";
      a.href = url;
      a.click();
      await delay(200);
    }
  };

  return (
    <div style={{ width: "80%" }}>
      <div className="site-vist sitrepot branch-container">
        <h3> {"Report"}</h3>
      </div>
      {fieldsValue.length > 0 &&
        fieldsValue?.map((item, index) => {
          return (
            <>
              <>
                <div
                  style={{ marginTop: 20, marginBottom: 5, paddingRight: 20 }}
                  className="report-customer-details-sec "
                >
                  {item.field !== "boundry" && isTenant !== ""
                    ? !item.label.includes(isTenant) && (
                        <label className="customer-title">{item.label}</label>
                      )
                    : item.field !== "boundry" && (
                        <label className="customer-title">{item.label}</label>
                      )}
                  {isTenant !== ""
                    ? item.field === "text" &&
                      !item.label.includes(isTenant) && (
                        <input
                          type="text"
                          value={item?.value ?? ""}
                          onChange={(e) => {
                            setUpdate(e.target.value, index);
                            e.preventDefault();
                          }}
                          className="customer-desc"
                        />
                      )
                    : item.field === "text" && (
                        <input
                          type="text"
                          value={item?.value ?? ""}
                          onChange={(e) => {
                            setUpdate(e.target.value, index);
                            e.preventDefault();
                          }}
                          className="customer-desc"
                        />
                      )}
                  {item.field === "dropdown" && (
                    <div
                      style={{
                        width: "45%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        padding: 0,
                        margin: 0,
                      }}
                      className="search-element"
                    >
                      <div style={{ width: "100%" }}>
                        <select
                          value={item?.value ?? ""}
                          style={{ fontSize: 12 }}
                          onChange={(e) => {
                            if (e.target.value === "Rented") {
                              setTenant("");
                            } else {
                              setTenant("tenants");
                            }
                            setUpdate(e.target.value, index);
                          }}
                        >
                          <option value="" label="Select" />
                          {item.options.map((data) => {
                            return (
                              <option value={data.value} label={data.label} />
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  )}
                  {isTenant !== ""
                    ? item.field === "number" &&
                      !item.label.includes(isTenant) && (
                        <input
                          type="number"
                          value={item?.value ?? ""}
                          onChange={(e) => {
                            wholeKeys.includes(item.key)
                              ? setUpdate(
                                  e.target.value,
                                  index,
                                  /^[-+]?[0-9]*\.?[0-9]+$/,
                                )
                              : setUpdate(
                                  e.target.value,
                                  index,
                                  /^[-+]?[0-9]+\.?[0-9]*$/,
                                );
                          }}
                          className="customer-desc"
                        />
                      )
                    : item.field === "number" && (
                        <input
                          type="number"
                          value={item?.value ?? ""}
                          className="customer-desc"
                          onChange={(e) => {
                            wholeKeys.includes(item.key)
                              ? setUpdate(
                                  e.target.value,
                                  index,
                                  /^[-+]?[0-9]*\.?[0-9]+$/,
                                )
                              : setUpdate(
                                  e.target.value,
                                  index,
                                  /^[-+]?[0-9]+\.?[0-9]*$/,
                                );
                          }}
                        />
                      )}
                </div>
              </>
              {item.field === "boundry" && (
                <>
                  <div className="site-vist sitrepot branch-container">
                    <h3> {"Boundary"}</h3>
                  </div>
                  <div
                    style={{ marginTop: 20 }}
                    className="report-customer-details-sec"
                  >
                    <label className="customer-title">{"East"}</label>
                    <input
                      type="text"
                      value={bounds.boundEast}
                      onChange={(e) => {
                        let boundsData = {
                          ...bounds,
                          boundEast: e.target.value,
                        };
                        setBounds(boundsData);
                      }}
                      className="customer-desc"
                    />
                  </div>
                  <div
                    style={{ marginTop: 20 }}
                    className="report-customer-details-sec"
                  >
                    <label className="customer-title">{"West"}</label>
                    <input
                      type="text"
                      value={bounds.boundWest}
                      onChange={(e) => {
                        let boundsData = {
                          ...bounds,
                          boundWest: e.target.value,
                        };
                        setBounds(boundsData);
                      }}
                      className="customer-desc"
                    />
                  </div>
                  <div
                    style={{ marginTop: 20 }}
                    className="report-customer-details-sec"
                  >
                    <label className="customer-title">{"North"}</label>
                    <input
                      type="text"
                      value={bounds.boundNorth}
                      onChange={(e) => {
                        let boundsData = {
                          ...bounds,
                          boundNorth: e.target.value,
                        };
                        setBounds(boundsData);
                      }}
                      className="customer-desc"
                    />
                  </div>
                  <div
                    style={{ marginTop: 20 }}
                    className="report-customer-details-sec"
                  >
                    <label className="customer-title">{"South"}</label>
                    <input
                      type="text"
                      value={bounds.boundSouth}
                      onChange={(e) => {
                        let boundsData = {
                          ...bounds,
                          boundSouth: e.target.value,
                        };
                        setBounds(boundsData);
                      }}
                      className="customer-desc"
                    />
                  </div>
                </>
              )}
            </>
          );
        })}

      <div style={{ position: "relative" }}>
        {imageSrc.length != 0 && (
          <div
            onClick={() => {
              downloadAllImages(imageSrc);
            }}
            style={{
              width: 30,
              height: 30,
              background: "#97291e",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              position: "absolute",
              top: -13,
              left: -39,
              zIndex: 11,
              cursor: "pointer",
            }}
          >
            <FontAwesomeIcon
              icon={faFileDownload}
              rotate={45}
              color="#fff"
              size="md"
            />
          </div>
        )}
        <Slider
          {...settings}
          style={{ marginBottom: 30 }}
          className="report-download-lick"
        >
          {imageSrc.length > 0 &&
            imageSrc.map((data) => {
              return (
                <div
                  className={`down-load-img-report`}
                  style={{ paddingRight: 10 }}
                >
                  <img className="customer-downlod-image" src={data} />
                </div>
              );
            })}
          {/* {imageSrc??[].map((data) => {
                                return (
                                  <div>
                                    {(() => {
                                      if (data?.selected === undefined) {
                                        return (
                                          <div
                                            className={`down-load-img image-layout`}
                                          >
                                            <p>Image</p>
                                          </div>
                                        );
                                      } else {
                                        return (
                                          <div
                                            className={`down-load-img ${
                                              data?.selected
                                                ? "active-state"
                                                : null
                                            }`}
                                          >
                                            <img
                                              className="customer-downlod-image"
                                              src={data}
                                            />
                                          </div>
                                        );
                                      }
                                    })()}
                                  </div>
                                );
                              })} */}
        </Slider>
      </div>

      {/* {(imageSrc.length > 0) &&
                    <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={{}}  >
                        <View style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            {imageSrc.map((imageUrl) => {
                                return (
                                    <View style={{ display: 'flex', justifyContent: 'center', margin: 10 }}>
                                        <Image source={{uri:imageUrl}} style={{ width: 100, height: 100 }} />
                                    </View>
                                )
                            })}

                        </View>
                    </ScrollView>}
                <View style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View>
                        <ButtonComponent
                            icon={Images.UPLOAD_IMAGES}
                            name={Strings.UPLOAD_IMAGE}
                            onPress={ () => {
                                    props.navigation.navigate("CustomCamera", { path: "reportup" })
                            }}
                            disabled={false}
                        />
                    </View>
                </View>
                   <View style={styles.container}>
                    <View style={styles.subConatiner}>
                        <Button
                            mainStyle={styles.btn}
                            onPress={() => { checkrefreshtoken(handleSubmitData) }}
                            disabled={false}
                            textStyle={styles.btnText}
                            text={"Submit"}
                        />
                    </View>
                </View> */}
    </div>
  );
};
const mapStateToProps = () => ({});
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      // GetStateDataWatcher,
      // GetBranchDataWatcher,
      // GetCityDataWatcher,
      // ImageUploadBranchWatcher,
      // UploadBranchDataWatcher,
      // GetEmpIdWatcher,
      // GetEmpListWatcher,
      // GetBranchUpdateDataWatcher,
      // ImageUploadWatcher
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ALLForm);
