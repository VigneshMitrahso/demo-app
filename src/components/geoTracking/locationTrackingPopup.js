import React, { useEffect, useState } from "react";
import "./styles.css";
import { decryptStatic } from "../../comman/decodeEncodeData";
import { AES_KEY } from "../../comman/constants";
import { _getStorageValue } from "../../comman/localStorage";

export const PopupLocationTrackingDetails = (props) => {
  var myString = props.popupDesc.date_time;
  var date = new Date("myString");
  // var splitWords = myString.split(" ");
  // var split = splitWords[splitWords.indexOf("T")];
  console.log("alldata", props);
  return (
    <div className="geo-popup">
      <table>
        {props.isUsers ? (
          <tbody>
            <tr>
              <td className="width100"> Employee ID : </td>
              <td className="width150"> {props.popupDesc.emp_id} </td>
            </tr>
            <tr>
              <td className="width100"> Employee Name : </td>
              <td className="width150"> {props.popupDesc.emp_name} </td>
            </tr>
            <tr>
              <td className="width100"> RA EMP ID : </td>
              <td className="width150"> {props.popupDesc.ra_emp_id} </td>
            </tr>
            <tr>
              <td className="width100"> RA EMP NAME : </td>
              <td className="width150"> {props.popupDesc.ra_emp_name} </td>
            </tr>
            <tr>
              <td className="width100"> Designation : </td>
              <td className="width150"> {props.popupDesc.designation} </td>
            </tr>
            <tr>
              <td className="width100"> Zone : </td>
              <td className="width150"> {props.popupDesc.zone} </td>
            </tr>
            <tr>
              <td className="width100"> Region : </td>
              <td className="width150"> {props.popupDesc.region} </td>
            </tr>
            <tr>
              <td className="width100"> City : </td>
              <td className="width150"> {props.popupDesc.city} </td>
            </tr>
            <tr>
              <td className="width100"> Branch : </td>
              <td className="width150"> {props.popupDesc.branch} </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td className="width100"> Agent Name : </td>
              <td className="width150"> {props.agent_name} </td>
            </tr>
            <tr>
              <td className="width100"> Latitude : </td>
              <td className="width150"> {props.popupDesc.latitude} </td>
            </tr>
            <tr>
              <td className="width100"> Longitude : </td>
              <td className="width150"> {props.popupDesc.longitude} </td>
            </tr>
            <tr>
              <td className="width100"> Date & Time : </td>
              <td className="width150"> {props.popupDesc.date_time} </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};
