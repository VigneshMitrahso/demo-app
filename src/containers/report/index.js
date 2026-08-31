import React from "react";
import Header from "../../components/header";
import AnalaticsReport from "../../components/report";

const Report = (props) => {
  return (
    <div className="geo-tracking-container">
      <Header link="/landingPage" />
      <div className="agent-travel-data">
        <AnalaticsReport {...props} />
      </div>
    </div>
  );
};

export default Report;
