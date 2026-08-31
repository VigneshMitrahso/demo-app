import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import { toast } from "react-toastify";
// components
import Header from "../../components/header";
// import ValuatioMap from "../../components/valuation-map";
import ValuatioFilter from "../../components/valuation-filter";

// css
import "./valuation.css";

class Valuation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appraiserate: true,
      sideBarShow: false,
      centroid: { lat: 21.1458, lng: 79.0882 },
      zoomLevel: 4.4,
      mapShowData: false,
      radius: 0,
    };
  }

  mapShowValues(response) {
    this.setState({
      centroid: {
        lat: parseFloat(response.data.centroid.latitude),
        lng: parseFloat(response.data.centroid.longitude),
      },
      zoomLevel: 16.4,
      mapShowData: true,
    });

    setTimeout(() => {
      this.setState({ mapShowData: false });
    }, 1000);
  }

  mapResetValue() {
    this.setState({
      centroid: { lat: 21.1458, lng: 79.0882 },
      zoomLevel: 4.4,
      mapShowData: true,
      radius: 0,
    });

    setTimeout(() => {
      this.setState({ mapShowData: false });
    }, 1000);
  }

  render() {
    const {
      sideBarShow,
      centroid,
      zoomLevel,
      mapShowData,
      appraiserate,
      radius,
    } = this.state;
    const { approvalValuationData } = this.props;

    return (
      <div className="automated-container">
        <Header
          sideBarCallBack={() => {
            this.setState({
              sideBarShow: !sideBarShow,
            });
          }}
          link="/landingPage"
        />
        {/* <div className="automated-sections"> */}
        {/* <div className="valuation-map-sections">
            {(() => {
              if (!mapShowData) {
                return (
                  <ValuatioMap
                    centroid={centroid}
                    zoomLevel={zoomLevel}
                    radius={radius}
                    appraiserate={appraiserate}
                    approvalValuationData={approvalValuationData}
                  />
                );
              }
            })()}
          </div> */}
        {/* <div className="valuation-filter-sections"> */}
        <ValuatioFilter
          appraiserateCallBack={(e) => {
            this.setState({
              appraiserate: !appraiserate,
            });
          }}
          radiusShow={(radiusShow) => {
            this.setState({
              radius: parseInt(`${radiusShow}` + "00"),
            });
          }}
          mapRestData={() => {
            this.mapResetValue();
          }}
          // successApprovalValuation={(response) => {
          //   this.mapShowValues(response);
          //   toast.success("Success", {
          //     position: toast.POSITION.BOTTOM_CENTER
          //   });
          // }}
          // failureApprovalValuation={(response) => {
          //   toast.warning("Please Enter All Feild", {
          //     position: toast.POSITION.BOTTOM_CENTER
          //   });
          // }}
          successBuildingName={(response) => {}}
          failureBuildingName={(response) => {}}
          {...this.props}
        />
        {/* </div> */}
      </div>
      // </div>
    );
  }
}

const mapStateToProps = (state) => ({
  approvalValuationData: state.getApprovalValuation.approvalValuationData,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Valuation);
