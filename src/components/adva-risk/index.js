import React, { useEffect, useState } from "react";
import { _getStorageValue, getUserId } from "../../comman/localStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDatePicker from "react-datepicker";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { toast } from "react-toastify";
import { AES_KEY, USER_ID } from "../../comman/constants";
import { useDispatch } from "react-redux";
import {
  saveAdvariskData,
  getAdvariskStateData,
  getAdvariskDistrictData,
  getAdvariskpincode,
} from "../../action/actionEmployeeAnalytics";
import { set } from "lodash";
import { encryptStatic } from "../../comman/decodeEncodeData";
import { reportUser } from "../../action/reportUser";
import { bankDataUser } from "../../action/bankData";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';

const leftFields = [
  {
    label: "Customer Name *",
    key: "project_case_name",
    value: "",
    isRequired: true,
  },
  {
    label: "State *",
    key: "state",
    value: "",
    isRequired: true,
    type: "select",
    options: [],
  },
  {
    label: "District *",
    key: "district",
    value: "",
    type: "select",
    options: [],
    isRequired: true,
  },
  {
    label: "Village / City / Town / Locality *",
    key: "village_city_town_locality",
    value: "",
    isRequired: true,
  },
  {
    label: "Pincode *",
    key: "pin_code",
    value: "",
    isRequired: true,
    type: "select",
    options: [],
  },
  {
    label: "House / Flat / Plot Number / Wing / Floor Number",
    key: "house_flat_plot_number_wing_floor_number",
    value: "",
  },
  {
    label: "Building Number / Tower Name / Road",
    key: "building_number_tower_name_road",
    value: "",
  },
];

const rightFields = [

  {
    label: "Survey Khasra Number / Phase Number / CTS Number",
    key: "survey_khasra_number_phase_number_cts_number",
    value: "",
  },
  {
    label: "Propety Address Line 1 *",
    key: "property_address_line_1",
    value: "",
    isRequired: true,
  },
  // {
  //   label: "Property Address Line 2",
  //   key: "property_address_line_2",
  //   value: "",
  // },
  {
    label: "Registration Number",
    key: "registration_number",
    value: "",
  },
  {
    label: "Sub Registrar Office",
    key: "sub_registrar_office",
    value: "",
  },
];

const AdvaRiskComp = (props) => {
  const [states, setStates] = useState([]);
  const [pincode, setPinCode] = useState([]);

  const [lFields, setLFields] = useState(leftFields);
  const [isCheck, setCheck] = useState(false);

  const [rFields, setRFields] = useState(rightFields);
  const [owner_names, setOwnerNames] = useState([""]);
  const [date, setDate] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestID, setRequestID] = useState("");
  const [isShowTick, setTickSTatus] = useState(false);

  const [requestCheckLoading, setRequestStatus] = useState("");
  const [value, setValue] = useState(null);


  const dispatch = useDispatch();

  useEffect(() => {
    getAdvariskStateDatas();
  }, []);

  const getAdvariskStateDatas = () => {
    const successCallBack = (response) => {
      let updatedData = lFields.map((md) => {
        if (md.key === "state") {
          return { ...md, options: response.data.names };
        } else {
          return md;
        }
      });
      setLFields(updatedData);
      setLoading(false);
    };

    const failurCallback = () => {
      setLoading(false);
    };
    setLoading(true);
    _getStorageValue(USER_ID).then((id) => {
      dispatch(getAdvariskStateData(id, successCallBack, failurCallback));
    });
  };

  const getAdvariskDistrictDatas = (Selectedstate, latestData) => {
    setStates(Selectedstate);
    const successCallBack = (response) => {
      let updatedData = latestData.map((md) => {
        if (md.key === "district") {
          return { ...md, options: response.data.names };
        } else {
          return md;
        }
      });
      setLFields(updatedData);
      setLoading(false);
    };

    const failurCallback = () => {
      setLoading(false);
    };
    setLoading(true);
    _getStorageValue(USER_ID).then((id) => {
      dispatch(
        getAdvariskDistrictData(
          id,
          Selectedstate,
          successCallBack,
          failurCallback,
        ),
      );
    });
  };

  const getAdvariskPincodeData = (selectedDistrict, latestData) => {
    const successCallBack = (response) => {
      setPinCode(response.data.names);
      let updatedData = latestData.map((md) => {
        if (md.key === "pin_code") {
          return { ...md, options: response.data.names };
        } else {
          return md;
        }
      });
      setLFields(updatedData);

      setLoading(false);
    };

    const failurCallback = () => {
      setLoading(false);
    };
    setLoading(true);
    _getStorageValue(USER_ID).then((id) => {
      dispatch(
        getAdvariskpincode(
          id,
          states,
          selectedDistrict,
          successCallBack,
          failurCallback,
        ),
      );
    });
  };

  const onInputchangeLeft = (e, key, label) => {
    let inputValue = e.target.value;
    let outputData = lFields.map((md, index) => {
      if (key === index) {
        return { ...md, value: inputValue };
      } else {
        return md;
      }
    });
    setLFields(outputData);
    if (label === "state") {
      getAdvariskDistrictDatas(inputValue, outputData);
    } else if (label === "district") {
      getAdvariskPincodeData(inputValue, outputData);
    }
  };

  const onInputchangeRight = (e, key) => {
    let inputValue = e.target.value;
    let outputData = rFields.map((md, index) => {
      if (key === index) {
        return { ...md, value: inputValue };
      } else {
        return md;
      }
    });
    setRFields(outputData);
  };

  const onOwnerNameUpdate = (e, key) => {
    let inputValue = e.target.value;
    let outputData = owner_names.map((md, index) => {
      if (key === index) {
        return inputValue;
      } else {
        return md;
      }
    });

    setOwnerNames(outputData);
  };


  const submit = () => {
    if (isShowTick) {
      setCheck(true);
      let requiredFieds = [
        "property_address_line_1",
        "pin_code",
        "village_city_town_locality",
        "village_city_town_locality",
        "district",
        "state",
        "project_case_name",
        // "reference_number",
      ];
      let payload = {};

      rFields.forEach((data) => {
        payload = { ...payload, [data.key]: data.value };
      });
      lFields.forEach((data) => {
        payload = { ...payload, [data.key]: data.value };
      });
      payload = {
        ...payload,
        service_type: "property_check",
        owner_names: owner_names.filter((fd) => fd != ""),
        registration_date: date,
        reference_number: requestID
      };

      let isExecute = true;

      requiredFieds.forEach((fd) => {
        if (payload[fd] == "") {
          isExecute = false;
        }
      });

      if (owner_names[0].length == 0) {
        isExecute = false;
      }

      if (isExecute) {
        setDisabled(true);
        setLoading(true);
        const successCallBack = (response) => {
          setLoading(false);
          toast.success("Requested Success", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          props.history.push("/adva-risk");
        };

        const failurCallback = (error) => {
          setLoading(false);
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        };

        _getStorageValue(USER_ID).then((id) => {
          dispatch(
            saveAdvariskData(id, payload, successCallBack, failurCallback),
          );
        });
      }
    } else {
      toast.warning("Request ID check Required", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }

  };

  const searchReqId = () => {
    if (requestID == "") {
      toast.warning("Please enter the request ID ", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      setRequestStatus(true);
      const failiurApiCall = (response) => {
        // this.setState({ searchReqLoader: false });
        setRequestStatus(false);

        if (!!response.message) {
          toast.warning(response.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          // this.setState({
          //   lat: 0,
          //   long: 0,
          //   mobile_numbers: "",
          // });
        }
      };

      const successLatLonCall = (response) => {
        // this.setState({ searchReqLoader: false });
        setRequestStatus(false);
        if (!response.message) {
          setTickSTatus(true);

        } else {
          toast.warning("Data Not Found", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      };

      var trimValue = requestID.replace(" ", "", "g");
      _getStorageValue(AES_KEY).then((key) => {
        if (trimValue !== "") {
          // this.setState({ searchReqLoader: true });
          var dataValue = encryptStatic(trimValue, key);
          _getStorageValue(USER_ID).then((userId) => {
            const successCallApi = () => {
              dispatch(reportUser(
                userId,
                dataValue,
                successLatLonCall,
                failiurApiCall,
              ));
            };

            dispatch(bankDataUser(
              userId,
              dataValue,
              successCallApi,
              failiurApiCall,
            ));
          });
        } else {
          toast.warning("Please Enter the REQ-ID", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      });
    }

  }

  return (
    <div style={{ paddingTop: 100 }} className="report-container ">
      <div className="site-vist sitrepot branch-container  ">
        <h3> Request Report </h3>
      </div>
      {
        <>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <div style={{ width: "45%" }}>
              <div
                style={{ width: "100%" }}
                className="customer-details-sec"
              >
                <label className="customer-title">REQ ID *</label>
                <input
                  type="text"
                  value={requestID}
                  onChange={(e) => {
                    // onInputchangeLeft(e, index, md.key);
                    setRequestID(e.target.value);
                    setTickSTatus(false);
                  }}
                  className="customer-desc"
                />
              </div>
            </div>



            {isShowTick ? <div > &#9989;</div> : <div style={{ marginLeft: 20, minWidth: 80, display: "flex", alignItems: "center", justifyContent: "center" }} className="add-Button">
              <button
                disabled={isDisabled}
                onClick={() => {
                  searchReqId();
                }}
                style={{ minWidth: 80, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {requestCheckLoading ? <div className="loader-circle-v1" /> : "Check"}
              </button>
            </div>}

          </div>



          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >


            <div style={{ width: "45%" }}>
              {lFields.map((md, index) => {
                return (
                  <>
                    {md.type !== "select" ? (
                      <div
                        style={{ width: "100%" }}
                        className="customer-details-sec"
                      >
                        <label className="customer-title">{md.label}</label>
                        <input
                          type="text"
                          value={md.value}
                          onChange={(e) => {
                            onInputchangeLeft(e, index, md.key);
                          }}
                          className="customer-desc"
                        />
                      </div>
                    ) : (
                      <div
                        style={{ width: "100%" }}
                        className="customer-details-sec"
                      >
                        <label className="customer-title">{md.label}</label>
                        <div className="down-arrow " style={{ width: "45%" }}>
                          <select
                            value={md.value}
                            onChange={(e) => {
                              onInputchangeLeft(e, index, md.key);
                            }}
                            className="customer-desc"
                            style={{ width: "100%" }}
                          >
                            <option value="NaN" label="Select" />
                            {md.options
                              .slice()
                              .sort((a, b) => a.localeCompare(b))
                              .map((data, key) => {
                                return (
                                  <option key={data} value={data} label={data} />
                                );
                              })}
                          </select>
                        </div>
                      </div>
                    )}

                    {isCheck && md.isRequired && md.value == "" && (
                      <div
                        style={{ color: "red", fontSize: 12, textAlign: "end" }}
                      >
                        required *
                      </div>
                    )}
                  </>
                );
              })}
              {/* <div className="customer-details-sec width45">
                <div className="add-Button">
                  <button
                    disabled={isDisabled}
                    onClick={() => {
                      submit();
                    }}
                  >
                    {loading ? <div className="loader-circle-v1" /> : "Submit"}
                  </button>
                </div>
              </div> */}
            </div>
            <div style={{ width: "45%" }}>
              {rFields.map((md, index) => {
                return (
                  <>
                    <div
                      style={{ width: "100%" }}
                      className="customer-details-sec"
                    >
                      <label className="customer-title">{md.label}</label>
                      <input
                        type="text"
                        value={md.value}
                        onChange={(e) => {
                          onInputchangeRight(e, index);
                        }}
                        className="customer-desc"
                      />
                    </div>
                    {isCheck && md.isRequired && md.value == "" && (
                      <div
                        style={{ color: "red", fontSize: 12, textAlign: "end" }}
                      >
                        required *
                      </div>
                    )}
                  </>
                );
              })}

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">{"Registration Date"}</label>
                <div className="down-arrow" style={{ width: "45%", }}>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {/* <DemoContainer components={['DatePicker']}> */}
                    <DatePicker
  value={value}
  onChange={(newValue) =>{
    let updatedDate = moment(newValue).format("YYYY-MM-DD");
    setDate(updatedDate);
    return setValue(newValue)}}
  format="YYYY-MM-DD"
  slotProps={{
    textField: {
      fullWidth: true,
      InputProps: {
        sx: {
          height: '35px', // Match your other input fields
          borderRadius: '10px', // Match border radius
          paddingRight: '14px',
          fontSize:"14px",
          borderColor: '#053c6d',
          color:"#116366"
          // border:"1px solid #053c6d"
        },
      },
      InputLabelProps: {
        shrink: true,
      },
      sx: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '10px',
          fontSize: '16px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          // borderColor: '#053c6d', // Replace with your exact color
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          // borderColor: '#053c6d',
        },
        '& .MuiSvgIcon-root': {
          color: '#053c6d',
        },
      },
    },
  }}
/>
                    {/* </DemoContainer> */}
                  </LocalizationProvider> 
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
                className="customer-details-sec"
              >
                <label
                  style={{
                    alignItems: "start",
                    width: "50%",
                  }}
                  className="customer-title"
                >
                  {"Owner Names*"}
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "45%",
                  }}
                >
                  {owner_names.map((md, index) => (
                    <div
                      style={{
                        width: "100%",
                        justifyContent: "space-around",
                        alignItems: "center",
                        padding: 2,
                      }}
                    >
                      <input
                        style={{
                          width: "85%",
                        }}
                        type="text"
                        value={md}
                        onChange={(e) => {
                          onOwnerNameUpdate(e, index);
                        }}
                        className="customer-desc"
                      />
                      {index === owner_names.length - 1 ? (
                        <FontAwesomeIcon
                          onClick={() => {
                            setOwnerNames([...owner_names, ""]);
                          }}
                          style={{ width: "10%", marginLeft: "5%" }}
                          icon={faPlusCircle}
                          rotate={45}
                          color="green"
                          size="lg"
                        />
                      ) : (
                        <FontAwesomeIcon
                          onClick={() => {
                            let removedOwnar = owner_names.filter(
                              (_, findex) => findex != index,
                            );
                            setOwnerNames(removedOwnar);
                          }}
                          style={{ width: "10%", marginLeft: "5%" }}
                          icon={faMinusCircle}
                          rotate={45}
                          color="red"
                          size="lg"
                        />
                      )}
                    </div>
                  ))}
                  {isCheck && owner_names[0].length == 0 && (
                    <div style={{ color: "red", fontSize: 12, textAlign: "end" }}>
                      required *
                    </div>
                  )}
                </div>
              </div>

              <div style={{ width: "100%", alignSelf: "end", justifyContent: "flex-end" }} className="customer-details-sec ">
                <div className="add-Button">
                  <button
                    disabled={isDisabled}
                    style={{ minWidth: 80, display: "flex", alignItems: "center", justifyContent: "center" }}

                    onClick={() => {
                      submit();
                    }}
                  >
                    {loading ? <div className="loader-circle-v1" /> : "Submit"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </>

      }
    </div>
  );
};

export default AdvaRiskComp;
