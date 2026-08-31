import React from "react";
import Header from "../../components/header";
import AnalaticsReport from "../../components/servey-report/reportCoverageComponent";

const Report = (props) => {
  return (
    <div className="geo-tracking-container">
      <Header link={"survey-report"} />
      <div
        className="agent-travel-data"
        style={{ flexDirection: "column", height: "auto" }}
      >
        <AnalaticsReport {...props} />
      </div>
    </div>
  );
};

export default Report;
