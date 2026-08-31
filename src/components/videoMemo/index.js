import React, { Component } from "react";
import Plyr from "plyr";
// import "plyr/dist/plyr.css";"
// import "../../../node_modules/plyr/dist/plyr.css";
import "./videoMemo.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { _getStorageValue } from "../../comman/localStorage";
import { getVideoRecordedFile } from "../../action/videoMemo";
import CircularProgress from "@material-ui/core/CircularProgress";
import { USER_ID } from "../../comman/constants";
class VideoMemo extends Component {
  componentDidMount() {
    _getStorageValue(USER_ID).then((id) => {
      this.props.getVideoRecordedFile(
        id,
        this.props.reqId,
        this.props.selectedFilter.propType.toUpperCase(),
        this.props.selectedFilter.unitType.toUpperCase(),
      );
    });
  }

  componentDidUpdate() {
    var controls = [
      "play",
      "progress",
      "duration",
      "mute",
      "volume",
      "download",
    ];
    const player = Plyr.setup(".js-playervideo", { controls });
    for (var i in player) {
      player[i].on("play", function (instance) {
        var source = instance.detail.plyr.source;
        for (var x in player) {
          if (player[x].source != source) {
            player[x].stop();
          }
        }
      });
    }
  }
  getLastItem = (thePath) => thePath.substring(thePath.lastIndexOf("/") + 1);
  renderVideoRecordings(records) {
    return records.map((record) => (
      <div className="record-list-container">
        {this.props.isPdf ? (
          <label>{this.getLastItem(record.rec_url)}</label>
        ) : (
          <div>
            <label>{this.getLastItem(record.rec_url)}</label>
            <div>
              <video
                className="js-playervideo"
                // width="100%"
                // height="240"
                // controls
                // controlslist="noplaybackrate"
                // disablePictureInPicture
              >
                <source src={record.download_url} type="video/mp4"></source>
              </video>
            </div>
          </div>
        )}
      </div>
    ));
  }
  render() {
    const { records } = this.props;
    return (
      <div>
        <div className="site-vist sitrepot marginTop">
          <h3>Video Memos</h3>
        </div>
        {records.length > 0 ? (
          this.renderVideoRecordings(records)
        ) : this.props.isFetching ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "20vh",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <p className="audio-text">No Records Found</p>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  records: state.videoMemo.records,
  isFetching: state.videoMemo.isFetching,
  selectedFilter: state.bankData.selectedTypes,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVideoRecordedFile: getVideoRecordedFile,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoMemo);
