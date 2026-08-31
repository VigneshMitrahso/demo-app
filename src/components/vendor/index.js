import React, { useState, useEffect, useMemo } from "react";
import MUIDataTable from "mui-datatables";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";

import { _getStorageValue } from "../../comman/localStorage";
import { USER_ID } from "../../comman/constants";
import {
  getVendorAgencyList,
  getVendorCityList,
  getVendorList,
  getVendorStateList,
} from "../../action/serveyReport";
import "./styles.css";

const VendorList = (props) => {

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedAgency, setSelectedAgency] = useState("");

  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);

  const [loading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const success=(data)=>{
    setStateList(data.states)
}
const failiure=(data)=>{
    console.log("success",data);
}


  useEffect(() => {
    _getStorageValue(USER_ID).then((id) => {
        props.getVendorStateList(id, success, failiure);
      });
  }, []);

  const successCity=(data)=>{
    setCityList(data.Cities)
  }

  const onChangeState = (e) => {  
    setSelectedState(e);
    setSelectedCity("");
    setSelectedAgency("");
    setAgencyList([]);
    setCityList([]);
    _getStorageValue(USER_ID).then((id) => {
        props.getVendorCityList(id,e, successCity, ()=>{});
      });
  }

  const successTableData = (data)=>{
    setTableData(data);
  }

  const successAgency=(data)=>{
    setAgencyList(data.Agency_name)
  }

  const onChangeCity = (e) => {  
    setSelectedCity(e);
    setSelectedAgency("");
    setAgencyList([]);
    _getStorageValue(USER_ID).then((id) => {
        props.getVendorAgencyList(id,selectedState,e, successAgency);
      });
  }

  const onChangeAgency = (e) => {
    setSelectedAgency(e);
    _getStorageValue(USER_ID).then((id) => {
        props.getVendorList(id,selectedState,selectedCity,e, successTableData);
    });
  }

  const options = {
    responsive: "scroll",
    fixedHeader: true,
    overflowX: "auto",
    filter: false,
    sort: true,
    download: false,
    empty: true,
    index: 10,
    print: true,
    selectableRows: false,
    pagination: false,
    textLabels: {
      showResponsive: true,
      rowsPerPage: "Total items Per Page",
    },
  };

  const columns = useMemo(() => {
    let columns = [];
      columns = [
        {
          name: "address",
          label: "Address",
          options: {
            filter: true,
            sort: false,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                left: "0",
                background: "#ffffff",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
                width: 200,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                left: 0,
                background: "#DCE5E5",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
                width: 200,
              },
            }),
          },
        },
        {
          name: "agency_id",
          label: "Agency ID",
          options: {
            filter: true,
            sort: false,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 0,
                background: "#DCE5E5",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
        {
          name: "agency_name",
          label: "Agency Name",
          options: {
            filter: true,
            sort: false,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 0,
                background: "#DCE5E5",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
        {
          name: "agreement_date_of_service_provider",
          label: "Agreement Date of Service Provider",
          options: {
            filter: true,
            sort: false,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 0,
                background: "#DCE5E5",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
        {
            name: "agreement_expiry_date_of_service_provider",
            label: "Agreement Expiry Date of Service Provider",
            options: {
              filter: true,
              sort: false,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  position: "sticky",
                  left: "0",
                  background: "#ffffff",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 100,
                },
              }),
              setCellHeaderProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 150,
                },
              }),
            },
          },
          {
            name: "annual_review_date",
            label: "Annual Review Date",
            options: {
              filter: true,
              sort: false,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  position: "sticky",
                  left: "0",
                  background: "#ffffff",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 100,
                },
              }),
              setCellHeaderProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 150,
                },
              }),
            },
          },
          {
            name: "annual_review_date",
            label: "Annual Review Date",
            options: {
              filter: true,
              sort: false,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  position: "sticky",
                  left: "0",
                  background: "#ffffff",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 100,
                },
              }),
              setCellHeaderProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 150,
                },
              }),
            },
          },
          {
            name: "last_annual_review_conducted_year",
            label: "Last Annual Review Conducted Year",
            options: {
              filter: true,
              sort: false,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  position: "sticky",
                  left: "0",
                  background: "#ffffff",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 100,
                },
              }),
              setCellHeaderProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 150,
                },
              }),
            },
          },
          {
            name: "property_type",
            label: "Property Type",
            options: {
              filter: true,
              sort: false,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  position: "sticky",
                  left: "0",
                  background: "#ffffff",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 100,
                },
              }),
              setCellHeaderProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 150,
                },
              }),
            },
          },
      ];
 
    return columns;
  }, []);

//   const submit = () => {
//     setCount(count + 1);
//     let data = {
//       latLon: {
//         type: "Point",
//         coordinates: [Number(latitude), Number(longitude)],
//       },
//     };

//     var reg = new RegExp("^-?([0-8]?[0-9]|90)(.[0-9]{1,10})$");

//     if (
//       latitude.replace(/\s\s+/g, "") == "" ||
//       longitude.replace(/\s\s+/g, "") == ""
//     ) {
//       toast.error("Please enter latitude and logitude ", {
//         position: toast.POSITION.BOTTOM_CENTER,
//       });
//     } else if (!reg.test(latitude) || !reg.test(longitude)) {
//       toast.error("Please enter valide latitude and logitude ", {
//         position: toast.POSITION.BOTTOM_CENTER,
//       });
//     } else {
//       _getStorageValue(USER_ID).then((id) => {
//         props.getServeyRequestReport(
//           id,
//           data,
//           screen,
//           selectedState,
//           selectedCity,
//           setLatitude,
//           setLongitude,
//         );
//       });
//     }
//   };
console.log("tableData523",tableData);
  return (
    <>
      {/* <Header link="/ownership-landing-page" /> */}
      <div className="dashboard-container">
        <div className="">
          <div
            className="report-sub-container"
            style={{ justifyContent: "space-between" }}
          >
           
           
            <div style={{ display: "flex" }}>
                       <div className="region-select">
                         <label>State</label>
                         <select  style={{width:300}} value={selectedState} onChange={(e)=>onChangeState(e.target.value)} >
                         <option value={""} label={"Select"} />
                         {stateList.map(md=><option value={md.name} label={md.name} />)   }
                         </select>
                       </div>
                       <div className="region-select">
                         <label>City</label>
                         <select style={{width:300}} value={selectedCity} onChange={(e)=>onChangeCity(e.target.value)} >
                         <option value={""} label={"Select"} />
                         {cityList.map(md=><option value={md.name} label={md.name} />)   }
                         </select>
                       </div>
                       <div className="region-select">
                         <label>Agency</label>
                         <select style={{width:300}} value={selectedAgency} onChange={(e)=>onChangeAgency(e.target.value)} >
                         <option value={""} label={"Select"} />
                         {agencyList.map(md=><option value={md.agency_id} label={md.agency_name} />)   }
                         </select>
                       </div>
                     </div>
            <div style={{marginTop:30}}>
            <MUIDataTable
                className="tracks"
                loading={loading}
                data={
                    tableData
                }
                columns={columns}
                options={options}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  serveyReport: state.serveyReport.serveyReport,
  isFetching: state.serveyReport.isFetching,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVendorStateList:getVendorStateList,
      getVendorCityList:getVendorCityList,
      getVendorList:getVendorList,
      getVendorAgencyList:getVendorAgencyList,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(VendorList);
