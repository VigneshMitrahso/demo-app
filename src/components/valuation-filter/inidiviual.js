import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import moment from "moment";
import PropEdge from "./propEdge";
import { bindActionCreators } from "redux";
import { USER_ID } from "../../comman/constants";
import { connect } from "react-redux";
import Loader from "../loader";
import CustomAccordian from "./accordian";
import CustomModal from "./modalWindow";
import { getStateByRadiusUser } from "../../action/getStatesByRadius";
import { _getStorageValue } from "../../comman/localStorage";
import { isEmpty, keys } from "lodash";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { toast } from "react-toastify";
import { valuationStateUser } from "../../action/automationStateValuation";

const Empty = ({ numSpan }) => {
  return (
    <tr>
      <td colspan={numSpan}>No data available </td>
    </tr>
  );
};

const MapComp = React.lazy(() => import("././map"));

const marketData = {
  building_or_projectname: "Building or Project Name",
  type_of_property: "Property Type",
  type_of_unit: "Unit Type",
  location: "Location",
  pincode: "Pincode",
  street_name: "Street Name",
  land_area: "Land Area",
  land_rate: "Land Rate",
  sbua_area: "SBUA Area",
  sbua_rate: "SBUA Rate",
  bua_area: "BUA Area",
  bua_rate: "BUA Rate",
  carpet_area: "Carpet Area",
  carpet_rate: "Carpet Rate",
  transaction_or_quote: "Transaction or Quote",
  source_of_information: "Source of Information",
  contact_number: "Contact Number",
  date_of_entry: "Date of Entry",
};

const Individuals = (props) => {
  const [swapFilter, setSwapFilter] = useState("type1");
  // const [marketTransaction, setMarketTransaction] = useState([]);

  var coordinates = {
    lat: props.propertyData.latitude,
    lng: props.propertyData.longitude,
  };

  const swapFilterType = (type) => {
    setSwapFilter(type);
  };

  const tabs = [
    { label: "Map", value: "type1" },
    { label: "ICICI", value: "type2" },
    { label: `External \n Vendor`, value: "type3" },
    { label: `Property Portals ${""}`, value: "type4" },
    { label: "Market Transaction", value: "type5" },
  ];

  const coOrds = useMemo(() => {
    if (!!props.propertyData.latitude && !!props.propertyData.longitude) {
      return {
        initialCenter: {
          lat: props.propertyData.latitude,
          lng: props.propertyData.longitude,
        },
        center: {
          lat: props.propertyData.latitude,
          lng: props.propertyData.longitude,
        },
      };
    } else {
      return {};
    }
  }, [props.propertyData.longitude]);

  // useEffect(() => {
  //   const success = (data) => {
  //     console.log("success Call back", data.data.entries);
  //     setMarketTransaction(data.data.entries);
  //   }

  //   const failiur = () => {
  //     // console.log("success Call back",data);
  //     setMarketTransaction([]);
  //   }

  //   _getStorageValue(USER_ID).then((userId) => {
  //     if (!!props.parentState.avmurl) {
  //       let url = `?category_type=MARKET TRANSACTION&${props.parentState.avmurl}&googlesearch=true`;
  //       url = url.replace("&search_from=locality", "")
  //       props.getStateByRadiusUser(userId, Number(props.parentState.latitude).toFixed(6), Number(props.parentState.longitude).toFixed(6), 0, url, success, failiur, "");
  //     } else {
  //       let url = `?category_type=MARKET TRANSACTION`;
  //       props.getStateByRadiusUser(userId, Number(props.parentState.latitude).toFixed(6), Number(props.parentState.longitude).toFixed(6), 0, url, success, failiur, "");
  //     }
  //   })
  // }, []);

  const copyClipboard = (data) => {
    navigator.clipboard
      .writeText(data)
      .then(function () {
        toast.success("Copied!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      })
      .catch(function (err) {
        console.error("Error copying text: ", err);
      });
  };

  const popoverRight = (data) => (
    <Popover id="popover-positioned-right" title="Popover right">
      <div
        className="normal-text"
        style={{ height: "auto", width: 250, padding: 10 }}
      >
        {data}
      </div>
      <div style={{ borderBottom: "1px solid EBEBEB", width: "100%" }} />
      <div
        onClick={() => {
          copyClipboard(data);
        }}
        style={{
          padding: 10,
          color: "#033B6C",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {"Copy"}
      </div>
    </Popover>
  );

  const tstData2km = useMemo(() => {
    return props?.propertyData?.tst_0_2km;
  }, [swapFilter]);

  const tstData0_500m = useMemo(() => {
    return props?.propertyData?.tst_0_500m;
  }, [swapFilter]);

  const tstData2_5km = useMemo(() => {
    return props?.propertyData?.tst_2_5km;
  }, [swapFilter]);

  return (
    <div className="individual-form-container">
      <div className="custom-tabs-container">
        {tabs.map((md) => {
          return (
            <>
              <div
                onClick={() => {
                  swapFilterType(md.value);
                }}
                className={
                  swapFilter === md.value ? "custom-selected-tab" : "custom-tab"
                }
              >
                {swapFilter === md.value && <div className="heiglight" />}
                {md.label}
              </div>
            </>
          );
        })}
      </div>

      {/* Map start */}
      {swapFilter === "type1" && (
        <>
          <div className="map-text">
            <span className="normal-text ">Latitude :</span>
            <span className="lat-log-aligenemnt">
              {props.propertyData.latitude
                ? Number(props.propertyData.latitude).toFixed(5)
                : 0}
            </span>

            <span className="normal-text">Longitude :</span>
            <span style={{ marginLeft: 10 }}>
              {props.propertyData.longitude
                ? Number(props.propertyData.longitude).toFixed(5)
                : 0}
            </span>
          </div>
          <div className="map-height">
            <Suspense fallback={<div>Loading...</div>}>
              <MapComp
                coordinates={coordinates}
                markPropertyData={props?.propertyData}
              />
            </Suspense>
          </div>
        </>
      )}
      {/* Map End */}
      {/* Icici start */}
      {swapFilter === "type2" && (
        <div className="recent-transaction">
          {!props.isIciciLoading ? (
            <>
              <ul
                className="text-padding normal-text property-details-table"
                style={{ display: "flex", marginLeft: 20 }}
              >
                <div style={{ color: "#828282", paddingBottom: 10 }}>
                  <li>
                    <span className=" normal-text">{`Wt. Avg Land Rate/Sqft :`}</span>
                    <label className="normal-text">
                      {props.propertyData.icic_land_average_rate_0_2km
                        ? Math.round(
                          props.propertyData.icic_land_average_rate_0_2km,
                        )
                        : 0}
                    </label>
                  </li>
                  <li>
                    <label className=" normal-text">{`Wt. Avg Sale Rate/Sqft : ${props.propertyData.icic_sale_average_rate_0_2km
                        ? Math.round(
                          props.propertyData.icic_sale_average_rate_0_2km,
                        )
                        : 0
                      }`}</label>

                  </li>
                  <li>
                    
                  <label className=" normal-text">{`Wt. Avg Carpet Rate/Sqft : ${props.propertyData.icic_carpet_average_rate_0_2km
                        ? Math.round(
                          props.propertyData.icic_carpet_average_rate_0_2km,
                        )
                        : 0
                      }`}</label>
                  </li>
                </div>
              </ul>
              {!isEmpty(
                props?.propertyData?.sale_property_data_0_500m_list,
              ) && (
                  <CustomAccordian title="Sale Rate (0-500m)">
                    {/* <ul className="text-padding normal-text property-details-table" style={{ display: "flex", }}>
                <div style={{ color: '#828282', paddingBottom: 10 }}>
                  <li>
                    <span className=" normal-text">{`Wt. Avg Land Rate/Sqft :`}</span> <label className="normal-text"> {Math.round(props.propertyData.average_land_rate_2km)} </label>
                  </li>
                  <li>
                    <label className=" normal-text" >{`Wt. Avg Composite Rate/Sqft : ${Math.round(props.propertyData.average_sale_rate_2km)}`}</label>
                  </li>
                </div>
              </ul> */}
                    <CustomModal title="Sale Rate (0-500m)">
                      <div className="recent-transaction">
                        <div className="table-private-data-sub">
                          <table border="1" className="avm">
                            <thead className="sticky-head">
                              <tr>
                                <th>Property type</th>
                                <th>Unit type</th>
                                <th>Address</th>
                                <th>Land area</th>
                                <th>Land rate</th>
                                <th>Sale area</th>
                                <th>Sale rate</th>
                                <th>Date of transaction</th>
                                <th style={{ padding: 10 }}>Distance in Km</th>
                              </tr>
                            </thead>

                            {!isEmpty(
                              props?.propertyData?.sale_property_data_0_500m_list,
                            ) ? (
                              props?.propertyData.sale_property_data_0_500m_list
                                .sort(
                                  (a, b) =>
                                    [a.distance_in_km] - [b.distance_in_km],
                                )
                                .map((details) => {
                                  return (
                                    <tr>
                                      <td>{details.property_type || "NA"}</td>
                                      <td>{details.unit_type || "NA"}</td>
                                      <OverlayTrigger
                                        trigger="click"
                                        placement="right"
                                        overlay={popoverRight(details.address)}
                                      >
                                        <td style={{ cursor: "pointer" }}>
                                          {details.address}
                                        </td>
                                      </OverlayTrigger>
                                      <td
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 6,
                                        }}
                                      >
                                        {details.land_area || "NA"}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 6,
                                        }}
                                      >
                                        {Math.round(details.land_rate) || "NA"}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 6,
                                        }}
                                      >
                                        {details.sale_area || "NA"}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 6,
                                        }}
                                      >
                                        {Math.round(details.sale_rate) || "NA"}
                                      </td>
                                      <td>
                                        {moment(
                                          details.date_of_transaction,
                                          "YYYY-MM-DD",
                                        ).format("DD-MM-YYYY") || "NA"}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 6,
                                        }}
                                      >
                                        {details.distance_in_km || "NA"}
                                      </td>
                                    </tr>
                                  );
                                })
                            ) : (
                              <Empty numSpan={9} />
                            )}
                            <tbody></tbody>
                          </table>
                        </div>
                      </div>
                    </CustomModal>
                  </CustomAccordian>
                )}

              {!isEmpty(props?.propertyData?.sale_property_data_0_2km_list) && (
                <CustomAccordian title="Sale Rate (0-2Km)">
                  <CustomModal title="Sale Rate (0-2Km)">
                    <div className="recent-transaction">
                      <div className="table-private-data-sub">
                        <table border="1" className="avm">
                          <thead className="sticky-head">
                            <tr>
                              <th>Property type</th>
                              <th>Unit type</th>
                              <th>Address</th>
                              <th>Land area</th>
                              <th>Land rate</th>
                              <th>Sale area</th>
                              <th>Sale rate</th>
                              <th>Date of transaction</th>
                              <th style={{ padding: 10 }}>Distance in Km</th>
                            </tr>
                          </thead>

                          {!isEmpty(
                            props?.propertyData?.sale_property_data_0_2km_list,
                          ) ? (
                            props?.propertyData.sale_property_data_0_2km_list
                              .sort(
                                (a, b) =>
                                  [a.distance_in_km] - [b.distance_in_km],
                              )
                              .map((details) => {
                                return (
                                  <tr>
                                    <td>{details.property_type || "NA"}</td>
                                    <td>{details.unit_type || "NA"}</td>
                                    <OverlayTrigger
                                      trigger="click"
                                      placement="right"
                                      overlay={popoverRight(details.address)}
                                    >
                                      <td style={{ cursor: "pointer" }}>
                                        {details.address}
                                      </td>
                                    </OverlayTrigger>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.land_area || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {Math.round(details.land_rate) || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.sale_area || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {Math.round(details.sale_rate) || "NA"}
                                    </td>
                                    <td>
                                      {moment(
                                        details.date_of_transaction,
                                        "YYYY-MM-DD",
                                      ).format("DD-MM-YYYY") || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.distance_in_km || "NA"}
                                    </td>
                                  </tr>
                                );
                              })
                          ) : (
                            <Empty numSpan={9} />
                          )}
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                  </CustomModal>
                </CustomAccordian>
              )}
              {!isEmpty(props?.propertyData?.sale_property_data_2_5km_list) && (
                <CustomAccordian title="Sale Rate (2-5Km)">
                  <CustomModal title="Sale Rate (2-5Km)">
                    <div className="recent-transaction">
                      <div className="table-private-data-sub">
                        <table border="1" className="avm">
                          <thead className="sticky-head">
                            <tr>
                              <th>Property type</th>
                              <th>Unit type</th>
                              <th>Address</th>
                              <th>Land area</th>
                              <th>Land rate</th>
                              <th>Sale area</th>
                              <th>Sale rate</th>
                              <th>Date of transaction</th>
                              <th style={{ padding: 10 }}>Distance in Km</th>
                            </tr>
                          </thead>

                          {!isEmpty(
                            props?.propertyData?.sale_property_data_2_5km_list,
                          ) ? (
                            props?.propertyData.sale_property_data_2_5km_list
                              .sort(
                                (a, b) =>
                                  [a.distance_in_km] - [b.distance_in_km],
                              )
                              .map((details) => {
                                return (
                                  <tr>
                                    <td>{details.property_type || "NA"}</td>
                                    <td>{details.unit_type || "NA"}</td>
                                    <OverlayTrigger
                                      trigger="click"
                                      placement="right"
                                      overlay={popoverRight(details.address)}
                                    >
                                      <td style={{ cursor: "pointer" }}>
                                        {details.address}
                                      </td>
                                    </OverlayTrigger>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.land_area || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {Math.round(details.land_rate) || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.sale_area || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {Math.round(details.sale_rate) || "NA"}
                                    </td>
                                    <td>
                                      {moment(
                                        details.date_of_transaction,
                                        "YYYY-MM-DD",
                                      ).format("DD-MM-YYYY") || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.distance_in_km || "NA"}
                                    </td>
                                  </tr>
                                );
                              })
                          ) : (
                            <Empty numSpan={9} />
                          )}
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                  </CustomModal>
                </CustomAccordian>
              )}

              {!isEmpty(
                props?.propertyData?.land_property_data_0_500m_list,
              ) && (
                  <CustomAccordian title="Land Transactions (0-500m)">
                    <CustomModal title="Land Transactions (0-500m)">
                      <div className="recent-transaction">
                        <div className="table-private-data-sub">
                          <table border="1" className="avm">
                            <thead className="sticky-head">
                              <tr>
                                <th>Property type</th>
                                <th>Unit type</th>
                                <th>Address</th>
                                <th>Land area</th>
                                <th>Land rate</th>
                                <th>Sale area</th>
                                <th>Sale rate</th>
                                <th>Date of transaction</th>
                                <th style={{ padding: 10 }}>Distance in Km</th>
                              </tr>
                            </thead>

                            {!isEmpty(
                              props?.propertyData?.land_property_data_0_500m_list,
                            ) ? (
                              props?.propertyData.land_property_data_0_500m_list
                                .sort(
                                  (a, b) =>
                                    [a.distance_in_km] - [b.distance_in_km],
                                )
                                .map((details) => {
                                  return (
                                    <tr>
                                      <td>{details.property_type || "NA"}</td>
                                      <td>{details.unit_type || "NA"}</td>
                                      <OverlayTrigger
                                        trigger="click"
                                        placement="right"
                                        overlay={popoverRight(details.address)}
                                      >
                                        <td style={{ cursor: "pointer" }}>
                                          {details.address}
                                        </td>
                                      </OverlayTrigger>
                                      <td
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 6,
                                        }}
                                      >
                                        {details.land_area || "NA"}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 6,
                                        }}
                                      >
                                        {Math.round(details.land_rate) || "NA"}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 6,
                                        }}
                                      >
                                        {details.sale_area || "NA"}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 6,
                                        }}
                                      >
                                        {Math.round(details.sale_rate) || "NA"}
                                      </td>
                                      <td>
                                        {moment(
                                          details.date_of_transaction,
                                          "YYYY-MM-DD",
                                        ).format("DD-MM-YYYY") || "NA"}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 6,
                                        }}
                                      >
                                        {details.distance_in_km || "NA"}
                                      </td>
                                    </tr>
                                  );
                                })
                            ) : (
                              <Empty numSpan={9} />
                            )}
                            <tbody></tbody>
                          </table>
                        </div>
                      </div>
                    </CustomModal>
                  </CustomAccordian>
                )}
              {!isEmpty(props?.propertyData?.land_property_data_0_2km_list) && (
                <CustomAccordian title="Land Transactions (0-2Km)">
                  <CustomModal title="Land Transactions (0-2Km)">
                    <div className="recent-transaction">
                      <div className="table-private-data-sub">
                        <table border="1" className="avm">
                          <thead className="sticky-head">
                            <tr>
                              <th>Property type</th>
                              <th>Unit type</th>
                              <th>Address</th>
                              <th>Land area</th>
                              <th>Land rate</th>
                              <th>Sale area</th>
                              <th>Sale rate</th>
                              <th>Date of transaction</th>
                              <th style={{ padding: 10 }}>Distance in Km</th>
                            </tr>
                          </thead>

                          {!isEmpty(
                            props?.propertyData?.land_property_data_0_2km_list,
                          ) ? (
                            props?.propertyData.land_property_data_0_2km_list
                              .sort(
                                (a, b) =>
                                  [a.distance_in_km] - [b.distance_in_km],
                              )
                              .map((details) => {
                                return (
                                  <tr>
                                    <td>{details.property_type || "NA"}</td>
                                    <td>{details.unit_type || "NA"}</td>
                                    <OverlayTrigger
                                      trigger="click"
                                      placement="right"
                                      overlay={popoverRight(details.address)}
                                    >
                                      <td style={{ cursor: "pointer" }}>
                                        {details.address}
                                      </td>
                                    </OverlayTrigger>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.land_area || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {Math.round(details.land_rate) || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.sale_area || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {Math.round(details.sale_rate) || "NA"}
                                    </td>
                                    <td>
                                      {moment(
                                        details.date_of_transaction,
                                        "YYYY-MM-DD",
                                      ).format("DD-MM-YYYY") || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.distance_in_km || "NA"}
                                    </td>
                                  </tr>
                                );
                              })
                          ) : (
                            <Empty numSpan={9} />
                          )}
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                  </CustomModal>
                </CustomAccordian>
              )}
              {!isEmpty(props?.propertyData?.land_property_data_2_5km_list) && (
                <CustomAccordian title="Land Transactions (2-5Km)">
                  <CustomModal title="Recent transactions (2-5Km)">
                    <div className="recent-transaction">
                      <div className="table-private-data-sub">
                        <table border="1" className="avm">
                          <thead className="sticky-head">
                            <tr>
                              <th>Property type</th>
                              <th>Unit type</th>
                              <th>Address</th>
                              <th>Land area</th>
                              <th>Land rate</th>
                              <th>Sale area</th>
                              <th>Sale rate</th>
                              <th>Date of transaction</th>
                              <th style={{ padding: 10 }}>Distance in Km</th>
                            </tr>
                          </thead>

                          {!isEmpty(
                            props?.propertyData?.land_property_data_2_5km_list,
                          ) ? (
                            props?.propertyData.land_property_data_2_5km_list
                              .sort(
                                (a, b) =>
                                  [a.distance_in_km] - [b.distance_in_km],
                              )
                              .map((details) => {
                                return (
                                  <tr>
                                    <td>{details.property_type || "NA"}</td>
                                    <td>{details.unit_type || "NA"}</td>
                                    <OverlayTrigger
                                      trigger="click"
                                      placement="right"
                                      overlay={popoverRight(details.address)}
                                    >
                                      <td style={{ cursor: "pointer" }}>
                                        {details.address}
                                      </td>
                                    </OverlayTrigger>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.land_area || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {Math.round(details.land_rate) || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.sale_area || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {Math.round(details.sale_rate) || "NA"}
                                    </td>
                                    <td>
                                      {moment(
                                        details.date_of_transaction,
                                        "YYYY-MM-DD",
                                      ).format("DD-MM-YYYY") || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.distance_in_km || "NA"}
                                    </td>
                                  </tr>
                                );
                              })
                          ) : (
                            <Empty numSpan={9} />
                          )}
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                  </CustomModal>
                </CustomAccordian>
              )}

              {!isEmpty(
                props?.propertyData?.carpet_property_data_0_500m_list,
              ) && (
                  <CustomAccordian title="Carpet Rate (0-500m)">
                    <CustomModal title="Carpet Rate (0-500m)">
                      <div className="recent-transaction">
                        <div className="table-private-data-sub">
                          <table border="1" className="avm">
                            <thead className="sticky-head">
                              <tr>
                                <th>Property type</th>
                                <th>Unit type</th>
                                <th>Address</th>
                                <th>Latitude</th>
                                <th>longitude</th>
                                <th>Carpet Rate</th>
                                <th>Carpet Area</th>
                                <th>Age</th>
                                <th>Date of transaction</th>
                                <th style={{ padding: 10 }}>Distance in Km</th>
                              </tr>
                            </thead>

                            {!isEmpty(
                              props?.propertyData?.carpet_property_data_0_500m_list,
                            ) ? (
                              props?.propertyData.carpet_property_data_0_500m_list
                                .sort(
                                  (a, b) =>
                                    [a.distance_in_km] - [b.distance_in_km],
                                )
                                .map((details) => {
                                  return (
                                    <tr>
                                      <td>{details.property_type || "NA"}</td>
                                      <td>{details.unit_type || "NA"}</td>
                                      <OverlayTrigger
                                        trigger="click"
                                        placement="right"
                                        overlay={popoverRight(details.address)}
                                      >
                                        <td style={{ cursor: "pointer" }}>
                                          {details.address}
                                        </td>
                                      </OverlayTrigger>
                                      <td
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 6,
                                        }}
                                      >
                                        {details.latitude || "NA"}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 6,
                                        }}
                                      >
                                        {Math.round(details.longitude) || "NA"}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 6,
                                        }}
                                      >
                                        {details.carpet_rate || "NA"}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 6,
                                        }}
                                      >
                                        {Math.round(details.carpet_area) || "NA"}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 6,
                                        }}
                                      >
                                        {Math.round(details.age) || "NA"}
                                      </td>
                                      <td>
                                        {moment(
                                          details.date_of_transaction,
                                          "YYYY-MM-DD",
                                        ).format("DD-MM-YYYY") || "NA"}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 6,
                                        }}
                                      >
                                        {details.distance_in_km || "NA"}
                                      </td>
                                    </tr>
                                  );
                                })
                            ) : (
                              <Empty numSpan={9} />
                            )}
                            <tbody></tbody>
                          </table>
                        </div>
                      </div>
                    </CustomModal>
                  </CustomAccordian>
                )}
              {!isEmpty(props?.propertyData?.carpet_property_data_0_2km_list) && (
                <CustomAccordian title="Carpet Rate (0-2Km)">
                  <CustomModal title="Carpet Rate (0-2Km)">
                    <div className="recent-transaction">
                      <div className="table-private-data-sub">
                        <table border="1" className="avm">
                          <thead className="sticky-head">
                            <tr>
                              <th>Property type</th>
                              <th>Unit type</th>
                              <th>Address</th>
                              <th>Latitude</th>
                              <th>longitude</th>
                              <th>Carpet Rate</th>
                              <th>Carpet Area</th>
                              <th>Age</th>
                              <th>Date of transaction</th>
                              <th style={{ padding: 10 }}>Distance in Km</th>
                            </tr>
                          </thead>

                          {!isEmpty(
                            props?.propertyData?.carpet_property_data_0_2km_list,
                          ) ? (
                            props?.propertyData.carpet_property_data_0_2km_list
                              .sort(
                                (a, b) =>
                                  [a.distance_in_km] - [b.distance_in_km],
                              )
                              .map((details) => {
                                return (
                                  <tr>
                                    <td>{details.property_type || "NA"}</td>
                                    <td>{details.unit_type || "NA"}</td>
                                    <OverlayTrigger
                                      trigger="click"
                                      placement="right"
                                      overlay={popoverRight(details.address)}
                                    >
                                      <td style={{ cursor: "pointer" }}>
                                        {details.address}
                                      </td>
                                    </OverlayTrigger>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.latitude || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {Math.round(details.longitude) || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.carpet_rate || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {Math.round(details.carpet_area) || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {Math.round(details.age) || "NA"}
                                    </td>
                                    <td>
                                      {moment(
                                        details.date_of_transaction,
                                        "YYYY-MM-DD",
                                      ).format("DD-MM-YYYY") || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.distance_in_km || "NA"}
                                    </td>
                                  </tr>
                                );
                              })
                          ) : (
                            <Empty numSpan={9} />
                          )}
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                  </CustomModal>
                </CustomAccordian>
              )}
              {!isEmpty(props?.propertyData?.carpet_property_data_2_5km_list) && (
                <CustomAccordian title="Carpet Rate (2-5Km)">
                  <CustomModal title="Carpet Rate (2-5Km)">
                    <div className="recent-transaction">
                      <div className="table-private-data-sub">
                        <table border="1" className="avm">
                          <thead className="sticky-head">
                            <tr>
                              <th>Property type</th>
                              <th>Unit type</th>
                              <th>Address</th>
                              <th>Latitude</th>
                              <th>longitude</th>
                              <th>Carpet Rate</th>
                              <th>Carpet Area</th>
                              <th>Age</th>
                              <th>Date of transaction</th>
                              <th style={{ padding: 10 }}>Distance in Km</th>
                            </tr>
                          </thead>

                          {!isEmpty(
                            props?.propertyData?.carpet_property_data_2_5km_list,
                          ) ? (
                            props?.propertyData.carpet_property_data_2_5km_list
                              .sort(
                                (a, b) =>
                                  [a.distance_in_km] - [b.distance_in_km],
                              )
                              .map((details) => {
                                return (
                                  <tr>
                                    <td>{details.property_type || "NA"}</td>
                                    <td>{details.unit_type || "NA"}</td>
                                    <OverlayTrigger
                                      trigger="click"
                                      placement="right"
                                      overlay={popoverRight(details.address)}
                                    >
                                      <td style={{ cursor: "pointer" }}>
                                        {details.address}
                                      </td>
                                    </OverlayTrigger>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.latitude || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {Math.round(details.longitude) || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.carpet_rate || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {Math.round(details.carpet_area) || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {Math.round(details.age) || "NA"}
                                    </td>
                                    <td>
                                      {moment(
                                        details.date_of_transaction,
                                        "YYYY-MM-DD",
                                      ).format("DD-MM-YYYY") || "NA"}
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "end",
                                        paddingRight: 6,
                                      }}
                                    >
                                      {details.distance_in_km || "NA"}
                                    </td>
                                  </tr>
                                );
                              })
                          ) : (
                            <Empty numSpan={9} />
                          )}
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                  </CustomModal>
                </CustomAccordian>
              )}
            </>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="loader-circle-v1" />
            </div>
          )}
        </div>
      )}
      {/* Icici End */}
      {/* External vendor start */}
      {swapFilter === "type3" && (
        <div className="recent-transaction">
          <div style={{ overflow: "auto", position: "relative" }}>
            {!!props.propEdge && <PropEdge data={props.propEdge} {...props} />}
          </div>
        </div>
      )}
      {/* External vendor End */}
      {/* Property Portals start */}
      {swapFilter === "type4" && (
        <div className="recent-transaction">
          <ul
            className="text-padding normal-text property-details-table"
            style={{ display: "flex", marginLeft: 20 }}
          >
            <div style={{ color: "#828282", paddingBottom: 10 }}>
              <li>
                <span className=" normal-text">{`Wt. Avg Land Rate/Sqft :`}</span>
                <label className="normal-text">
                  {props.propertyData.tst_average_rate_0_2km
                    ? Math.round(props.propertyData.tst_average_rate_0_2km)
                    : 0}
                </label>
              </li>
              <li>
                <label className=" normal-text">{`Wt. Avg Composite Rate/Sqft : ${props.propertyData.sale_tst_average_rate_0_2km
                    ? Math.round(props.propertyData.sale_tst_average_rate_0_2km)
                    : 0
                  }`}</label>
              </li>
            </div>
          </ul>
          {!props.isTstLoading ? (
            <>
              {!isEmpty(props?.propertyData?.sale_tst_0_500m) && (
                <CustomAccordian
                  background={true}
                  title="Composite Rate (0-500m)"
                >
                  <CustomModal title={"Composite Rate (0-500m)"}>
                    <div className="table-private">
                      <table
                        className="avm"
                        border="1"
                        id="prop-recent-transactions"
                      >
                        <thead className="sticky-head">
                          <tr>
                            <th>Sr No</th>
                            <th>locality</th>
                            <th>property Type</th>
                            <th>Total Amount </th>
                            <th>Rate Per SQFT </th>
                            <th>Salable Area In SQFT</th>
                            <th>unit Details </th>
                            <th>Name Of Project</th>
                            <th>Address</th>
                            <th>Age Of the property</th>
                            <th>city</th>
                            <th>State</th>
                            {/* <th>Data Provider</th> */}
                            <th>Date of Listing </th>
                          </tr>
                        </thead>

                        {!!props?.propertyData?.sale_tst_0_500m &&
                          props?.propertyData.sale_tst_0_500m.length > 0 ? (
                          props?.propertyData.sale_tst_0_500m.map(
                            (details, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{details.locality || "NA"}</td>
                                  <td>{details.propertyType || "NA"}</td>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      paddingRight: 6,
                                    }}
                                  >
                                    {details.totalAmount || "NA"}
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      paddingRight: 6,
                                    }}
                                  >
                                    {details.ratePerSQFT || "NA"}
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      paddingRight: 6,
                                    }}
                                  >
                                    {details.salableAreaInSQFT || "NA"}
                                  </td>
                                  <td>{details.unitDetails || "NA"}</td>
                                  <td>{details.nameOfProject || "NA"}</td>
                                  <td>{details.address || "NA"}</td>
                                  <td>{details.ageOfConstruction || "NA"}</td>
                                  <td>{details.city || "NA"}</td>
                                  <td>{details.state || "NA"}</td>
                                  {/* <td>{details.dataProvider || "NA"}</td> */}
                                  <td>{details.dateOfListing || "NA"}</td>
                                </tr>
                              );
                            },
                          )
                        ) : (
                          <Empty numSpan={14} />
                        )}
                        <tbody></tbody>
                      </table>
                    </div>
                  </CustomModal>
                </CustomAccordian>
              )}
              {!isEmpty(props?.propertyData?.sale_tst_0_2km) && (
                <CustomAccordian
                  background={true}
                  title="Composite Rate (0-2Km)"
                >
                  <CustomModal title={"Composite Rate (0-2Km)"}>
                    <div className="table-private">
                      <table
                        className="avm"
                        border="1"
                        id="prop-recent-transactions"
                      >
                        <thead className="sticky-head">
                          <tr>
                            <th>Sr No</th>
                            <th>locality</th>
                            <th>property Type</th>
                            <th>Total Amount </th>
                            <th>Rate Per SQFT </th>
                            <th>Salable Area In SQFT</th>
                            <th>unit Details </th>
                            <th>Name Of Project</th>
                            <th>Address</th>
                            <th>Age Of the property</th>
                            <th>city</th>
                            <th>State</th>
                            {/* <th>Data Provider</th> */}
                            <th>Date of Listing </th>
                          </tr>
                        </thead>

                        {!!props?.propertyData?.sale_tst_0_2km &&
                          props?.propertyData.sale_tst_0_2km.length > 0 ? (
                          props?.propertyData.sale_tst_0_2km.map(
                            (details, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{details.locality || "NA"}</td>
                                  <td>{details.propertyType || "NA"}</td>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      paddingRight: 6,
                                    }}
                                  >
                                    {details.totalAmount || "NA"}
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      paddingRight: 6,
                                    }}
                                  >
                                    {details.ratePerSQFT || "NA"}
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      paddingRight: 6,
                                    }}
                                  >
                                    {details.salableAreaInSQFT || "NA"}
                                  </td>
                                  <td>{details.unitDetails || "NA"}</td>
                                  <td>{details.nameOfProject || "NA"}</td>
                                  <td>{details.address || "NA"}</td>
                                  <td>{details.ageOfConstruction || "NA"}</td>
                                  <td>{details.city || "NA"}</td>
                                  <td>{details.state || "NA"}</td>
                                  {/* <td>{details.dataProvider || "NA"}</td> */}
                                  <td>{details.dateOfListing || "NA"}</td>
                                </tr>
                              );
                            },
                          )
                        ) : (
                          <Empty numSpan={14} />
                        )}
                        <tbody></tbody>
                      </table>
                    </div>
                  </CustomModal>
                </CustomAccordian>
              )}

              {!isEmpty(props?.propertyData.sale_tst_2_5km) && (
                <CustomAccordian
                  background={true}
                  title="Composite Rate (2-5Km)"
                >
                  <CustomModal title={"Composite Rate (2-5Km)"}>
                    <div className="table-private">
                      <table
                        className="avm"
                        border="1"
                        id="prop-recent-transactions"
                      >
                        <thead className="sticky-head">
                          <tr>
                            <th>Sr No</th>
                            <th>locality</th>
                            <th>property Type</th>
                            <th>Total Amount </th>
                            <th>Rate Per SQFT </th>
                            <th>Salable Area In SQFT</th>
                            <th>unit Details </th>
                            <th>Name Of Project</th>
                            <th>Address</th>
                            <th>Age Of the property</th>
                            <th>city</th>
                            <th>State</th>
                            {/* <th>Data Provider</th> */}
                            <th>Date of Listing </th>
                          </tr>
                        </thead>

                        {props?.propertyData.sale_tst_2_5km &&
                          props?.propertyData.sale_tst_2_5km.length > 0 ? (
                          props?.propertyData.sale_tst_2_5km.map(
                            (details, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{details.locality || "NA"}</td>
                                  <td>{details.propertyType || "NA"}</td>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      paddingRight: 6,
                                    }}
                                  >
                                    {details.totalAmount || "NA"}
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      paddingRight: 6,
                                    }}
                                  >
                                    {details.ratePerSQFT || "NA"}
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      paddingRight: 6,
                                    }}
                                  >
                                    {details.salableAreaInSQFT || "NA"}
                                  </td>
                                  <td>{details.unitDetails || "NA"}</td>
                                  <td>{details.nameOfProject || "NA"}</td>
                                  <td>{details.address || "NA"}</td>
                                  <td>{details.ageOfConstruction || "NA"}</td>
                                  <td>{details.city || "NA"}</td>
                                  <td>{details.state || "NA"}</td>
                                  {/* <td>{details.dataProvider || "NA"}</td> */}
                                  <td>{details.dateOfListing || "NA"}</td>
                                </tr>
                              );
                            },
                          )
                        ) : (
                          <Empty numSpan={14} />
                        )}
                        <tbody></tbody>
                      </table>
                    </div>
                  </CustomModal>
                </CustomAccordian>
              )}

              {!isEmpty(tstData0_500m) && (
                <CustomAccordian
                  background={true}
                  title="Land Transactions (0-500m)"
                >
                  <CustomModal title={"Land Transactions (0-500m)"}>
                    <div className="table-private">
                      <table
                        className="avm"
                        border="1"
                        id="prop-recent-transactions"
                      >
                        <thead className="sticky-head">
                          <tr>
                            <th>Sr No</th>
                            <th>locality</th>
                            <th>property Type</th>
                            <th>Total Amount </th>
                            <th>Rate Per SQFT </th>
                            <th>Salable Area In SQFT</th>
                            <th>unit Details </th>
                            <th>Name Of Project</th>
                            <th>Address</th>
                            <th>Age Of the property</th>
                            <th>city</th>
                            <th>State</th>
                            {/* <th>Data Provider</th> */}
                            <th>Date of Listing </th>
                          </tr>
                        </thead>

                        {!!tstData0_500m && tstData0_500m.length > 0 ? (
                          tstData0_500m.map((details, index) => {
                            return (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{details.locality || "NA"}</td>
                                <td>{details.propertyType || "NA"}</td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {details.totalAmount || "NA"}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {details.ratePerSQFT || "NA"}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {details.salableAreaInSQFT || "NA"}
                                </td>
                                <td>{details.unitDetails || "NA"}</td>
                                <td>{details.nameOfProject || "NA"}</td>
                                <td>{details.address || "NA"}</td>
                                <td>{details.ageOfConstruction || "NA"}</td>
                                <td>{details.city || "NA"}</td>
                                <td>{details.state || "NA"}</td>
                                {/* <td>{details.dataProvider || "NA"}</td> */}
                                <td>{details.dateOfListing || "NA"}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <Empty numSpan={14} />
                        )}
                        <tbody></tbody>
                      </table>
                    </div>
                  </CustomModal>
                </CustomAccordian>
              )}

              {!isEmpty(tstData2km) && (
                <CustomAccordian
                  background={true}
                  title="Land Transactions (0-2Km)"
                >
                  <CustomModal title={"Transactions (0-2Km)"}>
                    <div className="table-private">
                      <table
                        className="avm"
                        border="1"
                        id="prop-recent-transactions"
                      >
                        <thead className="sticky-head">
                          <tr>
                            <th>Sr No</th>
                            <th>locality</th>
                            <th>property Type</th>
                            <th>Total Amount </th>
                            <th>Rate Per SQFT </th>
                            <th>Salable Area In SQFT</th>
                            <th>unit Details </th>
                            <th>Name Of Project</th>
                            <th>Address</th>
                            <th>Age Of the property</th>
                            <th>city</th>
                            <th>State</th>
                            {/* <th>Data Provider</th> */}
                            <th>Date of Listing </th>
                          </tr>
                        </thead>

                        {!!tstData2km && tstData2km.length > 0 ? (
                          tstData2km.map((details, index) => {
                            return (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{details.locality || "NA"}</td>
                                <td>{details.propertyType || "NA"}</td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {details.totalAmount || "NA"}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {details.ratePerSQFT || "NA"}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {details.salableAreaInSQFT || "NA"}
                                </td>
                                <td>{details.unitDetails || "NA"}</td>
                                <td>{details.nameOfProject || "NA"}</td>
                                <td>{details.address || "NA"}</td>
                                <td>{details.ageOfConstruction || "NA"}</td>
                                <td>{details.city || "NA"}</td>
                                <td>{details.state || "NA"}</td>
                                {/* <td>{details.dataProvider || "NA"}</td> */}
                                <td>{details.dateOfListing || "NA"}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <Empty numSpan={14} />
                        )}
                        <tbody></tbody>
                      </table>
                    </div>
                  </CustomModal>
                </CustomAccordian>
              )}

              {!isEmpty(tstData2_5km) && (
                <CustomAccordian
                  background={true}
                  title="Land Transactions (2-5Km)"
                >
                  <CustomModal title={"Transactions (2-5Km)"}>
                    <div className="table-private">
                      <table
                        className="avm"
                        border="1"
                        id="prop-recent-transactions"
                      >
                        <thead className="sticky-head">
                          <tr>
                            <th>Sr No</th>
                            <th>locality</th>
                            <th>property Type</th>
                            <th>Total Amount </th>
                            <th>Rate Per SQFT </th>
                            <th>Salable Area In SQFT</th>
                            <th>unit Details </th>
                            <th>Name Of Project</th>
                            <th>Address</th>
                            <th>Age Of the property</th>
                            <th>city</th>
                            <th>State</th>
                            {/* <th>Data Provider</th> */}
                            <th>Date of Listing </th>
                          </tr>
                        </thead>

                        {tstData2_5km && tstData2_5km.length > 0 ? (
                          tstData2_5km.map((details, index) => {
                            return (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{details.locality || "NA"}</td>
                                <td>{details.propertyType || "NA"}</td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {details.totalAmount || "NA"}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {details.ratePerSQFT || "NA"}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {details.salableAreaInSQFT || "NA"}
                                </td>
                                <td>{details.unitDetails || "NA"}</td>
                                <td>{details.nameOfProject || "NA"}</td>
                                <td>{details.address || "NA"}</td>
                                <td>{details.ageOfConstruction || "NA"}</td>
                                <td>{details.city || "NA"}</td>
                                <td>{details.state || "NA"}</td>
                                {/* <td>{details.dataProvider || "NA"}</td> */}
                                <td>{details.dateOfListing || "NA"}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <Empty numSpan={14} />
                        )}
                        <tbody></tbody>
                      </table>
                    </div>
                  </CustomModal>
                </CustomAccordian>
              )}
            </>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="loader-circle-v1" />
            </div>
          )}
        </div>
      )}
      {/* Property Portals End */}
      {/* Market Transaction start */}
      {swapFilter === "type5" && (
        <div className="recent-transaction">
          <ul
            className="text-padding normal-text property-details-table"
            style={{ display: "flex", marginLeft: 20 }}
          >
            <div style={{ color: "#828282", paddingBottom: 10 }}>
              <li>
                <span className=" normal-text">{`Wt. Avg Land Rate/Sqft :`}</span>
                <label className="normal-text">
                  {props.propertyData.market_land_average_rate
                    ? Math.round(props.propertyData.market_land_average_rate)
                    : 0}
                </label>
              </li>
              <li>
                <label className=" normal-text">{`Wt. Avg Composite Rate/Sqft : ${props.propertyData.market_sale_average_rate
                    ? Math.round(props.propertyData.market_sale_average_rate)
                    : 0
                  }`}</label>
              </li>
            </div>
          </ul>
          {!props.isMarketLoading ? (
            <>
              {!isEmpty(
                props?.propertyData?.sale_market_transaction_0_500m_list,
              ) && (
                  <CustomAccordian
                    background={true}
                    title="Composite Rate (0-500m)"
                  >
                    <CustomModal title="Composite Rate (0-500m)">
                      <div className="recent-transaction">
                        <div className="table-private-data-sub">
                          <table border="1" className="avm">
                            <thead className="sticky-head">
                              <tr>
                                {keys(marketData).map((value) => {
                                  return (
                                    <th className="width100">
                                      {marketData[`${value}`]}
                                    </th>
                                  );
                                })}
                              </tr>
                            </thead>

                            {props?.propertyData
                              ?.sale_market_transaction_0_500m_list &&
                              props?.propertyData
                                .sale_market_transaction_0_500m_list.length > 0 ? (
                              props?.propertyData.sale_market_transaction_0_500m_list.map(
                                (details) => {
                                  return (
                                    <tr>
                                      {keys(marketData).map((value) => {
                                        return (
                                          <td
                                            className="width100"
                                            style={
                                              value === "pincode" ||
                                                value === "land_area" ||
                                                value === "land_rate" ||
                                                value === "sbua_area" ||
                                                value === "sbua_rate" ||
                                                value === "bua_area" ||
                                                value === "bua_rate" ||
                                                value === "carpet_area" ||
                                                value === "carpet_rate"
                                                ? {
                                                  textAlign: "end",
                                                  paddingRight: 6,
                                                }
                                                : {}
                                            }
                                          >
                                            {details[`${value}`]}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  );
                                },
                              )
                            ) : (
                              <Empty numSpan={18} />
                            )}
                            <tbody></tbody>
                          </table>
                        </div>
                      </div>
                    </CustomModal>
                  </CustomAccordian>
                )}

              {!isEmpty(
                props?.propertyData?.sale_market_transaction_0_2km_list,
              ) && (
                  <CustomAccordian
                    background={true}
                    title="Composite Rate (0-2Km)"
                  >
                    <CustomModal title="Composite Rate (0-2Km)">
                      <div className="recent-transaction">
                        <div className="table-private-data-sub">
                          <table border="1" className="avm">
                            <thead className="sticky-head">
                              <tr>
                                {keys(marketData).map((value) => {
                                  return (
                                    <th className="width100">
                                      {marketData[`${value}`]}
                                    </th>
                                  );
                                })}
                              </tr>
                            </thead>

                            {!isEmpty(
                              props?.propertyData
                                ?.sale_market_transaction_0_2km_list,
                            ) ? (
                              props?.propertyData.sale_market_transaction_0_2km_list.map(
                                (details) => {
                                  return (
                                    <tr>
                                      {keys(marketData).map((value) => {
                                        return (
                                          <td className="width100">
                                            {details[`${value}`]}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  );
                                },
                              )
                            ) : (
                              <Empty numSpan={18} />
                            )}
                            <tbody></tbody>
                          </table>
                        </div>
                      </div>
                    </CustomModal>
                  </CustomAccordian>
                )}

              {!isEmpty(
                props?.propertyData?.sale_market_transaction_2_5km_list,
              ) && (
                  <CustomAccordian
                    background={true}
                    title="Composite Rate (2-5Km)"
                  >
                    <CustomModal title="Composite Rate (2-5Km)">
                      <div className="recent-transaction">
                        <div className="table-private-data-sub">
                          <table border="1" className="avm">
                            <thead className="sticky-head">
                              <tr>
                                {keys(marketData).map((value) => {
                                  return (
                                    <th className="width100">
                                      {marketData[`${value}`]}
                                    </th>
                                  );
                                })}
                              </tr>
                            </thead>

                            {!isEmpty(
                              props?.propertyData
                                ?.sale_market_transaction_2_5km_list,
                            ) ? (
                              props?.propertyData.sale_market_transaction_2_5km_list.map(
                                (details) => {
                                  return (
                                    <tr>
                                      {keys(marketData).map((value) => {
                                        return (
                                          <td className="width100">
                                            {details[`${value}`]}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  );
                                },
                              )
                            ) : (
                              <Empty numSpan={18} />
                            )}
                            <tbody></tbody>
                          </table>
                        </div>
                      </div>
                    </CustomModal>
                  </CustomAccordian>
                )}

              {!isEmpty(
                props?.propertyData?.land_market_transaction_0_500m_list,
              ) && (
                  <CustomAccordian
                    background={true}
                    title="Land Transactions (0-500m)"
                  >
                    <CustomModal title="Land Transactions (0-500m)">
                      <div className="recent-transaction">
                        <div className="table-private-data-sub">
                          <table border="1" className="avm">
                            <thead className="sticky-head">
                              <tr>
                                {keys(marketData).map((value) => {
                                  return (
                                    <th className="width100">
                                      {marketData[`${value}`]}
                                    </th>
                                  );
                                })}
                              </tr>
                            </thead>

                            {props?.propertyData
                              ?.land_market_transaction_0_500m_list &&
                              props?.propertyData
                                .land_market_transaction_0_500m_list.length > 0 ? (
                              props?.propertyData.land_market_transaction_0_500m_list.map(
                                (details) => {
                                  return (
                                    <tr>
                                      {keys(marketData).map((value) => {
                                        return (
                                          <td className="width100">
                                            {details[`${value}`]}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  );
                                },
                              )
                            ) : (
                              <Empty numSpan={18} />
                            )}
                            <tbody></tbody>
                          </table>
                        </div>
                      </div>
                    </CustomModal>
                  </CustomAccordian>
                )}

              {!isEmpty(
                props?.propertyData?.land_market_transaction_0_2km_list,
              ) && (
                  <CustomAccordian
                    background={true}
                    title="Land Transactions (0-2Km)"
                  >
                    <CustomModal title="Land Transactions (0-2Km)">
                      <div className="recent-transaction">
                        <div className="table-private-data-sub">
                          <table border="1" className="avm">
                            <thead className="sticky-head">
                              <tr>
                                {keys(marketData).map((value) => {
                                  return (
                                    <th className="width100">
                                      {marketData[`${value}`]}
                                    </th>
                                  );
                                })}
                              </tr>
                            </thead>

                            {props?.propertyData
                              ?.land_market_transaction_0_2km_list &&
                              props?.propertyData.land_market_transaction_0_2km_list
                                .length > 0 ? (
                              props?.propertyData.land_market_transaction_0_2km_list.map(
                                (details) => {
                                  return (
                                    <tr>
                                      {keys(marketData).map((value) => {
                                        return (
                                          <td className="width100">
                                            {details[`${value}`]}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  );
                                },
                              )
                            ) : (
                              <Empty numSpan={18} />
                            )}
                            <tbody></tbody>
                          </table>
                        </div>
                      </div>
                    </CustomModal>
                  </CustomAccordian>
                )}

              {!isEmpty(
                props?.propertyData?.land_market_transaction_2_5km_list,
              ) && (
                  <CustomAccordian
                    background={true}
                    title="Land Transactions (2-5Km)"
                  >
                    <CustomModal title="Market transactions (2-5Km)">
                      <div className="recent-transaction">
                        <div className="table-private-data-sub">
                          <table border="1" className="avm">
                            <thead className="sticky-head">
                              <tr>
                                {keys(marketData).map((value) => {
                                  return (
                                    <th className="width100">
                                      {marketData[`${value}`]}
                                    </th>
                                  );
                                })}
                              </tr>
                            </thead>

                            {props?.propertyData
                              ?.land_market_transaction_2_5km_list &&
                              props?.propertyData.land_market_transaction_2_5km_list
                                .length > 0 ? (
                              props?.propertyData.land_market_transaction_2_5km_list.map(
                                (details) => {
                                  return (
                                    <tr>
                                      {keys(marketData).map((value) => {
                                        return (
                                          <td className="width100">
                                            {details[`${value}`]}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  );
                                },
                              )
                            ) : (
                              <Empty numSpan={18} />
                            )}
                            <tbody></tbody>
                          </table>
                        </div>
                      </div>
                    </CustomModal>
                  </CustomAccordian>
                )}
            </>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="loader-circle-v1" />
            </div>
          )}
        </div>
      )}
      {/* Market Transaction End */}
    </div>
  );
};

const mapStateToProps = (state) => ({
  serveyReportData: {},
  isIciciLoading: state.stateRequested.isIciciLoading,
  isTstLoading: state.stateRequested.isTstLoading,
  isMarketLoading: state.stateRequested.isMarketLoading,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getStateByRadiusUser: getStateByRadiusUser,
      valuationStateUser: valuationStateUser,
    },
    dispatch,
  );
}

const enhance = connect(mapStateToProps, mapDispatchToProps);
export default enhance(Individuals);
