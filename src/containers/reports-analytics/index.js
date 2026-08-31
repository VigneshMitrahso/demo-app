import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import Header from "../../components/header";
import { _getStorageValue } from "../../comman/localStorage";
import { AES_KEY } from "../../comman/constants";

const ReportsAnalytics = () => {
  const [aesKey, setAesKey] = useState("");

  useEffect(() => {
    _getStorageValue(AES_KEY).then((key) => {
      setAesKey(key);
    });
  }, []);

  return (
    <div className="dashboard-container">
      <Header aesKeyData={aesKey} />
      <div className="dashboard-section">
        <div className="landing-page-sec">
          <div className="card landing-card ">
            <Link className="landing-card1 report-card" to={"/reports-data"}>
              <img
                className="card-img-reort"
                src={require("../../assets/images/reportdata.png")}
                alt="sdsd"
              />
              <div className="card-body">
                <p className="card-text"> Branch and Agency Reports</p>
              </div>
            </Link>
          </div>
          <div className="card landing-card ">
            <Link
              className="landing-card1 report-card"
              to={"/reports-analytics-data"}
            >
              <img
                className="card-img-reort"
                src={require("../../assets/images/reportanalytics.png")}
                alt="sdsd"
              />
              <div className="card-body">
                <p className="card-text">Branch and Agency Reports Analytics</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
