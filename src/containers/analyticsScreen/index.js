import React from "react";
import Header from "../../components/header";
import AnalyticsScreen from "../../components/analytics-screen/index";

const Analytics = (props) => {
  return (
    <div className="geo-tracking-container">
      <Header isAdmin={true} link="/analytics-landing-page" />
      <div className="agent-travel-data" >
        <AnalyticsScreen {...props} />
      </div>
    </div>
  );
};

export default Analytics;
