import React, { Component } from "react";

// plugins
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// function
import { resetgetImageUrlUser } from "../../action/getImageUrl";

// css
import "./side-bar.css";

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="side-bar-sec">
        <ul>
          <Link to="/property-map">
            <li>
              <img src={require("../../assets/images/world.png")} alt="map" />
              <label> Map Screen </label>
            </li>
          </Link>
          <Link to="/property-analytics">
            <li>
              <img
                src={require("../../assets/images/increasing.png")}
                alt="map"
              />
              <label> Analytics </label>
            </li>
          </Link>
          <Link
            to={"/customer-connect"}
            onClick={() => {
              this.props.resetgetImageUrlUser();
            }}
          >
            <li>
              <img src={require("../../assets/images/video.png")} alt="map" />
              <label> Video Calling </label>
            </li>
          </Link>
          <Link to="/history">
            <li>
              <img
                src={require("../../assets/images/history1.png")}
                alt="his"
              />
              <label> History </label>
            </li>
          </Link>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      resetgetImageUrlUser: resetgetImageUrlUser,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
