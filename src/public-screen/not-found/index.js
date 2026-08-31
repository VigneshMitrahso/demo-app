import React, { Component } from "react";

// plugins

// css
import "./not-found.css";

export default class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="not-found-sec">
        <div className="center-sec">
          <img
            src={require("../../assets/images/satsure-logo-new.svg")}
            alt="logo"
          />
          <p>Data Not Found</p>
        </div>
      </div>
    );
  }
}
