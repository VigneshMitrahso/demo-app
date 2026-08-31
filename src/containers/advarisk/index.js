import React, { useState } from "react";

// component
import Header from "../../components/header";
import AdvaRiskComp from "../../components/adva-risk";

const AdvaRisk = (props) => {
  return (
    <div className="dashboard-container">
      <Header link="/adva-risk" />
      <div className="report-parent-container">
        <AdvaRiskComp {...props} />
      </div>
    </div>
  );
};

export default AdvaRisk;
