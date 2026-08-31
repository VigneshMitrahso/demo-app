import React, { Component } from "react";

// plugins

// function

// css
import "./popupDetails.css";
import { keys, upperCase } from "lodash";

export default class PopupDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { popupData = [] } = this.props;
    return (
      <div>
        {!!popupData.data &&
          popupData.data.map((popupDesc) => {
            return (
              <div style={{ marginTop: 10 }}>
                <div>
                  <div>
                    {(() => {
                      if (popupDesc.category_type === "INDIVIDUAL") {
                        return (
                          <div
                            className={`${
                              popupDesc.property_type === "COMMERCIAL"
                                ? "skyBlueBg"
                                : ""
                            } ${
                              popupDesc.property_type === "INDUSTRIAL"
                                ? "purpleBg"
                                : ""
                            } ${
                              popupDesc.property_type === "RESIDENTIAL"
                                ? "yellowBg"
                                : ""
                            }
                  ${popupDesc.category_type === "CRFG" ? "greenBg" : ""}
                  ${
                    popupDesc.property_type === "NON RESIDENTIAL"
                      ? "royalBg"
                      : ""
                  }
                  ${popupDesc.property_type === "MIXED" ? "pinkBg" : ""}`}
                          >
                            <div className="pop-dec">
                              <table>
                                <tbody>
                                  <tr>
                                    <td className="width100"> Latitude : </td>
                                    <td className="width150">
                                      {popupDesc.latitude}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="width100"> Longitude : </td>
                                    <td className="width150">
                                      {popupDesc.longitude}
                                    </td>
                                  </tr>

                                  {popupDesc.data.pincode !== null ? (
                                    <tr>
                                      <td className="width100">Pincode : </td>
                                      <td className="width150">
                                        {popupDesc.data.pincode}
                                      </td>
                                    </tr>
                                  ) : null}

                                  {/* {popupDesc.Zone !== null ? (
                          <tr>
                            <td className="width100"> Zone : </td>
                            <td className="width150"> {popupDesc.Zone} </td>
                          </tr>
                        ) : null} */}

                                  {popupDesc.data.request_code !== undefined ? (
                                    <tr>
                                      <td className="width100">Request Id :</td>
                                      <td className="width150">
                                        {popupDesc.data.request_code}
                                      </td>
                                    </tr>
                                  ) : null}

                                  <tr>
                                    <td className="width100">
                                      Property Type :
                                    </td>
                                    <td className="width150">
                                      {popupDesc.property_type}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="width100"> Unit Type : </td>
                                    <td className="width150">
                                      {popupDesc.unit_type}
                                    </td>
                                  </tr>
                                  {popupDesc.data.landarea_area !==
                                  undefined ? (
                                    <tr>
                                      <td className="width100">Land Area :</td>
                                      <td className="width150">
                                        {popupDesc.data.landarea_area}
                                      </td>
                                    </tr>
                                  ) : null}

                                  {popupDesc.data.sellablearea_area !==
                                  undefined ? (
                                    <tr>
                                      <td className="width100">
                                        Sellable Area :
                                      </td>
                                      <td className="width150">
                                        {popupDesc.data.sellablearea_area}
                                      </td>
                                    </tr>
                                  ) : null}

                                  {popupDesc.data.landarea_rate !==
                                  undefined ? (
                                    <tr>
                                      <td className="width100">Land Rate :</td>
                                      <td className="width150">
                                        {popupDesc.data.landarea_rate}
                                      </td>
                                    </tr>
                                  ) : null}

                                  {popupDesc.data.sellable_rate !==
                                  undefined ? (
                                    <tr>
                                      <td className="width100">
                                        Sellable Rate :
                                      </td>
                                      <td className="width150">
                                        {popupDesc.data.sellable_rate}
                                      </td>
                                    </tr>
                                  ) : null}

                                  <tr>
                                    <td className="width100">
                                      Property Entered On :
                                    </td>
                                    <td className="width150">
                                      {popupDesc.data.entered_on}
                                    </td>
                                  </tr>
                                  {popupDesc.data.age !== "" ? (
                                    <tr>
                                      <td className="width100">
                                        Property Age :
                                      </td>
                                      <td className="width150">
                                        {popupDesc.data.age}
                                      </td>
                                    </tr>
                                  ) : null}

                                  <tr>
                                    <td className="width100">
                                      Percentage Completed :
                                    </td>
                                    <td className="width150">
                                      {popupDesc.data.percentage_completed}
                                    </td>
                                  </tr>
                                  {/* {popupDesc.data.total_resale !== "" ? (
                          <tr>
                            <td className="width100"> Total Resale : </td>
                            <td className="width150">
                              {popupDesc.data.total_resale}
                            </td>
                          </tr>
                        ) : null} */}
                                  {/* <tr>
                          <td className="width100"> Pincode : </td>
                          <td className="width150">{popupDesc.data.pincode}</td>
                        </tr> */}
                                  <tr>
                                    <td className="width100"> Address : </td>
                                    <td className="width150">
                                      {popupDesc.address}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      } else if (
                        popupDesc.category_type === "MARKET TRANSACTION"
                      ) {
                        const marketData = {
                          building_or_projectname: "Building or Project Name",
                          contact_number: "Contact Number",
                          date_of_entry: "Date of Entry",
                          land_area: "Land Area",
                          land_rate: "Land Rate",
                          sbua_rate: "SBUA Rate",
                          sbua_area: "SBUA Area",
                          bua_area: "BUA Area",
                          bua_rate: "BUA Rate",
                          carpet_area: "Carpet Area",
                          carpet_rate: "Carpet Rate",
                          location: "Location",
                          pincode: "Pincode",
                          source_of_information: "Source of Information",
                          street_name: "Street Name",
                          transaction_or_quote: "Transaction or Quote",
                          transaction_type: "Transaction Type",
                          type_of_property: "Property Type",
                          type_of_unit: "Unit Type",
                        };
                        const marketvalueData =
                          popupDesc && popupDesc.data ? popupDesc.data : null;

                        return (
                          <div
                            className={`${
                              popupDesc.property_type === "COMMERCIAL"
                                ? "skyBlueBg"
                                : ""
                            } ${
                              popupDesc.property_type === "INDUSTRIAL"
                                ? "purpleBg"
                                : ""
                            } ${
                              popupDesc.property_type === "RESIDENTIAL"
                                ? "yellowBg"
                                : ""
                            }
                  ${popupDesc.category_type === "CRFG" ? "greenBg" : ""}
                  ${
                    popupDesc.property_type === "NON RESIDENTIAL"
                      ? "royalBg"
                      : ""
                  }
                  ${popupDesc.property_type === "MIXED" ? "pinkBg" : ""} ${
                    popupDesc.category_type === "MARKET TRANSACTION"
                      ? "amberBg"
                      : ""
                  }`}
                          >
                            <div className="pop-dec">
                              <table>
                                <tbody>
                                  <tr>
                                    <td className="width100">Latitude : </td>
                                    <td className="width150">
                                      {popupDesc.latitude || "-"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="width100">Longitude : </td>
                                    <td className="width150">
                                      {popupDesc.longitude || "-"}
                                    </td>
                                  </tr>
                                  {keys(marketData).map((value) => {
                                    return (
                                      <tr key={value}>
                                        <td className="width100">
                                          {marketData[`${value}`]} :
                                        </td>
                                        <td className="width150">
                                          {marketvalueData[`${value}`] || "-"}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                  <tr>
                                    <td className="width100">Address : </td>
                                    <td className="width150">
                                      {popupDesc.address || "-"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      } else if (
                        upperCase(popupDesc.property_type) === "BRANCH"
                      ) {
                        return (
                          <div
                            className={`${
                              upperCase(popupDesc.property_type) === "BRANCH"
                                ? "purpple-pop"
                                : ""
                            }    `}
                          >
                            <div className="pop-dec">
                              <table>
                                <tbody>
                                  <tr>
                                    <td> Property Type : </td>
                                    <td> {popupDesc.property_type} </td>
                                  </tr>
                                  {popupDesc.property_type === "BRANCH" ? (
                                    <tr className="width50">
                                      <td> Branch Name : </td>
                                      <td>{popupDesc.branch_name}</td>
                                    </tr>
                                  ) : (
                                    <tr>
                                      <td className="width50">Agency Name :</td>
                                      <td className="width150">
                                        {popupDesc.agency_name}
                                      </td>
                                    </tr>
                                  )}

                                  <tr>
                                    <td className="width50"> State : </td>
                                    <td className="width150">
                                      {popupDesc.state}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="width50"> City : </td>
                                    <td className="width150">
                                      {popupDesc.city}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      } else if (
                        upperCase(popupDesc.property_type) === "AGENCY"
                      ) {
                        return (
                          <div
                            className={`${
                              upperCase(popupDesc.property_type) === "AGENCY"
                                ? "pink-pop"
                                : ""
                            }   `}
                          >
                            <div className="pop-dec">
                              <table>
                                <tbody>
                                  <tr>
                                    <td className="width50">Property Type :</td>
                                    <td className="width150">
                                      {popupDesc.property_type || ""}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="width50"> Agency Id : </td>
                                    <td className="width150">
                                      {popupDesc?.agency_id || ""}
                                    </td>
                                  </tr>
                                  {/* {popupDesc.property_type === "BRANCH" ? (
                          <tr>
                            <td className="width50"> Branch Name : </td>
                            <td className="width150">
                              {popupDesc.branch_name}
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <td className="width50"> Agency Name : </td>
                            <td className="width150">
                              {popupDesc.agency_name}
                            </td>
                          </tr>
                        )} */}
                                  <tr>
                                    <td className="width50"> Agency Name : </td>
                                    <td className="width150">
                                      {popupDesc?.agency_name || ""}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="width50"> State : </td>
                                    <td className="width150">
                                      {popupDesc?.state || ""}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="width50"> Address : </td>
                                    <td className="width150">
                                      {popupDesc?.address || ""}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      } else if (popupDesc.category_type === "PROJECT") {
                        return (
                          <div
                            className={`${
                              popupDesc.property_type === "COMMERCIAL"
                                ? "skyBlueBg"
                                : ""
                            } ${
                              popupDesc.property_type === "INDUSTRIAL"
                                ? "purpleBg"
                                : ""
                            } ${
                              popupDesc.property_type === "RESIDENTIAL"
                                ? "yellowBg"
                                : ""
                            }
                  ${popupDesc.category_type === "CRFG" ? "greenBg" : ""}
                  ${
                    popupDesc.property_type === "NON RESIDENTIAL"
                      ? "royalBg"
                      : ""
                  }
                  ${popupDesc.property_type === "MIXED" ? "pinkBg" : ""} `}
                          >
                            <div className="pop-dec">
                              <table>
                                <tbody>
                                  <tr>
                                    <td className="width100"> Latitude : </td>
                                    <td className="width150">
                                      {popupDesc.latitude}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="width100"> Longitude : </td>
                                    <td className="width150">
                                      {popupDesc.longitude}
                                    </td>
                                  </tr>
                                  {popupDesc.data.pincode !== null ? (
                                    <tr>
                                      <td className="width100">Pincode : </td>
                                      <td className="width150">
                                        {popupDesc.data.pincode}
                                      </td>
                                    </tr>
                                  ) : null}

                                  {/* {popupDesc.Zone !== null ? (
                          <tr>
                            <td className="width100"> Zone : </td>
                            <td className="width150"> {popupDesc.Zone} </td>
                          </tr>
                        ) : null} */}
                                  {popupDesc.data.request_code !== undefined ? (
                                    <tr>
                                      <td className="width100">Request Id :</td>
                                      <td className="width150">
                                        {popupDesc.data.request_code}
                                      </td>
                                    </tr>
                                  ) : null}
                                  {popupDesc.data.project_name !== "" ? (
                                    <tr>
                                      <td className="width100">
                                        Project Name :
                                      </td>
                                      <td className="width150">
                                        {popupDesc.data.project_name}
                                      </td>
                                    </tr>
                                  ) : null}
                                  <tr>
                                    <td className="width100">
                                      Appraised Rate :
                                    </td>
                                    <td className="width150">
                                      {popupDesc.data.appraised_rate}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="width100">
                                      Approval Number :
                                    </td>
                                    <td className="width150">
                                      {popupDesc.data.approval_number}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="width100">
                                      Property Type :
                                    </td>
                                    <td className="width150">
                                      {popupDesc.property_type}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="width100"> Unit Type : </td>
                                    <td className="width150">
                                      {popupDesc.unit_type}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="width100">Unit Number :</td>
                                    <td className="width150">
                                      {popupDesc.data.unit_number}
                                    </td>
                                  </tr>
                                  {popupDesc.data.landarea_area !==
                                  undefined ? (
                                    <tr>
                                      <td className="width100">Land Area :</td>
                                      <td className="width150">
                                        {popupDesc.data.landarea_area}
                                      </td>
                                    </tr>
                                  ) : null}
                                  {popupDesc.data.sellablearea_area !==
                                  undefined ? (
                                    <tr>
                                      <td className="width100">
                                        Sellable Area :
                                      </td>
                                      <td className="width150">
                                        {popupDesc.data.sellablearea_area}
                                      </td>
                                    </tr>
                                  ) : null}

                                  {popupDesc.data.landarea_rate !==
                                  undefined ? (
                                    <tr>
                                      <td className="width100">Land Rate :</td>
                                      <td className="width150">
                                        {popupDesc.data.landarea_rate}
                                      </td>
                                    </tr>
                                  ) : null}

                                  {popupDesc.data.sellable_rate !==
                                  undefined ? (
                                    <tr>
                                      <td className="width100">
                                        Sellable Area Rate :
                                      </td>
                                      <td className="width150">
                                        {popupDesc.data.sellable_rate}
                                      </td>
                                    </tr>
                                  ) : null}

                                  <tr>
                                    <td className="width100">
                                      Property Entered On :
                                    </td>
                                    <td className="width150">
                                      {popupDesc.data.entered_on}
                                    </td>
                                  </tr>
                                  {popupDesc.data.age !== "" ? (
                                    <tr>
                                      <td className="width100">
                                        Percentage Completed :
                                      </td>
                                      <td className="width150">
                                        {popupDesc.data.percentage_completed}
                                      </td>
                                    </tr>
                                  ) : null}

                                  <tr>
                                    <td className="width100">
                                      Builder Group Name :
                                    </td>
                                    <td className="width150">
                                      {popupDesc.data.buildergroup_name}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="width100"> Address : </td>
                                    <td className="width150">
                                      {popupDesc.address}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      } else if (popupDesc?.category_type === "CRFG") {
                        console.log("JAVASCRIPT1235", popupDesc?.data);
                        let popUpdata = [];
                        if (popupDesc?.category_type === "CRFG" && popupDesc?.data) {
                          const dynamicLabel = {
                            land_area: "Land Area in sft",
                            land_rate: "Land Rate",
                            fsi_achieved: "Fsi Achieved",
                            bua_fsi_in_sqft: "BUA - FSI in Sft",
                            construction_cost_fsi: "Construction Cost FSI",
                            bua_non_fsi_parking_in_sqft:
                              "BUA - Non FSI (Parking) in Sft",
                            construction_cost_non_fsi:
                              "Construction Cost Non FSI",
                            saleable_area_sqft: "Saleable Area Sft",
                            saleable_rate_in_inr_or_sqft:
                              "Saleable Rate in INR/Sft",
                            fsi_rate_sqft: "Fsi Rate/sqft",
                            apf_number: "APF number",
                            no_of_floors: "No of Floors",
                            appraised_rate: "Appraised Rate",
                            report_approved_date: "Report approved Date",
                            percentage_completed:
                              "Progress as on date of visit",
                            value_in_inr_on_100perc: "Value in INR on 100%",
                            green_building: "Green Building(Y/N)",
                          };
                          const { unit_number, ...rest } = popupDesc.data || {};
                          Object.keys(dynamicLabel).forEach((ele) => {
                            popUpdata = [
                              ...popUpdata,
                              {
                                labele: dynamicLabel[ele],
                                value: popupDesc.data?.[ele] || '-',
                              },
                            ];
                            // }
                          });
                        }
                        return (
                          <div
                            className={`${
                              popupDesc.property_type === "COMMERCIAL"
                                ? "skyBlueBg"
                                : ""
                            } ${
                              popupDesc.property_type === "INDUSTRIAL"
                                ? "purpleBg"
                                : ""
                            } ${
                              popupDesc.property_type === "RESIDENTIAL"
                                ? "yellowBg"
                                : ""
                            }
                  ${popupDesc.category_type === "CRFG" ? "greenBg" : ""}
                  ${
                    popupDesc.property_type === "NON RESIDENTIAL"
                      ? "royalBg"
                      : ""
                  }
                  ${popupDesc.property_type === "MIXED" ? "pinkBg" : ""} `}
                          >
                            <div
                              className={`${
                                popupDesc.property_type === "COMMERCIAL"
                                  ? "skyBlueBg"
                                  : ""
                              } ${
                                popupDesc.property_type === "INDUSTRIAL"
                                  ? "purpleBg"
                                  : ""
                              } ${
                                popupDesc.property_type === "RESIDENTIAL"
                                  ? "yellowBg"
                                  : ""
                              }
                  ${popupDesc.category_type === "CRFG" ? "greenBg" : ""}
                  ${
                    popupDesc.property_type === "NON RESIDENTIAL"
                      ? "royalBg"
                      : ""
                  }
                  ${popupDesc.property_type === "MIXED" ? "pinkBg" : ""} `}
                            >
                              <div className="pop-dec">
                                <table>
                                  <tbody>
                                    {popupDesc?.data?.project_name ? (
                                      <tr>
                                        <td className="width100">
                                          Project Name :
                                        </td>
                                        <td className="width150">
                                          {popupDesc.data.project_name}
                                        </td>
                                      </tr>
                                    ) : null}
                                    {popupDesc?.data?.buildergroup_name && (
                                      <tr>
                                        <td className="width100">
                                          Builder Group :
                                        </td>
                                        <td className="width150">
                                          {popupDesc.data.buildergroup_name}
                                        </td>
                                      </tr>
                                    )}
                                    {!!popupDesc.property_type && (
                                      <tr>
                                        <td className="width100">
                                          Type of property :
                                        </td>
                                        <td className="width150">
                                          {popupDesc.property_type}
                                        </td>
                                      </tr>
                                    )}
                                    {popUpdata?.map((data, i) => {
                                      return (
                                        <tr key={i}>
                                          <td className="width100">
                                            {data.labele} :
                                          </td>
                                          <td className="width150">
                                            {data.value}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                    <tr>
                                      <td className="width100">Address :</td>
                                      <td className="width150">
                                        {popupDesc.address || "NA"}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        );
                      } else if (popupDesc?.category_type === "LVT") {
                        return (
                          <div
                            className={`${
                              popupDesc.property_type === "COMMERCIAL"
                                ? "skyBlueBg"
                                : ""
                            } ${
                              popupDesc.property_type === "INDUSTRIAL"
                                ? "purpleBg"
                                : ""
                            } ${
                              popupDesc.property_type === "RESIDENTIAL"
                                ? "yellowBg"
                                : ""
                            }
                  ${popupDesc?.category_type === "CRFG" ? "greenBg" : ""}
                  ${
                    popupDesc?.property_type === "NON RESIDENTIAL"
                      ? "royalBg"
                      : ""
                  }
                  ${popupDesc?.property_type === "MIXED" ? "pinkBg" : ""}
                  ${popupDesc?.property_type === "LAND" ? "amberBg" : ""}`}
                          >
                            <div className="pop-dec">
                              <table>
                                <tbody>
                                  <tr>
                                    <td className="width100"> Latitude : </td>
                                    <td className="width150">
                                      {popupDesc.latitude}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="width100"> Longitude : </td>
                                    <td className="width150">
                                      {popupDesc.longitude}
                                    </td>
                                  </tr>
                                  {popupDesc.Locality !== null ? (
                                    <tr>
                                      <td className="width100"> Locality : </td>
                                      <td className="width150">
                                        {popupDesc.Locality}
                                      </td>
                                    </tr>
                                  ) : null}
                                  {/* {popupDesc.Zone !== null ? (
                          <tr>
                            <td className="width100"> Zone : </td>
                            <td className="width150"> {popupDesc.Zone} </td>
                          </tr>
                        ) : null} */}
                                  <tr>
                                    <td className="width100">
                                      Category Type :
                                    </td>
                                    <td className="width150">
                                      {popupDesc.category_type}
                                    </td>
                                  </tr>
                                  {popupDesc.data.area_of_property !== "" ? (
                                    <tr>
                                      <td className="width100">
                                        Area of Property :
                                      </td>
                                      <td className="width150">
                                        {popupDesc.data.area_of_property}
                                      </td>
                                    </tr>
                                  ) : null}
                                  {popupDesc.data.location !== "" ? (
                                    <tr>
                                      <td className="width100"> Location : </td>
                                      <td className="width150">
                                        {popupDesc.data.location}
                                      </td>
                                    </tr>
                                  ) : null}
                                  {popupDesc.data
                                    .market_value_or_transacted_valuein_cr !==
                                  "" ? (
                                    <tr>
                                      <td className="width100">
                                        Market or Transacted Value in cr :
                                      </td>
                                      <td className="width150">
                                        {
                                          popupDesc.data
                                            .market_value_or_transacted_valuein_cr
                                        }
                                      </td>
                                    </tr>
                                  ) : null}
                                  {popupDesc.data
                                    .name_of_purchaser_or_entity !== "" ? (
                                    <tr>
                                      <td className="width100">
                                        Name of Purchaser or Entity :
                                      </td>
                                      <td className="width150">
                                        {
                                          popupDesc.data
                                            .name_of_purchaser_or_entity
                                        }
                                      </td>
                                    </tr>
                                  ) : null}
                                  {popupDesc.data.source_of_information !==
                                  "" ? (
                                    <tr>
                                      <td className="width100">
                                        Source of Information :
                                      </td>
                                      <td className="width150">
                                        {popupDesc.data.source_of_information}
                                      </td>
                                    </tr>
                                  ) : null}
                                  <tr>
                                    <td className="width100"> Hyperlink : </td>
                                    <td className="width150">
                                      <a
                                        href={popupDesc.data.hyperlinks}
                                        style={{
                                          color: "black",
                                          textDecoration: "underline",
                                        }}
                                        target="_blank"
                                      >
                                        {popupDesc.data.hyperlinks}
                                      </a>
                                    </td>
                                  </tr>
                                  {/* <tr>
                          <td className="width100">Percentage Completed :</td>
                          <td className="width150">
                            {popupDesc.data.percentage_completed}
                          </td>
                        </tr> */}
                                  {/* {popupDesc.data.total_resale !== "" ? (
                          <tr>
                            <td className="width100"> Total Resale : </td>
                            <td className="width150">
                              {popupDesc.data.total_resale}
                            </td>
                          </tr>
                        ) : null} */}
                                  <tr>
                                    <td className="width100"> Pincode : </td>
                                    <td className="width150">
                                      {popupDesc.data.pincode}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    );
  }
}
