import React, { Component } from "react";

// plugins
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";

// function
import { _getStorageValue } from "../../comman/localStorage";
import { searchHistoryUser } from "../../action/searchHistory";

// constant
import { USER_ID, GET, ACCESS_TOKEN, USER_NAME } from "../../comman/constants";
import { getUserId, setVideo } from "../../comman/localStorage";

// css
// import "../filter/filter.css";

// urls

class HistoryFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
    };
  }

  getSearchValue(e) {
    this.setState({
      searchValue: e,
    });
  }

  getSearchedDataSelect() {
    const { searchValue } = this.state;
    _getStorageValue(USER_ID).then((userId) => {
      this.props.searchHistoryUser(
        userId,
        searchValue,
        this.props.successHistorCallBack,
        this.props.failureHistoryCallBack,
      );
    });
  }

  render() {
    return (
      <div>
        <div className="filter-sec hideScroll  pad0">
          <div className="filter-collape hideScroll ">
            <div className="filter-collapse-heading">
              <h6> Search based on Request Id </h6>
            </div>
            <div className="filter-collapse-Body">
              <div className="filter-body">
                <div className="search-element margin-btm-40 remove-icon">
                  <label>Request Id</label>
                  <Form.Control
                    placeholder="eg. REQ-000"
                    // value={bankValueState}
                    onChange={(e) => this.getSearchValue(e.target.value)}
                  />
                </div>

                <div className="filter-Button">
                  <button
                    onClick={() => {
                      this.getSearchedDataSelect();
                    }}
                    //   disabled={!applySearchStatus}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      searchHistoryUser: searchHistoryUser,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryFilter);
