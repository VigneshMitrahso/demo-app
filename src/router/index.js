import React, { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  useHistory,
  Route,
} from "react-router-dom";

// redried
import PrivateRoute from "../privateRouter";
import OnBoardingRoute from "../onBoardingRoute";

// componets
import DashBoard from "../containers/dash-board";
import Login from "../containers/login";
import Loader from "../components/loader";
import NotFound from "../public-screen/not-found";
import Analytics from "../containers/analytics";
import PropertyPriceindex from "../containers/property-price-index/index";
import LandingPage from "../components/landing-page";
import VideoCallScreen from "../containers/video-call";
import Users from "../containers/users";

import AutomatedValuation from "../containers/automated-valuation";
import ReportsAnalytics from "../containers/reports-analytics";
import GeoTracking from "../containers/geo-tracking";

import ServeyReport from "../components/servey-report";
import RapidWeb from "../containers/rapidWeb";
import ReportCoverage from "../containers/report/ReportCoverage";
import RapidVideoCall from "../components/rapidWeb/VideoCall";
import AzureVideoRoom from "../components/azure-video/azureVideoApp";
import ReportsData from "../components/reports-data";
import Report from "../containers/report";
import PropertyReportPdf from "../components/property-report-pdf";
import SurveyReportPdfGen from "../components/property-report-pdf/surveyReport";
import { _getStorageValue } from "../comman/localStorage";
import { USER_ADMIN } from "../comman/constants";
import AdminRoute from "../adminRoute";
import EmployeeAnalytics from "../containers/employee-analytics";
import Calcultor from "../components/calculator";
import RentalCalc from "../components/calculator/RentalCalc";

import CalculatorLandingPage from "../components/calculator/calculatorLanding";
import PremiumDiscount from "../components/calculator/premiumDiscount";
import MarketTransaction from "../components/MarketTransaction";
import AdvaRisk from "../containers/advarisk";
import OwnerShipLandingPage from "../components/owner-ship-landing-page";
import downloadReport from "../components/valuation-filter/downloadReport";
import AdvariskLanding from "../containers/advarisk-landing";
import AdvariskDetail from "../components/adva-risk/result";
import AdvareportTAT from "../containers/advareportTAT";
import ReportTable from "../components/valuation-filter/reportTable";
import Vendor from "../containers/vendor";
import MapMyIndia from "../containers/map-my-india";
import Analyticsscreen from "../containers/analyticsScreen/index";
import AnalyticsLandingPage from "../components/analytics-landing-page";

// import AnalyticsScreen from "../../components/analytics-landing-page/index";


const Routes = () => {
  return (
    <Router history={useHistory}>
      <Switch>
        <PrivateRoute exact path="/property-map" component={DashBoard} />
        <OnBoardingRoute exact path="/" component={Login} />
        <PrivateRoute exact path="/landingPage" component={LandingPage} />
        <PrivateRoute
          exact
          path="/customer-connect"
          component={VideoCallScreen}
        />
        <PrivateRoute exact path="/property-analytics" component={Analytics} />
        <PrivateRoute exact path="/reports-analytics-data" component={Report} />
        <AdminRoute exact path="/calculator" component={Calcultor} />
        <PrivateRoute
          exact
          path="/automated-valuation"
          component={AutomatedValuation}
        />
        {/* <PrivateRoute
          exact
          path="/reports-analytics"
          component={ReportsAnalytics}
        /> */}
        <PrivateRoute exact path="/reports-data" component={ReportsData} />
        <PrivateRoute
          exact
          path="/property-price-index"
          component={PropertyPriceindex}
        />
        {/* <AdminRoute
          exact
          path="/employee-analytics"
          component={EmployeeAnalytics}
        /> */}
        <PrivateRoute exact path="/adva-risk" component={AdvariskLanding} />
        <PrivateRoute exact path="/avm-report" component={ReportTable} />

        <AdminRoute exact path="/geo-tracking" component={GeoTracking} />
        <AdminRoute exact path="/users" component={Users} />
        {/* <AdminRoute exact path="/vendor" component={Vendor} /> */}
        <AdminRoute exact path="/analytics-landing-page" component={AnalyticsLandingPage} />

        <AdminRoute exact path="/analytics-screen" component={Analyticsscreen} />

        <AdminRoute exact path="/map-my-india" component={MapMyIndia} />

        <PrivateRoute exact path="/loader" component={Loader} />
        <Route exact path="/rapid" component={RapidWeb} />
        <PrivateRoute exact path="/survey-report" component={ServeyReport} />
        <PrivateRoute exact path="/survey-all-report" component={ServeyReport} />

        <Route exact path="/azure-video" component={AzureVideoRoom} />

        <PrivateRoute
          exact
          path="/survey-report-pdf"
          component={PropertyReportPdf}
        />

        <PrivateRoute
          exact
          path="/calculator-layout"
          component={CalculatorLandingPage}
        />
        <PrivateRoute
          exact
          path="/report-coverage"
          component={ReportCoverage}
        />
        <PrivateRoute
          exact
          path="/ownership-landing-page"
          component={OwnerShipLandingPage}
        />

        <PrivateRoute exact path="/adva-risk-request" component={AdvaRisk} />

        <PrivateRoute
          exact
          path="/adva-risk-report-tat"
          component={AdvareportTAT}
        />

        <PrivateRoute
          exact
          path="/adva-risk-detail"
          component={AdvariskDetail}
        />

        <Route exact path="/download-report" component={downloadReport} />

        <Route
          exact
          path="/survey-report-pdf-gen"
          component={SurveyReportPdfGen}
        />
        <PrivateRoute
          exact
          path="/market-transaction"
          component={MarketTransaction}
        />

        <AdminRoute exact path="/rentalCalculator" component={RentalCalc} />

        <AdminRoute
          exact
          path="/premium-discount"
          component={PremiumDiscount}
        />

        <PrivateRoute
          exact
          path="/analytics-landing-page"
          component={AnalyticsLandingPage}
        />

        <Route exact path="*" component={NotFound} />
      </Switch>
    </Router>
  );
};

export default Routes;
