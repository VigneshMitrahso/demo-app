import React, { useEffect, useRef, useState } from "react";

import { _getStorageValue } from "../../comman/localStorage";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { compose } from "redux";

import CustomAccordian from "../valuation-filter/accordian";
import CustomModal from "../valuation-filter/modalWindow";
import Header from "../header";
import { USER_ID } from "../../comman/constants";
import { getAdvariskDetail } from "../../action/actionEmployeeAnalytics";
import { toast } from "react-toastify";

const Empty = ({ numSpan }) => {
  return (
    <tr>
      <td colspan={numSpan}>No data available </td>
    </tr>
  );
};

const ResultComp = (props) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    property_transactions_details: [],
    valuation_of_similar_properties: [],
    other_transaction_details: [],
  });
  const dispatch = useDispatch();

  useEffect(() => {
    let orderID = new URLSearchParams(props.location.search).get("orderID");

    const successCallBack = (response) => {
      setLoading(false);
      setResult(response.data.advarisk_data);
      toast.success("Success", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    };

    const failurCallback = () => {
      setLoading(false);
      toast.error("Please try again", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    };

    _getStorageValue(USER_ID).then((id) => {
      dispatch(getAdvariskDetail(id, orderID, successCallBack, failurCallback));
    });
  }, []);

  return (
    <div className="dashboard-container">
      <Header link="/adva-risk" />
      <div className="report-parent-container">
        <div style={{ paddingTop: 100 }} className="report-container ">
          <div className="site-vist sitrepot branch-container  ">
            <h3> Unit Level Report </h3>
          </div>
          <>
            <div className="">
              <div className="propeye-report-section">
                <div className="">
                  <div className="propeye-report-description">
                    <label
                      style={{ padding: 20 }}
                      className="common-title-details title-font"
                    >
                      Summary
                    </label>
                    <div
                      style={{
                        paddingLeft: 20,
                        paddingTop: 20,
                        paddingBottom: 20,
                      }}
                      className="icic-right-background"
                    >
                      <ul
                        className="property-details-table"
                        style={{ display: "flex", flex: 1 }}
                      >
                        <div style={{ flex: 1 }}>
                          <li>
                            <label>
                              <span className="normal-text">Order Id</span>{" "}
                              {` :  ${result.order_id}`}
                            </label>
                          </li>
                          <li>
                            <label>
                              <span className="normal-text">
                                Refrence Number
                              </span>
                              {` :  ${result.reference_number}`}
                            </label>
                          </li>
                        </div>
                        <div style={{ flex: 1 }}>
                          <li>
                            <label>
                              <span className="normal-text">State</span>
                              {` :  ${result.state}`}
                            </label>
                          </li>
                          <li>
                            <label>
                              <span className="normal-text">District</span>
                              {` : ${result.district}`}
                            </label>
                          </li>
                          <li>
                            <label>
                              <span className="normal-text">Address</span>
                              {` : ${result?.property_address_line_1 ?? ""}`}
                            </label>
                          </li>
                        </div>
                      </ul>
                    </div>
                  </div>

                  <CustomAccordian
                    toOpen={true}
                    title="Property Transaction Details"
                  >
                    <div className="common-margin-bottom percent-inclusion-description">
                      <div className="">
                        <CustomModal title="Property Transaction Details">
                          <div className="table-private-sub">
                            <table
                              id="surveyNumberDetails"
                              className="border-right-dashed avm"
                              style={{ width: "100%" }}
                            >
                              <thead className="sticky-head">
                                <tr>
                                  <th className="width-14">
                                    Sub Register Office
                                  </th>
                                  <th className="width-14">
                                    Registration Number
                                  </th>
                                  <th className="width-14">
                                    Registration Date
                                  </th>
                                  <th className="width-14">Transaction Type</th>
                                  <th className="width-14">Property Address</th>
                                  <th className="width-14">Buyer Name</th>
                                  <th className="width-14">Seller Name</th>
                                  <th className="width-14">Property Extent</th>
                                  <th className="width-14">
                                    Property Extent Unit
                                  </th>
                                  <th className="width-14">
                                    Consideration Value
                                  </th>
                                  <th className="width-14">Status</th>
                                  <th className="width-14">Remark</th>
                                </tr>
                              </thead>
                              <tbody>
                                {result.property_transactions_details.length >
                                0 ? (
                                  result.property_transactions_details?.map(
                                    (md) => {
                                      return (
                                        <tr>
                                          <td>{md.sub_registrar_office}</td>
                                          <td>{md.registration_number}</td>
                                          <td>{md.registration_date}</td>
                                          <td>{md.transaction_type}</td>
                                          <td>{md.property_address}</td>
                                          <td>{md.buyer_name}</td>
                                          <td>{md.seller_name}</td>
                                          <td>{md.property_extent}</td>
                                          <td>{md.property_extent_unit}</td>
                                          <td>{md.consideration_value}</td>
                                          <td>{md.status}</td>
                                          <td>{md.remark}</td>
                                        </tr>
                                      );
                                    },
                                  )
                                ) : (
                                  <Empty numSpan={12} />
                                )}
                              </tbody>
                            </table>
                          </div>
                        </CustomModal>
                      </div>
                    </div>
                  </CustomAccordian>

                  <CustomAccordian title="Valuation Of Similar Properties">
                    <div className="common-margin-bottom percent-inclusion-description">
                      <div className="">
                        <CustomModal title="Valuation Of Similar Properties">
                          <div className="table-private-sub">
                            <table
                              id="surveyNumberDetails"
                              className="border-right-dashed avm"
                              style={{ width: "100%" }}
                            >
                              <thead className="sticky-head">
                                <tr>
                                  <th className="width-14">
                                    Sub Register Office
                                  </th>
                                  <th className="width-14">
                                    Registration Number
                                  </th>
                                  <th className="width-14">
                                    Registration Date
                                  </th>
                                  <th className="width-14">Transaction Type</th>
                                  <th className="width-14">Property Address</th>
                                  <th className="width-14">Buyer Name</th>
                                  <th className="width-14">Seller Name</th>
                                  <th className="width-14">Property Extent</th>
                                  <th className="width-14">
                                    Property Extent Unit
                                  </th>
                                  <th className="width-14">
                                    Consideration Value
                                  </th>
                                  <th className="width-14">Status</th>
                                  <th className="width-14">Remark</th>
                                </tr>
                              </thead>
                              <tbody>
                                {result.valuation_of_similar_properties.length >
                                0 ? (
                                  result.valuation_of_similar_properties?.map(
                                    (md) => {
                                      return (
                                        <tr>
                                          <td>{md.sub_registrar_office}</td>
                                          <td>{md.registration_number}</td>
                                          <td>{md.registration_date}</td>
                                          <td>{md.transaction_type}</td>
                                          <td>{md.property_address}</td>
                                          <td>{md.buyer_name}</td>
                                          <td>{md.seller_name}</td>
                                          <td>{md.property_extent}</td>
                                          <td>{md.property_extent_unit}</td>
                                          <td>{md.consideration_value}</td>
                                          <td>{md.status}</td>
                                          <td>{md.remark}</td>
                                        </tr>
                                      );
                                    },
                                  )
                                ) : (
                                  <Empty numSpan={12} />
                                )}
                              </tbody>
                            </table>
                          </div>
                        </CustomModal>
                      </div>
                    </div>
                  </CustomAccordian>
                  {/* <CustomAccordian title="Other Transaction Details">
                                        <div className="common-margin-bottom percent-inclusion-description">
                                            <div className="">
                                                <CustomModal title="Other Transaction Details">
                                                    <div className="table-private-sub">
                                                        <table
                                                            id="surveyNumberDetails"
                                                            className="border-right-dashed avm"
                                                            style={{ width: "100%" }}
                                                        >
                                                            <thead className="sticky-head">
                                                                <tr>
                                                                    <th className="width-14">Sub Register Office</th>
                                                                    <th className="width-14">Registration Number</th>
                                                                    <th className="width-14">Registration Date</th>
                                                                    <th className="width-14">Transaction Type</th>
                                                                    <th className="width-14">Property Address</th>
                                                                    <th className="width-14">Buyer Name</th>
                                                                    <th className="width-14">Seller Name</th>
                                                                    <th className="width-14">Property Extent</th>
                                                                    <th className="width-14">Property Extent Unit</th>
                                                                    <th className="width-14">Consideration Value</th>
                                                                    <th className="width-14">Status</th>
                                                                    <th className="width-14">Remark</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {result.other_transaction_details.length > 0 ? result.property_transactions_details?.map((md) => {
                                                                    return (<tr >
                                                                        <td >{md.sub_registrar_office}</td>
                                                                        <td >{md.registration_number}</td>
                                                                        <td >{md.registration_date}</td>
                                                                        <td >{md.transaction_type}</td>
                                                                        <td >{md.property_address}</td>
                                                                        <td >{md.buyer_name}</td>
                                                                        <td >{md.seller_name}</td>
                                                                        <td >{md.property_extent}</td>
                                                                        <td >{md.property_extent_unit}</td>
                                                                        <td >{md.consideration_value}</td>
                                                                        <td >{md.status}</td>
                                                                        <td >{md.remark}</td>
                                                                    </tr>)
                                                                }) : <Empty numSpan={12} />}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </CustomModal>
                                            </div>
                                        </div>
                                    </CustomAccordian> */}
                </div>
              </div>
            </div>
          </>
        </div>
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
export default enhance(ResultComp);
