import React, { useState, useEffect } from "react";
import "./styles.css";
import { useHistory } from "react-router-dom";

const PathBox = (props) => {
  let history = useHistory();
  let {
    stateValue,
    stateZoneValue,
    cityValue,
    zoneValue,
    branchValue,
    agencyValue,
    aggregateBy,
    callingFromBranch,
    callingFromAgency,
    fetching,
  } = props;

  useEffect(() => {
    console.log("aggregateBy", aggregateBy, stateValue);
  }, [aggregateBy]);
  useEffect(() => {}, []);

  const stateSelectedFromReportData = (value) => {
    let stateDataValue = {
      stateName: value,
      callingFromBranch: callingFromBranch,
      connectionValue: props.connection,
      currentYearValue: props.currentYear,
    };
    history.push("/reports-analytics-data", stateDataValue);
  };
  const citySelectedFromReportData = (value) => {
    let cityDataValue = {
      stateNameValue: stateValue,
      cityName: value,
      callingFromBranch: callingFromBranch,
      connectionValue: props.connection,
      currentYearValue: props.currentYear,
    };
    history.push("/reports-analytics-data", cityDataValue);
  };
  const zoneSelectedFromReportData = (value) => {
    let zoneDataValue = {
      zoneName: value,
      callingFromAgency: callingFromAgency,
      connectionValue: props.connection,
      currentYearValue: props.currentYear,
    };
    history.push("/reports-analytics-data", zoneDataValue);
  };
  const stateZoneSelectedFromReportData = (value) => {
    let stateZoneDataValue = {
      stateZoneName: value,
      callingFromAgency: callingFromAgency,
      connectionValue: props.connection,
      currentYearValue: props.currentYear,
    };
    console.log("selectedZoneName", stateZoneDataValue);
    history.push("/reports-analytics-data", stateZoneDataValue);
  };
  const zoneSelected = (value) => {
    if (callingFromAgency) {
      if (!fetching) {
        zoneSelectedFromReportData(value);
      }
    } else {
      if (!fetching) {
        props.updateByZone(value);
      }
    }
  };
  const stateZoneSelected = (value) => {
    if (callingFromAgency) {
      if (!fetching) {
        stateZoneSelectedFromReportData(value);
      }
    } else {
      if (!fetching) {
        props.updateByZoneState(value);
      }
    }
  };
  const stateSelected = (value) => {
    if (callingFromBranch) {
      if (!fetching) {
        stateSelectedFromReportData(value);
      }
    } else {
      if (!fetching) {
        props.updateByState(value);
      }
    }
  };
  const citySelected = (value) => {
    if (callingFromBranch) {
      if (!fetching) {
        citySelectedFromReportData(value);
      }
    } else {
      if (!fetching) {
        props.updateByCity(value);
      }
    }
  };
  const branchSelected = (value) => {
    props.updateByBranch(value);
  };
  const agencySelected = (value) => {
    props.updateByAgency(value);
  };

  console.log("zoneNameValue", stateZoneValue, zoneValue);

  return (
    <div className="pathboxContainer">
      {zoneValue && (
        <div
          className={
            stateZoneValue != "" ? "pathboxItem" : "disabledPathboxItem"
          }
          onClick={() => {
            stateZoneSelected != "" && zoneSelected(zoneValue);
          }}
        >
          <p className={stateZoneValue != "" && "path"}>{zoneValue}</p>
        </div>
      )}
      {stateValue && (
        <div
          className={cityValue != "" ? "pathboxItem" : "disabledPathboxItem"}
          onClick={() => {
            cityValue != "" && stateSelected(stateValue);
          }}
        >
          <p className={cityValue != "" && "path"}>{stateValue}</p>
        </div>
      )}
      {stateZoneValue && (
        <div
          className={agencyValue != "" ? "pathboxItem" : "disabledPathboxItem"}
          onClick={() => {
            agencyValue != "" && stateZoneSelected(stateZoneValue);
          }}
        >
          <p className={branchValue != "" && "path"}>{stateZoneValue}</p>
        </div>
      )}
      {cityValue && (
        <div
          className={branchValue != "" ? "pathboxItem" : "disabledPathboxItem"}
          onClick={() => {
            branchValue != "" && citySelected(cityValue);
          }}
        >
          <p className={agencyValue != "" && "path"}>{cityValue}</p>
        </div>
      )}
      {branchValue && (
        <div className="disabledPathboxItem">
          <p>{branchValue}</p>
        </div>
      )}
      {agencyValue && (
        <div className="disabledPathboxItem">
          <p>{agencyValue}</p>
        </div>
      )}
    </div>
  );
};

export default PathBox;
