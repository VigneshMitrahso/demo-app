import React from "react";
import Header from "../../components/header";
import VendorList from "../../components/vendor/index";

const Vendor = (props) => {
  return (
    <div className="geo-tracking-container">
      <Header isAdmin={true} link="/landingPage" />
      <div className="agent-travel-data" >
        <VendorList {...props} />
      </div>
    </div>
  );
};

export default Vendor;
