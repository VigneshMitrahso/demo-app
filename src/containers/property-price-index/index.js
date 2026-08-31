import React, { useState } from "react";

// component
import Header from "../../components/header";
import PpiFilter from "../../components/ppi-filter";
import PpiChart from "../../components/ppi-barchart";

// css
import "./ppi.css";
const PpiDashBoard = () => {
  const [analyticsChart, setAnalyticsChart] = useState();
  return (
    <div>
      <Header link="/landingPage" />
      <div className="ppi-sections ">
        <PpiChart analyticsChart={analyticsChart} />
        <PpiFilter
          setAnalyticsChart={setAnalyticsChart}
          analyticsChart={analyticsChart}
        />
      </div>
    </div>
  );
};

export default PpiDashBoard;
