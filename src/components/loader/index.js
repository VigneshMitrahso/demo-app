import React, { Component } from "react";

// css
import "./loader.css";

export default class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="component-loader">
        <label className="loader-circle"></label>
      </div>
    );
  }
}
