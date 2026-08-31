import React, { Component } from "react";

// plugins
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// components

// function
// import { _getStorageValue } from "../../comman/localStorage"
import { _getStorageValue } from "../../comman/localStorage";
import { apiVideoCall } from "../../comman/connect";
import { getImageUrlUser } from "../../action/getImageUrl";

// constant
import { USER_ID, GET, ACCESS_TOKEN, USER_NAME } from "../../comman/constants";
import { getUserId, setVideo, getVideo } from "../../comman/localStorage";

// css
import {
  createRoomUrl,
  genrateTokenUrl,
  smsUrl,
  endRoomCallUrl,
} from "../../comman/urls";

// import "./analytics.css";

// constant
// import { USER_ID } from "../../comman/constants";

class ImageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {} = this.state;

    const { DownloadUrlImage } = this.props;
    return (
      <ul className="customer-sec  pdf-img-sec ">
        {DownloadUrlImage.map((data, id) => {
          return (
            <li key={id}>
              <img className=" image-map-sec" src={data} />
            </li>
          );
        })}
      </ul>
    );
  }
}

const mapStateToProps = (state) => ({});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getImageUrlUser: getImageUrlUser,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageContainer);
