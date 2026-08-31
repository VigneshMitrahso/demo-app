import React, { Component } from "react";

// css
import "./popupDetails.css";

export default class PopupValuationDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { popupDesc } = this.props;

    var date = "";
    var percentage = "";
    var pincode = "";
    var projectname = "";
    var unitnumber = "";
    var buildername = "";
    var buildingname = "";
    var approvalnumber = "";
    var appraisedrate = "";
    var historicNumber = "";
    var historiArray = "";
    var historiArrNu = "";
    if (popupDesc.data !== undefined) {
      var historicNumber = popupDesc.data.historic;
      var historiArray = Object.keys(historicNumber);
      var historiArrNu = historiArray[historiArray.length - 1];
    }
    if (popupDesc.data !== undefined) {
      var buildername = popupDesc.data.buildergroup_name;
    }
    if (popupDesc.data !== undefined) {
      var buildingname = popupDesc.data.building_name;
    }
    if (popupDesc.data !== undefined) {
      var appraisedrate = popupDesc.data.appraised_rate;
    }
    if (popupDesc.data !== undefined) {
      var approvalnumber = popupDesc.data.approval_number;
    }
    if (popupDesc.data !== undefined) {
      var projectname = popupDesc.data.project_name;
    }
    if (popupDesc.data !== undefined) {
      var unitnumber = popupDesc.data.unit_number;
    }
    if (popupDesc.data !== undefined) {
      var date = popupDesc.data.entered_on;
    }
    if (popupDesc.data !== undefined) {
      var percentage = popupDesc.data.percentage_completed;
    }
    if (popupDesc.data !== undefined) {
      var pincode = popupDesc.data.pincode;
    }
    return (
      <div
        className={`${popupDesc.property_type === "COMMERCIAL" ? "skyBlueBg" : null}
         ${popupDesc.property_type === "INDUSTRIAL" ? "purpleBg" : null}
          ${popupDesc.property_type === "RESIDENTIAL" ? "yellowBg" : null}
          ${popupDesc.category_type === "CRFG" ? "greenBg" : null}
          ${popupDesc.property_type === "NON RESIDENTIAL" ? "royalBg" : null}
          ${popupDesc.property_type === "MIXED" ? "pinkBg" : null}  `}
      >
        {/* otherBg */}
        <div className="pop-dec">
          <table>
            <tbody>
              {popupDesc.approvalnumber !== null ? (
                <tr>
                  <td className="width100"> Approval Number : </td>
                  <td className="width150"> {approvalnumber} </td>
                </tr>
              ) : null}
              <tr>
                <td className="width100"> Appraised Rate as of year : </td>
                <td className="width150">
                  {appraisedrate.toLocaleString("en-IN") +
                    " " +
                    "(" +
                    historiArrNu +
                    ")"}
                </td>
              </tr>
              <tr>
                <td className="width100"> Builder Group : </td>
                <td className="width150"> {buildername} </td>
              </tr>
              <tr>
                <td className="width100"> Project Name : </td>
                <td className="width150"> {projectname} </td>
              </tr>
              <tr>
                <td className="width100"> Building Name : </td>
                <td className="width150"> {buildingname} </td>
              </tr>
              {/* building_name */}
              <tr>
                <td className="width100"> Latitude : </td>
                <td className="width150"> {popupDesc.latitude} </td>
              </tr>
              <tr>
                <td className="width100"> Longitude : </td>
                <td className="width150"> {popupDesc.longitude} </td>
              </tr>

              {popupDesc.Locality !== null ? (
                <tr>
                  <td className="width100"> Locality : </td>
                  <td className="width150"> {popupDesc.Locality} </td>
                </tr>
              ) : null}

              {popupDesc.Zone !== null ? (
                <tr>
                  <td className="width100"> Zone : </td>
                  <td className="width150"> {popupDesc.Zone} </td>
                </tr>
              ) : null}

              <tr>
                <td className="width100"> Unit Number: </td>
                <td className="width150"> {unitnumber} </td>
              </tr>

              <tr>
                <td className="width100"> Property Type : </td>
                <td className="width150">{popupDesc.property_type}</td>
              </tr>

              <tr>
                <td className="width100"> Unit Type : </td>
                <td className="width150"> {popupDesc.unit_type} </td>
              </tr>
              <tr>
                <td className="width100"> Property Entered On (y/m/d): </td>
                <td className="width150">{date}</td>
              </tr>
              <tr>
                <td className="width100">Percentage Completed :</td>
                <td className="width150">{percentage}</td>
              </tr>
              <tr>
                <td className="width100"> Pincode : </td>
                <td className="width150">{pincode}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
