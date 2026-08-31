import React, { Component } from "react";
import Plyr from "plyr";
// import "plyr/dist/plyr.css";
// import "../../../node_modules/plyr/dist/plyr.css";
import "./voiceMemo.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { _getStorageValue } from "../../comman/localStorage";
import { getRecordedFile } from "../../action/voiceMemo";
import { USER_ID } from "../../comman/constants";
import CircularProgress from "@material-ui/core/CircularProgress";

class VoiceMemo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    _getStorageValue(USER_ID).then((id) => {
      this.props.getRecordedFile(
        id,
        this.props.reqId,
        this.props.selectedFilter.propType?.toUpperCase(),
        this.props.selectedFilter.unitType?.toUpperCase(),
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
    const player = Plyr.setup(".js-player", { controls });
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
  renderRecordings(records) {
    return records.map((record) => (
      <div className="record-list-container">
        {this.props.isPdf ? (
          <label>{this.getLastItem(record.rec_url)}</label>
        ) : (
          <div className="audio-lister">
            <label>{this.getLastItem(record.rec_url)}</label>
            <audio className="js-player" src={record.download_url}></audio>
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
          <h3>Voice Memos</h3>
        </div>
        {records.length > 0 ? (
          this.renderRecordings(records)
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
          <p className="audio-text"> No Records Found</p>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  records: state.voiceMemo.records,
  isFetching: state.voiceMemo.isFetching,
  selectedFilter: state.bankData.selectedTypes,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getRecordedFile: getRecordedFile,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(VoiceMemo);
