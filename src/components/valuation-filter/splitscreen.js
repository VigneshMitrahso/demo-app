import React, { Suspense, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import $ from "jquery";

const ValidationForm = React.lazy(() => import("./validation"));
const Individuals = React.lazy(() => import("./inidiviual"));

export const SplitScreen = (props) => {
  return (
    <div
      className="split-layout"
      style={{ flex: 1, display: "flex", flexDirection: "row" }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <div style={{ width: "50%" }}>
          <div style={{ width: "98%" }}>
            <ValidationForm {...props} />
          </div>
        </div>
        <div style={{ width: "50%" }}>
          <div style={{ width: "100%" }}>
            <Individuals {...props} />
          </div>
        </div>
      </Suspense>
    </div>
  );
};
