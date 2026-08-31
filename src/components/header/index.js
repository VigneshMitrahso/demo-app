import React, { Component } from "react";

// plugins
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Navbar, Nav, Dropdown, Button } from "react-bootstrap";
import { withRouter } from "react-router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// function
import { logoutUser } from "../../action/logout";
import { _getStorageValue } from "../../comman/localStorage";
import { decryptStatic } from "../../comman/decodeEncodeData";

// css
import "./header.css";
import { USER_NAME, AES_KEY, ACCESS_TOKEN } from "../../comman/constants";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      aesKey: "",
    };
  }

  componentWillMount() {
    _getStorageValue(USER_NAME).then((userName) => {
      if (userName !== undefined) {
        _getStorageValue(AES_KEY).then((key) => {
          this.setState({
            userName: userName,
            aesKey: key,
          });
        });
      }
    });
  }

  triggerLogout() {
    this.props.logoutUser(this.logOutCallBack);
    setTimeout(() => {
      if (this.props.isAdmin) {
        this.props.history.push("/");
      }
    }, 200);
  }

  logOutCallBack() {
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }

  render() {
    const { userName, aesKey } = this.state;
    const { login, pdfPageHeader, aesKeyData, isAdmin, link } = this.props;
    return (
      <div>
        <Navbar
          expand="lg"
          className={`${
            pdfPageHeader ? "bg-color passing-space" : " bg-color header-fixed"
          }`}
        >
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {pdfPageHeader ? (
              <div className="pdf-h-center">
                <img
                  src={require("../../assets/images/icicilogo.png")}
                  alt="dsd"
                />
              </div>
            ) : (
              <Navbar.Brand
                className="width20"
                href={` ${
                  pdfPageHeader ? "" : `${login ? "/" : "/landingPage"}`
                }  `}
              >
                <img src={require("../../assets/images/house.png")} alt="dsd" />
              </Navbar.Brand>
            )}

            {login ? null : (
              <Nav.Link className="width50 r-width" href="#">
                <div className="rapid-sec">
                  <h6>RAPID</h6>
                  <p> Realtime Appraisal of Property In Digital Mode </p>
                </div>
              </Nav.Link>
            )}

            {pdfPageHeader ? (
              <p className="width30left "> Mortgages Valuation Group</p>
            ) : (
              <>
                {link && (
                  <div
                    onClick={() => {
                      this.props.history.push(link);
                    }}
                    style={{ position: "absolute", left: 50, zIndex: 999 }}
                    className="navBackBtnContainer"
                  >
                    <Button className="navBackButton">
                      <FontAwesomeIcon
                        icon={faArrowLeft}
                        rotate={45}
                        color="white"
                        size={200}
                      />
                    </Button>
                  </div>
                )}
                <Dropdown className="width30left" disabled={pdfPageHeader}>
                  <Dropdown.Toggle className="profile-btn" id="dropdown-basic">
                    <img
                      src={require("../../assets/images/user.png")}
                      alt="user"
                    />
                    <p className="username">
                      {decryptStatic(userName, aesKey)}
                    </p>
                    <label className="username-hover">
                      {decryptStatic(userName, aesKey)}
                    </label>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="log-out">
                    <Dropdown.Item
                      onClick={() => {
                        this.triggerLogout();
                      }}
                      disabled={pdfPageHeader}
                    >
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      logoutUser: logoutUser,
    },
    dispatch,
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
