import React, { Component, useEffect, useMemo, useState } from "react";
import MUIDataTable from "mui-datatables";
import { getUserByID, insertUsers } from "../../action/usersAction";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { _getStorageValue, getUserId } from "../../comman/localStorage";
import { USER_ID } from "../../comman/constants";
import { Bar } from "react-chartjs-2";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./styles.css";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { stateUser } from "../../action/getState";
import { cityUser } from "../../action/getCity";

const Insertuser = (props) => {
  const [userID, setUserID] = useState("");
  const [userData, setuserData] = useState({
    emp_id: "",
    emp_name: "",
    ra_emp_id: "",
    ra_emp_name: "",
    region: "",
    state: "",
    city: "",
    designation: "",
    department: "",
    base_hub: "",
    working_cpc: "",
    branch: "",
    latitude: "",
    longitude: "",
  });
  const history = useHistory();

  const labelObj = {
    base_hub: "Base hub",
    branch: "Branch",
    city: "City",
    state: "State",
    designation: "Designation",
    department: "Department",
    emp_id: "Emp id",
    emp_name: "Emp name",
    latitude: "Latitude",
    longitude: "Longitude",
    ra_emp_id: "Ra emp id",
    ra_emp_name: "Ra emp name",
    region: "Region",
    working_cpc: "Working cpc ",
  };

  useEffect(() => {
    const stateUrl = `${getUserId()}/state`;
    props.stateUser(stateUrl);
  }, []);

  useEffect(() => {
    if (props.currentuser) {
      let conObj = {};
      Object.keys(userData).forEach((data) => {
        if (data.toLocaleLowerCase() == "city") {
          conObj = {
            ...conObj,
            [data]: props.currentuser[data].toLocaleUpperCase(),
          };
        } else if (data.toLocaleLowerCase() == "state") {
          let userState = "";
          if (props.currentuser.state === "TAMIL NADU") {
            userState = "TAMILNADU";
          } else {
            userState = props.currentuser.state;
          }
          conObj = { ...conObj, [data]: userState.toLocaleUpperCase() };
        } else {
          conObj = { ...conObj, [data]: props.currentuser[data] };
        }
      });
      setuserData(conObj);
    }
  }, [props.currentuser]);

  useEffect(() => {
    if (
      !!props.currentuser.city &&
      props.stateData.length > 0 &&
      !!userData.state
    ) {
      _getStorageValue(USER_ID).then((userId) => {
        let userState = "";
        if (userData.state === "TAMIL NADU") {
          userState = "TAMILNADU";
        } else {
          userState = userData.state;
        }
        let stateId = props.stateData.filter(
          (data) =>
            data.name.toLocaleLowerCase() == userState.toLocaleLowerCase(),
        );
        const cityUrl = `${userId}/state/${stateId[0].id}/city`;
        props.cityUser(cityUrl);
      });
    }
  }, [props.stateData]);

  useEffect(() => {
    if (Object.keys(props.userData).length > 0) {
      let conObj = {};
      Object.keys(userData).forEach((data) => {
        conObj = { ...conObj, [data]: props.userData[data] };
      });
      setuserData(conObj);
    }
  }, [props.userData]);

  useEffect(() => {
    _getStorageValue(USER_ID).then((id) => {
      setUserID(id);
    });
  }, []);

  const updateFields = async (fields, e) => {
    let value = e.target.value;
    if (fields == "state") {
      _getStorageValue(USER_ID).then((userId) => {
        let stateId = props.stateData.filter((data) => data.name == value);
        const cityUrl = `${userId}/state/${stateId[0].id}/city`;
        props.cityUser(cityUrl);
      });
    }
    if (fields === "latitude" || fields === "longitude") {
      const formattedText = e.target.value.replace(/[^\d]/g, "");
      let update = {};
      if (formattedText.length > 2) {
        update = {
          ...userData,
          [fields]:
            formattedText.substring(0, 2) + "." + formattedText.substring(2),
        };
      } else {
        update = { ...userData, [fields]: formattedText };
      }
      setuserData(update);
    } else {
      let update = { ...userData, [fields]: e.target.value };
      setuserData(update);
      if (fields === "emp_id") {
        props.getUserByID(userID, value);
      }
    }
  };

  const submit = () => {
    let payloadData = userData;
    let emptyFields = Object.keys(payloadData).filter(
      (fd) => payloadData[fd] === "",
    );
    if (emptyFields.length >= 1) {
      toast.error("Please enter all the fields", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    //     else
    // if(payloadData.latitude =="" || payloadData.longitude ==""){
    //     toast.error("Please enter latitude and logitude ", {
    //       position: toast.POSITION.BOTTOM_CENTER,
    //   });
    // }
    else {
      payloadData = {
        ...userData,
        latitude: Number(payloadData.latitude),
        longitude: Number(payloadData.longitude),
      };
      _getStorageValue(USER_ID).then((id) => {
        props.insertUsers(
          id,
          payloadData,
          props.setAdd,
          props.setCurrentuser,
          props.currentuser,
          history,
        );
      });
    }
  };
  return (
    <div className="report-container-add">
      <div className="site-vist sitrepot branch-container  ">
        <h3> {!!props.currentuser ? "Edit Employee" : "Add Employee"}</h3>
      </div>
      <>
        {props.isFetching ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "20vh",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            {Object.keys(userData).map((md) => {
              return (
                <div className="customer-details-sec width45">
                  <label className="customer-title">{labelObj[md]}</label>
                  {(() => {
                    if (md === "state") {
                      return (
                        <div className="down-arrow " style={{ width: "45%" }}>
                          <select
                            value={userData[md]}
                            onChange={(e) => {
                              updateFields(md, e);
                            }}
                            className="customer-desc"
                            style={{ width: "100%" }}
                          >
                            <option value="NaN" label="Select" />
                            {props.stateData.map((data, key) => {
                              return (
                                <option
                                  key={data.id}
                                  value={data.name}
                                  label={data.name}
                                />
                              );
                            })}
                          </select>
                        </div>
                      );
                    } else if (md === "city") {
                      return (
                        <div className="down-arrow " style={{ width: "45%" }}>
                          <select
                            value={userData[md]}
                            onChange={(e) => {
                              updateFields(md, e);
                            }}
                            className="customer-desc"
                            style={{ width: "100%" }}
                          >
                            <option value="NaN" label="Select" />
                            {props.cityNameData.map((data, key) => {
                              return (
                                <option
                                  key={data.id}
                                  value={data.name}
                                  label={data.name}
                                />
                              );
                            })}
                          </select>
                        </div>
                      );
                    } else if (md === "department") {
                      return (
                        <div className="down-arrow " style={{ width: "45%" }}>
                          <select
                            value={userData[md]}
                            onChange={(e) => {
                              updateFields(md, e);
                            }}
                            className="customer-desc"
                            style={{ width: "100%" }}
                          >
                            <option value="NaN" label="Select" />
                            <option value="MVG" label="MVG" />
                            <option value="CBG" label="CBG" />
                          </select>
                        </div>
                      );
                    } else {
                      return (
                        <input
                          type="text"
                          value={userData[md]}
                          onChange={(e) => {
                            updateFields(md, e);
                            e.preventDefault();
                          }}
                          maxlength={
                            md === "latitude" || md === "longitude"
                              ? "9"
                              : "65535"
                          }
                          className="customer-desc"
                          disabled={!!props.currentuser && md === "emp_id"}
                          style={
                            !!props.currentuser && md === "emp_id"
                              ? {
                                  backgroundColor: "lightGrey",
                                  cursor: "not-allowed",
                                }
                              : {}
                          }
                        />
                      );
                    }
                  })()}
                </div>
              );
            })}
            {/* <div onClick={()=>submit()} style={{alignItems:"center",display:"flex",justifyContent:"center",paddingBottom:100}} className="customer-details-sec width45">
            <div style={{textAlign:"center"}}className="customer-title">{"submit"}</div>
          </div> */}
            <div className="customer-details-sec width45">
              <div className="add-Button">
                <button onClick={() => submit()}>
                  {!!props.currentuser ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </>
        )}
      </>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isFetching: state.users.isFetching,
  userData: state.users.userData,
  stateData: state.getState.stateData,
  cityNameData: state.getCityName.cityNameData,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      insertUsers: insertUsers,
      getUserByID: getUserByID,
      stateUser: stateUser,
      cityUser: cityUser,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Insertuser);
