import React, { useRef, useState } from "react";
import "../property-report-pdf/index.css";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet.gridlayer.googlemutant";
import $ from "jquery";
import "leaflet/dist/leaflet.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { _getStorageValue } from "../../comman/localStorage";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "../header";
import html2pdf from "html2pdf.js/dist/html2pdf.min";
import * as htmlPdf from "html-pdf-chrome";
import { Bar } from "react-chartjs-2";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

import { compose } from "redux";

import "chartjs-plugin-datalabels";
import Loader from "../loader";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import { useReactToPrint } from "react-to-print";
import { apiCall } from "../../comman/connect";
import {
  serveyReportDataUrl,
  serveyReportGenUrl,
  serveyReportRequestUrl,
  serveyAESKey,
} from "../../comman/urls";
import { isEmpty } from "lodash";
import CustomAccordian from "./accordian";
import CustomModal from "./modalWindow";

const Empty = ({ numSpan }) => {
  return (
    <tr>
      <td colspan={numSpan}>No data available </td>
    </tr>
  );
};

const PropEdge = (props) => {
  const pdfExports = useRef(null);

  return (
    <div ref={pdfExports} className="propeye-report-section">
      <div>
        <div className="propeye-report-description">
          <label
            style={{ padding: 20 }}
            className="common-title-details title-font"
          >
            Price Analytics Summary
          </label>
          <div style={{ paddingLeft: 20 }} className="icic-right-background">
            <ul
              className="property-details-table"
              style={{ display: "flex", flex: 1 }}
            >
              <div style={{ flex: 1 }}>
                <li>
                  <label>
                    <span className="normal-text">State</span>
                    {` :  ${props?.propertyData?.state ?? ""}`}
                  </label>
                </li>
                <li>
                  <label>
                    <span className="normal-text">City</span>
                    {` :  ${props?.propertyData?.city ?? ""}`}
                  </label>
                </li>
                <li>
                  <label>
                    <span className="normal-text">Location</span>
                    {` :  ${props.propertyData?.location ?? ""}`}
                  </label>
                </li>
              </div>
              <div style={{ flex: 1 }}>
                <li>
                  <label>
                    <span className="normal-text">Latitude</span>
                    {` :  ${Number(props.propertyData.latitude).toFixed(5)}`}
                  </label>
                </li>
                <li>
                  <label>
                    <span className="normal-text">Longitude</span>
                    {` : ${Number(props.propertyData.longitude).toFixed(5)}`}
                  </label>
                </li>
                <li>
                  <label>
                    <span className="normal-text">Pincode</span>
                    {` :  ${props?.propertyData?.pincode ?? ""}`}
                  </label>
                </li>
              </div>
            </ul>
          </div>
        </div>

        <CustomAccordian title="Project Data for Residential Flats">
          <div className="common-margin-bottom percent-inclusion-description">
            <div>
              {/* <ul className="text-padding normal-text property-details-table" style={{ display: "flex", }}>
                    <div style={{ color: '#828282', paddingBottom: 10 }}>
                      <li>
                        <span className=" normal-text">{`< 500m Wt. Avg Rate/Sqft :`}</span> <label className="normal-text"> {props.data.ProjectDataForResidentialFlats?.WtAvgRate500Mt} </label>
                      </li>
                      <li>
                        <label className=" normal-text" style={{}}>{`0-2Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForResidentialFlats?.WtAvgRate2KM}`}</label>
                      </li>
                      <li>
                        <label className=" normal-text" style={{}}>{`2-5Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForResidentialFlats?.WtAvgRate2_5KM}`}</label>
                      </li>
                    </div>
                  </ul> */}
              <div className="sub-title-propEdge">
                Affordable
                <ul
                  className="text-padding normal-text property-details-table"
                  style={{ display: "flex" }}
                >
                  <div style={{ color: "#828282", paddingBottom: 10 }}>
                    <li>
                      <span className=" normal-text">{`< 500m Wt. Avg Rate/Sqft :`}</span>
                      <label className="normal-text">
                        {
                          props.data.ProjectDataForResidentialFlats?.Affordable
                            .WtAvgRate500Mt
                        }
                      </label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`0-2Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForResidentialFlats?.Affordable.WtAvgRate2KM}`}</label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`2-5Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForResidentialFlats?.Affordable.WtAvgRate2_5KM}`}</label>
                    </li>
                  </div>
                </ul>
              </div>
              <div className="sub-title-propEdge">
                Mid
                <ul
                  className="text-padding normal-text property-details-table"
                  style={{ display: "flex" }}
                >
                  <div style={{ color: "#828282", paddingBottom: 10 }}>
                    <li>
                      <span className=" normal-text">{`< 500m Wt. Avg Rate/Sqft :`}</span>
                      <label className="normal-text">
                        {
                          props.data.ProjectDataForResidentialFlats.Mid
                            .WtAvgRate500Mt
                        }
                      </label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`0-2Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForResidentialFlats.Mid.WtAvgRate2KM}`}</label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`2-5Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForResidentialFlats.Mid.WtAvgRate2_5KM}`}</label>
                    </li>
                  </div>
                </ul>
              </div>

              <div className="sub-title-propEdge">
                Luxury
                <ul
                  className="text-padding normal-text property-details-table"
                  style={{ display: "flex" }}
                >
                  <div style={{ color: "#828282", paddingBottom: 10 }}>
                    <li>
                      <span className=" normal-text">{`< 500m Wt. Avg Rate/Sqft :`}</span>
                      <label className="normal-text">
                        {
                          props.data.ProjectDataForResidentialFlats?.Luxury
                            .WtAvgRate500Mt
                        }
                      </label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`0-2Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForResidentialFlats?.Luxury.WtAvgRate2KM}`}</label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`2-5Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForResidentialFlats?.Luxury.WtAvgRate2_5KM}`}</label>
                    </li>
                  </div>
                </ul>
              </div>

              <CustomModal title="Project Data for Residential Flats">
                <div className="table-private-sub">
                  <table
                    id="surveyNumberDetails"
                    className="border-right-dashed avm"
                    style={{ width: "100%" }}
                  >
                    <thead className="sticky-head">
                      <tr>
                        <th className="width-14">
                          Name of
                          <div> Builder</div>
                        </th>
                        <th className="width-14">
                          Name of<div>Project </div>
                        </th>
                        <th className="width-14">
                          Distance <div>from SP </div>
                        </th>
                        <th className="width-14">
                          Avg Sale Area
                          <div>(Sqft) </div>
                        </th>
                        <th className="width-14">{"Sale Rate/Sqft"}</th>
                        <th className="width-14">
                          Status of<div>Construction </div>
                        </th>
                        <th className="width-14">
                          Property<div>Segment</div>
                        </th>
                        <th className="width-14">
                          Price<div>Based On</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props?.data?.ProjectDataForResidentialFlats
                        ?.ProjectList &&
                      props?.data?.ProjectDataForResidentialFlats?.ProjectList
                        .length > 0 ? (
                        props?.data?.ProjectDataForResidentialFlats?.ProjectList?.map(
                          (md) => {
                            return (
                              <tr>
                                <td>{md.NumberOfBuilder}</td>
                                <td>{md.NameOfProject}</td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.DistanceFromSP}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.AvgSaleArea}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.SaleRate}
                                </td>
                                <td>{md.StatusOfConstruction}</td>
                                <td>{md.PropertySegment}</td>
                                <td>{md.PriceBasedOn}</td>
                              </tr>
                            );
                          },
                        )
                      ) : (
                        <Empty numSpan={7} />
                      )}
                    </tbody>
                  </table>
                </div>
              </CustomModal>
            </div>
          </div>
        </CustomAccordian>

        <CustomAccordian title="Project Data for Residential Villas/Row Houses">
          <div className="common-margin-bottom percent-inclusion-description">
            <div>
              <div className="sub-title-propEdge">
                Affordable
                <ul
                  className="text-padding normal-text property-details-table"
                  style={{ display: "flex" }}
                >
                  <div style={{ color: "#828282", paddingBottom: 10 }}>
                    <li>
                      <span className=" normal-text">{`< 500m Wt. Avg Rate/Sqft :`}</span>
                      <label className="normal-text">
                        {
                          props.data.ProjectDataForResidentialVillas_RowHouses
                            ?.Affordable.WtAvgRate500Mt
                        }
                      </label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`0-2Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForResidentialVillas_RowHouses?.Affordable.WtAvgRate2KM}`}</label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`2-5Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForResidentialVillas_RowHouses?.Affordable.WtAvgRate2_5KM}`}</label>
                    </li>
                  </div>
                </ul>
              </div>
              <div className="sub-title-propEdge">
                Mid
                <ul
                  className="text-padding normal-text property-details-table"
                  style={{ display: "flex" }}
                >
                  <div style={{ color: "#828282", paddingBottom: 10 }}>
                    <li>
                      <span className=" normal-text">{`< 500m Wt. Avg Rate/Sqft :`}</span>
                      <label className="normal-text">
                        {
                          props.data.ProjectDataForResidentialVillas_RowHouses
                            .Mid.WtAvgRate500Mt
                        }
                      </label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`0-2Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForResidentialVillas_RowHouses.Mid.WtAvgRate2KM}`}</label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`2-5Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForResidentialVillas_RowHouses.Mid.WtAvgRate2_5KM}`}</label>
                    </li>
                  </div>
                </ul>
              </div>

              <div className="sub-title-propEdge">
                Luxury
                <ul
                  className="text-padding normal-text property-details-table"
                  style={{ display: "flex" }}
                >
                  <div style={{ color: "#828282", paddingBottom: 10 }}>
                    <li>
                      <span className=" normal-text">{`< 500m Wt. Avg Rate/Sqft :`}</span>
                      <label className="normal-text">
                        {
                          props.data.ProjectDataForResidentialVillas_RowHouses
                            ?.Luxury.WtAvgRate500Mt
                        }
                      </label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`0-2Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForResidentialVillas_RowHouses?.Luxury.WtAvgRate2KM}`}</label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`2-5Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForResidentialVillas_RowHouses?.Luxury.WtAvgRate2_5KM}`}</label>
                    </li>
                  </div>
                </ul>
              </div>
              <CustomModal title="Project Data for Residential Villas/Row Houses">
                <div className="table-private-sub">
                  <table
                    id="surveyNumberDetails"
                    className="border-right-dashed avm"
                    style={{ width: "100%" }}
                  >
                    <thead className="sticky-head">
                      <tr>
                        <th className="width-14">
                          Name of
                          <div> Builder</div>
                        </th>
                        <th className="width-14">
                          Name of<div>Project </div>
                        </th>
                        <th className="width-14">
                          Distance <div>from SP </div>
                        </th>
                        <th className="width-14">
                          Avg Sale Area
                          <div>(Sqft) </div>
                        </th>
                        <th className="width-14">{"Sale Rate/Sqft"}</th>
                        <th className="width-14">
                          Status of<div>Construction </div>
                        </th>
                        <th className="width-14">
                          Property<div>Segment</div>
                        </th>
                        <th className="width-14">
                          Price<div>Based On</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props?.data?.ProjectDataForResidentialVillas_RowHouses
                        ?.ProjectList &&
                      props?.data?.ProjectDataForResidentialVillas_RowHouses
                        ?.ProjectList.length > 0 ? (
                        props.data.ProjectDataForResidentialVillas_RowHouses.ProjectList.map(
                          (md) => {
                            return (
                              <tr>
                                <td>{md.NumberOfBuilder}</td>
                                <td>{md.NameOfProject}</td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.DistanceFromSP}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.AvgSaleArea}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.SaleRate}
                                </td>
                                <td>{md.StatusOfConstruction}</td>
                                <td>{md.PropertySegment}</td>
                                <td>{md.PriceBasedOn}</td>
                              </tr>
                            );
                          },
                        )
                      ) : (
                        <Empty numSpan={7} />
                      )}
                    </tbody>
                  </table>
                </div>
              </CustomModal>
            </div>
          </div>
        </CustomAccordian>

        <CustomAccordian title="Project Data for Lands">
          <div className="common-margin-bottom percent-inclusion-description">
            <div>
              <ul
                className=" text-padding property-details-table "
                style={{ display: "flex" }}
              >
                <div style={{ color: "#828282", paddingBottom: 10 }}>
                  <li>
                    <label className=" normal-text">
                      {`< 500m Wt. Avg Rate/Sqft : ${props.data.ProjectDataForLands.WtAvgRate500Mt}`}
                    </label>
                  </li>
                  <li>
                    <label
                      className=" normal-text"
                      style={{}}
                    >{`0-2Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForLands.WtAvgRate2KM}`}</label>
                  </li>

                  <li>
                    <label
                      className=" normal-text"
                      style={{}}
                    >{`2-5Km Wt. Avg Rate/Sqft : ${
                      props.data?.ProjectDataForLands?.WtAvgRate2_5KM || ""
                    }`}</label>
                  </li>
                </div>
              </ul>
              <CustomModal title="Project Data for Lands">
                <div className="table-private-sub">
                  <table
                    id="surveyNumberDetails"
                    className="border-right-dashed avm"
                    style={{ width: "100%" }}
                  >
                    <thead className="sticky-head">
                      <tr>
                        <th className="width-14">
                          Name of
                          <div> Builder</div>
                        </th>
                        <th className="width-14">
                          Name of<div>Project </div>
                        </th>
                        <th className="width-14">
                          Distance <div>from SP </div>
                        </th>
                        <th className="width-14">
                          Avg Sale Area
                          <div>(Sqft) </div>
                        </th>
                        <th className="width-14">{"Sale Rate/Sqft"}</th>
                        <th className="width-14">
                          Status of<div>Construction </div>
                        </th>
                        <th className="width-14">
                          Property<div>type</div>
                        </th>
                        <th className="width-14">
                          Price<div>Based On</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.data?.ProjectDataForLands?.ProjectList &&
                      props.data.ProjectDataForLands.ProjectList.length > 0 ? (
                        props.data.ProjectDataForLands.ProjectList.map((md) => {
                          return (
                            <tr>
                              <td>{md.NumberOfBuilder}</td>
                              <td>{md.NameOfProject}</td>
                              <td
                                style={{
                                  textAlign: "end",
                                  paddingRight: 6,
                                }}
                              >
                                {md.DistanceFromSP}
                              </td>
                              <td
                                style={{
                                  textAlign: "end",
                                  paddingRight: 6,
                                }}
                              >
                                {md.AvgSaleArea}
                              </td>
                              <td
                                style={{
                                  textAlign: "end",
                                  paddingRight: 6,
                                }}
                              >
                                {md.SaleRate}
                              </td>
                              <td>{md.StatusOfConstruction}</td>
                              <td>{md.PropertType}</td>
                              <td>{md.PriceBasedOn}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <Empty numSpan={7} />
                      )}
                    </tbody>
                  </table>
                </div>
              </CustomModal>
            </div>
          </div>
        </CustomAccordian>

        <CustomAccordian title="Project Data for Independent Floor">
          <div className="common-margin-bottom percent-inclusion-description">
            <div>
              <div className="sub-title-propEdge">
                Affordable
                <ul
                  className="text-padding normal-text property-details-table"
                  style={{ display: "flex" }}
                >
                  <div style={{ color: "#828282", paddingBottom: 10 }}>
                    <li>
                      <span className=" normal-text">{`< 500m Wt. Avg Rate/Sqft :`}</span>
                      <label className="normal-text">
                        {
                          props.data.ProjectDataForIndependentFloor?.Affordable
                            .WtAvgRate500Mt
                        }
                      </label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`0-2Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForIndependentFloor?.Affordable.WtAvgRate2KM}`}</label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`2-5Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForIndependentFloor?.Affordable.WtAvgRate2_5KM}`}</label>
                    </li>
                  </div>
                </ul>
              </div>
              <div className="sub-title-propEdge">
                Mid
                <ul
                  className="text-padding normal-text property-details-table"
                  style={{ display: "flex" }}
                >
                  <div style={{ color: "#828282", paddingBottom: 10 }}>
                    <li>
                      <span className=" normal-text">{`< 500m Wt. Avg Rate/Sqft :`}</span>
                      <label className="normal-text">
                        {
                          props.data.ProjectDataForIndependentFloor.Mid
                            .WtAvgRate500Mt
                        }
                      </label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`0-2Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForIndependentFloor.Mid.WtAvgRate2KM}`}</label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`2-5Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForIndependentFloor.Mid.WtAvgRate2_5KM}`}</label>
                    </li>
                  </div>
                </ul>
              </div>

              <div className="sub-title-propEdge">
                Luxury
                <ul
                  className="text-padding normal-text property-details-table"
                  style={{ display: "flex" }}
                >
                  <div style={{ color: "#828282", paddingBottom: 10 }}>
                    <li>
                      <span className=" normal-text">{`< 500m Wt. Avg Rate/Sqft :`}</span>
                      <label className="normal-text">
                        {
                          props.data.ProjectDataForIndependentFloor?.Luxury
                            .WtAvgRate500Mt
                        }
                      </label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`0-2Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForIndependentFloor?.Luxury.WtAvgRate2KM}`}</label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`2-5Km Wt. Avg Rate/Sqft : ${props.data.ProjectDataForIndependentFloor?.Luxury.WtAvgRate2_5KM}`}</label>
                    </li>
                  </div>
                </ul>
              </div>
              <CustomModal title="Project Data for Independent Floor">
                <div className="table-private-sub">
                  <table
                    id="surveyNumberDetails"
                    className="border-right-dashed avm"
                    style={{ width: "100%" }}
                  >
                    <thead className="sticky-head">
                      <tr>
                        <th className="width-14">
                          Name of
                          <div> Builder</div>
                        </th>
                        <th className="width-14">
                          Name of<div>Project </div>
                        </th>
                        <th className="width-14">
                          Distance <div>from SP </div>
                        </th>
                        <th className="width-14">
                          Avg Sale Area
                          <div>(Sqft) </div>
                        </th>
                        <th className="width-14">{"Sale Rate/Sqft"}</th>
                        <th className="width-14">
                          Status of<div>Construction </div>
                        </th>
                        <th className="width-14">
                          Property<div>Segment</div>
                        </th>
                        <th className="width-14">
                          Price<div>Based On</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.data?.ProjectDataForIndependentFloor
                        ?.ProjectList &&
                      props.data.ProjectDataForIndependentFloor.ProjectList
                        .length > 0 ? (
                        props.data.ProjectDataForIndependentFloor.ProjectList.map(
                          (md) => {
                            console.log("md", md);
                            return (
                              <tr>
                                <td>{md.NumberOfBuilder}</td>
                                <td>{md.NameOfProject}</td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.DistanceFromSP}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.AvgSaleArea}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.SaleRate}
                                </td>
                                <td>{md.StatusOfConstruction}</td>
                                <td>{md.PropertySegment}</td>
                                <td>{md.PriceBasedOn}</td>
                              </tr>
                            );
                          },
                        )
                      ) : (
                        <Empty numSpan={7} />
                      )}
                    </tbody>
                  </table>
                </div>
              </CustomModal>
            </div>
          </div>
        </CustomAccordian>

        <CustomAccordian title="Project Data for Commercial">
          <div className="common-margin-bottom percent-inclusion-description">
            <div>
              <ul
                className="text-padding property-details-table "
                style={{ display: "flex", flex: 1 }}
              >
                <div
                  style={{
                    color: "#828282",
                    paddingBottom: 10,
                    display: "flex",
                    flex: 1,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <li>
                      <label className=" normal-text">
                        {`< 500m Wt. Avg Rate/Sqft (Office) : ${props.data.ProjectDataForCommercial.WtAvgOfficeRate500Mt}`}
                      </label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`0-2Km Wt. Avg Rate/Sqft (Office) : ${props.data.ProjectDataForCommercial.WtAvgOfficeRate2KM}`}</label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`2-5Km Wt. Avg Rate/Sqft (Office) : ${props.data.ProjectDataForCommercial.WtAvgOfficeRate2_5KM}`}</label>
                    </li>
                  </div>

                  <div style={{ flex: 1 }}>
                    <li>
                      <label className=" normal-text">
                        {`< 500m Wt. Avg Rate/Sqft (Retail) : ${props.data.ProjectDataForCommercial.WtAvgRetailRate500Mt}`}
                      </label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`0-2Km Wt. Avg Rate/Sqft (Retail) : ${props.data.ProjectDataForCommercial.WtAvgRetailRate2KM}`}</label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`2-5Km Wt. Avg Rate/Sqft (Retail) : ${props.data.ProjectDataForCommercial.WtAvgRetailRate2_5KM}`}</label>
                    </li>
                  </div>
                </div>
              </ul>
              <CustomModal title="Project Data for Commercial">
                <div className="table-private-sub">
                  <table
                    id="surveyNumberDetails"
                    className="border-right-dashed avm"
                    style={{ width: "100%" }}
                  >
                    <thead className="sticky-head">
                      <tr>
                        <th className="width-14">
                          Name of
                          <div> Builder</div>
                        </th>
                        <th className="width-14">
                          Name of<div>Project </div>
                        </th>
                        <th className="width-14">
                          Distance <div>from SP </div>
                        </th>
                        <th className="width-14">
                          Avg Sale Area
                          <div>(Sqft) </div>
                        </th>
                        <th className="width-14">{"Sale Rate/Sqft"}</th>
                        <th className="width-14">Avg Rent/Sqft</th>
                        <th className="width-14">
                          Status of<div>Construction </div>
                        </th>
                        <th className="width-14">
                          Price<div>Based On</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props?.data?.ProjectDataForCommercial?.ProjectList &&
                      props.data.ProjectDataForCommercial.ProjectList.length >
                        0 ? (
                        props.data.ProjectDataForCommercial.ProjectList.map(
                          (md) => {
                            console.log("md-1", md);

                            return (
                              <tr>
                                <td>{md.NumberOfBuilder}</td>
                                <td>{md.NameOfProject}</td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.DistanceFromSP}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.AvgSaleLeaseArea}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.SaleRate}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.AvgRent}
                                </td>
                                <td>{md.StatusOfConstruction}</td>
                                <td>{md.PriceBasedOn}</td>
                              </tr>
                            );
                          },
                        )
                      ) : (
                        <Empty numSpan={7} />
                      )}
                    </tbody>
                  </table>
                </div>
              </CustomModal>
            </div>
          </div>
        </CustomAccordian>

        <CustomAccordian title="Individual Data for Residential Flats">
          <div className="common-margin-bottom percent-inclusion-description">
            <div>
              <ul
                className="text-padding property-details-table "
                style={{ display: "flex" }}
              >
                <div style={{ color: "#828282", paddingBottom: 10 }}>
                  <li>
                    <label className=" normal-text">
                      {`< 500m Wt. Avg Rate/Sqft : ${props.data.IndividualDataForResidentialFlats.WtAvgRate500Mt}`}
                    </label>
                  </li>
                  <li>
                    <label
                      className=" normal-text"
                      style={{}}
                    >{`0-2Km Wt. Avg Rate/Sqft : ${props.data.IndividualDataForResidentialFlats.WtAvgRate2KM}`}</label>
                  </li>
                  <li>
                    <label
                      className=" normal-text"
                      style={{}}
                    >{`2-5Km Wt. Avg Rate/Sqft : ${props.data.IndividualDataForResidentialFlats.WtAvgRate2_5KM}`}</label>
                  </li>
                </div>
              </ul>
              <CustomModal title="Individual Data for Residential Flats">
                <div className="table-private-sub">
                  <table
                    id="surveyNumberDetails"
                    className="border-right-dashed avm"
                    style={{ width: "100%" }}
                  >
                    <thead className="sticky-head">
                      <tr>
                        <th className="width-14">
                          Address of
                          <div> property</div>
                        </th>

                        <th className="width-14">
                          Distance <div>from SP </div>
                        </th>
                        <th className="width-14">
                          Avg Sale Area
                          <div>(Sqft) </div>
                        </th>
                        <th className="width-14">{"Sale Rate/Sqft"}</th>
                        <th className="width-14">
                          Status of<div>Construction </div>
                        </th>
                        <th className="width-14">
                          Property<div>Segment</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.data?.IndividualDataForResidentialFlats
                        ?.PropertyList &&
                      props.data?.IndividualDataForResidentialFlats
                        ?.PropertyList.length > 0 ? (
                        props.data.IndividualDataForResidentialFlats.PropertyList.map(
                          (md) => {
                            return (
                              <tr>
                                <td>{md.AddressOfProperty}</td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.DistanceFromSP}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.AvgSaleArea}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.SaleRate}
                                </td>
                                <td>{md.StatusOfConstruction}</td>
                                <td>{md.PropertySegment}</td>
                              </tr>
                            );
                          },
                        )
                      ) : (
                        <Empty numSpan={6} />
                      )}
                    </tbody>
                  </table>
                </div>
              </CustomModal>
            </div>
          </div>
        </CustomAccordian>

        <CustomAccordian title="Individual Data for Residential Villas/Row Houses">
          <div className="common-margin-bottom percent-inclusion-description ">
            <div>
              <ul
                className="text-padding property-details-table "
                style={{ display: "flex" }}
              >
                <div style={{ color: "#828282", paddingBottom: 10 }}>
                  <li>
                    <label className=" normal-text">
                      {`< 500m Wt. Avg Rate/Sqft : ${props.data.IndividualDataForResidentialVillas_RowHouses.WtAvgRate500Mt}`}
                    </label>
                  </li>
                  <li>
                    <label
                      className=" normal-text"
                      style={{}}
                    >{`0-2Km Wt. Avg Rate/Sqft : ${props.data.IndividualDataForResidentialVillas_RowHouses.WtAvgRate2KM}`}</label>
                  </li>
                  <li>
                    <label
                      className=" normal-text"
                      style={{}}
                    >{`2-5Km Wt. Avg Rate/Sqft : ${props.data.IndividualDataForResidentialVillas_RowHouses.WtAvgRate2_5KM}`}</label>
                  </li>
                </div>
              </ul>
              <CustomModal title="Individual Data for Residential Villas/Row Houses">
                <div className="table-private-sub">
                  <table
                    id="surveyNumberDetails"
                    className="border-right-dashed avm"
                    style={{ width: "100%" }}
                  >
                    <thead className="sticky-head">
                      <tr>
                        <th className="width-14">
                          Address of
                          <div> property</div>
                        </th>
                        <th className="width-14">
                          Distance <div>from SP </div>
                        </th>

                        <th className="width-14">
                          Avg Land Area
                          <div>(Sqft) </div>
                        </th>

                        <th className="width-14">
                          Avg Sale Area
                          <div>(Sqft) </div>
                        </th>
                        <th className="width-14">{"Sale Rate/Sqft"}</th>
                        <th className="width-14">
                          Status of<div>Construction </div>
                        </th>
                        <th className="width-14">
                          Property<div>Segment</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.data?.IndividualDataForResidentialVillas_RowHouses
                        ?.PropertyList &&
                      props.data?.IndividualDataForResidentialVillas_RowHouses
                        ?.PropertyList.length > 0 ? (
                        props.data.IndividualDataForResidentialVillas_RowHouses.PropertyList.map(
                          (md) => {
                            return (
                              <tr>
                                <td>{md.AddressOfProperty}</td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.DistanceFromSP}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.AvgLandArea}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.AvgSaleArea}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.SaleRate}
                                </td>
                                <td>{md.StatusOfConstruction}</td>
                                <td>{md.PropertySegment}</td>
                              </tr>
                            );
                          },
                        )
                      ) : (
                        <Empty numSpan={7} />
                      )}
                    </tbody>
                  </table>
                </div>
              </CustomModal>
            </div>
          </div>
        </CustomAccordian>

        <CustomAccordian title="Individual Data for Lands/Independent Buildings">
          <div className="common-margin-bottom percent-inclusion-description">
            <div>
              <ul
                className="text-padding property-details-table "
                style={{ display: "flex" }}
              >
                <div style={{ color: "#828282", paddingBottom: 10 }}>
                  <li>
                    <label className=" normal-text">
                      {`< 500m Wt. Avg Rate/Sqft : ${props.data.IndividualDataForLands_IndependentBuildings.WtAvgRate500Mt}`}
                    </label>
                  </li>
                  <li>
                    <label
                      className=" normal-text"
                      style={{}}
                    >{`0-2Km Wt. Avg Rate/Sqft : ${props.data.IndividualDataForLands_IndependentBuildings.WtAvgRate2KM}`}</label>
                  </li>
                  <li>
                    <label
                      className=" normal-text"
                      style={{}}
                    >{`2-5Km Wt. Avg Rate/Sqft : ${props.data.IndividualDataForLands_IndependentBuildings.WtAvgRate2_5KM}`}</label>
                  </li>
                </div>
              </ul>
              <CustomModal title="Individual Data for Lands/Independent Buildings">
                <div className="table-private-sub">
                  <table
                    id="surveyNumberDetails"
                    className="border-right-dashed avm"
                    style={{ width: "100%" }}
                  >
                    <thead className="sticky-head">
                      <tr>
                        <th className="width-14">
                          Address of
                          <div> property</div>
                        </th>

                        <th className="width-14">
                          Distance <div>from SP </div>
                        </th>
                        <th className="width-14">
                          Property <div>type </div>
                        </th>

                        <th className="width-14">Land Area</th>
                        <th className="width-14">
                          Avg Sale Area
                          <div>(Sqft) </div>
                        </th>
                        <th className="width-14">Land Rate/Sqft</th>

                        <th className="width-14">
                          Status of<div>Construction </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.data?.IndividualDataForLands_IndependentBuildings
                        ?.PropertyList &&
                      props.data?.IndividualDataForLands_IndependentBuildings
                        ?.PropertyList.length > 0 ? (
                        props.data.IndividualDataForLands_IndependentBuildings.PropertyList.map(
                          (md) => {
                            return (
                              <tr>
                                <td>{md.AddressOfProperty}</td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.DistanceFromSP}
                                </td>
                                <td>{md.PropertyType}</td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.LandArea}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.AvgSaleArea}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.LandRate}
                                </td>
                                <td>{md.StatusOfConstruction}</td>
                              </tr>
                            );
                          },
                        )
                      ) : (
                        <Empty numSpan={7} />
                      )}
                    </tbody>
                  </table>
                </div>
              </CustomModal>
            </div>
          </div>
        </CustomAccordian>

        <CustomAccordian title="Individual Data for Commercial">
          <div className="common-margin-bottom percent-inclusion-description">
            <div>
              <ul
                className="text-padding property-details-table "
                style={{ display: "flex", flex: 1 }}
              >
                <div
                  style={{
                    color: "#828282",
                    paddingBottom: 10,
                    display: "flex",
                    flex: 1,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <li>
                      <label className=" normal-text">
                        {`< 500m Wt. Avg Rate/Sqft (Office) : ${props.data.IndividualDataForCommercial.WtAvgRateOffice500Mt}`}
                      </label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`0-2Km Wt. Avg Rate/Sqft (Office) : ${props.data.IndividualDataForCommercial.WtAvgRateOffice2KM}`}</label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`2-5Km Wt. Avg Rate/Sqft (Office) : ${props.data.IndividualDataForCommercial.WtAvgRateOffice2_5KM}`}</label>
                    </li>
                  </div>

                  <div style={{ flex: 1 }}>
                    <li>
                      <label className=" normal-text">
                        {`< 500m Wt. Avg Rate/Sqft (Retail) : ${props.data.IndividualDataForCommercial.WtAvgRateRetail500Mt}`}
                      </label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`0-2Km Wt. Avg Rate/Sqft (Retail) : ${props.data.IndividualDataForCommercial.WtAvgRateRetail2KM}`}</label>
                    </li>
                    <li>
                      <label
                        className=" normal-text"
                        style={{}}
                      >{`2-5Km Wt. Avg Rate/Sqft (Retail) : ${props.data.IndividualDataForCommercial.WtAvgRateRetail2_5KM}`}</label>
                    </li>
                  </div>
                </div>
              </ul>
              <CustomModal title="Individual Data for Commercial">
                <div className="table-private-sub">
                  <table
                    id="surveyNumberDetails"
                    className="border-right-dashed avm"
                    style={{ width: "100%" }}
                  >
                    <thead className="sticky-head">
                      <tr>
                        <th className="width-14">
                          Address of
                          <div> property</div>
                        </th>

                        <th className="width-14">
                          Distance <div>from SP </div>
                        </th>

                        <th className="width-14">
                          Avg Sale lease Area
                          <div>(Sqft) </div>
                        </th>
                        <th className="width-14">Sale Rate/Sqft</th>

                        <th className="width-14">Avg Rent/Sqft</th>

                        <th className="width-14">
                          Status of<div>Construction </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.data?.IndividualDataForCommercial?.PropertyList &&
                      props.data?.IndividualDataForCommercial?.PropertyList
                        .length > 0 ? (
                        props.data.IndividualDataForCommercial.PropertyList.map(
                          (md) => {
                            return (
                              <tr>
                                <td>{md.AddressOfProperty}</td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.DistanceFromSP}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.AvgSale_LeaseArea}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.SaleRate}
                                </td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    paddingRight: 6,
                                  }}
                                >
                                  {md.AvgRent}
                                </td>
                                <td>{md.StatusOfConstruction}</td>
                              </tr>
                            );
                          },
                        )
                      ) : (
                        <Empty numSpan={6} />
                      )}
                    </tbody>
                  </table>
                </div>
              </CustomModal>
            </div>
          </div>
        </CustomAccordian>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  serveyReportData: state.serveyReport.serveyReportData,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      // getServeyReportData: getServeyReportData,
    },
    dispatch,
  );
}

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));
export default enhance(PropEdge);
