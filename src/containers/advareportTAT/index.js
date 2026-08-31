import React, { useState } from "react";

// component
import Header from "../../components/header";
import ReportTATComponent from "./reportTATComponent";
import "./styles.css";

const AdvareportTAT = (props) => {
  return (
    <div className="dashboard-container">
      <Header link="/adva-risk" />
      <div className="report-parent-container" style={{ width: "100%" }}>
        <div
          className="agent-travel-data"
          style={{ flexDirection: "column", height: "auto", width: "98%" }}
        >
          <ReportTATComponent {...props} />
        </div>
      </div>
    </div>
  );
};

export default AdvareportTAT;
