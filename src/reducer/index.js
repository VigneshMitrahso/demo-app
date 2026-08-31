// @flow
import { combineReducers } from "redux";

// Authentication Reducers.
import login from "./login";
import logout from "./logout";
import getLoginEnc from "./loginEnc";

// property
import categoryType from "./categoryType";
import getState from "./getState";
import stateRequested from "./automationStateValuation";
import cityRequested from "./automationCityValuation";
import getStateByRadius from "./getStatesByRadius";
import getBuilder from "./getBuilder";
import getProjectName from "./getProjectName";
import getCityName from "./getCity";
import getProperty from "./getProperty";
import getUnitType from "./getUnitType";
import getBuilderByLatLong from "./getBuilderByLatLon";
import getApprovalNoByLatLong from "./getApprovalNoByLatLong";
import getProjectNoByLatLong from "./getProjectNameByLatLon";
import getAgency from "./getAgency";
import getBranch from "./getBranch";
import getApprovalNoByCity from "./getApprovalBycity";
import categoryTypeStateCity from "./categoryTypeStateCity";
import getPropertyByCity from "./getPropertyByCity";
import getUnitByStateCityType from "./getUnitTypeByStateCity";
import getYearByLatLon from "./yearByLatLon";
import getYearByStateCity from "./yearByCity";
import getPolygonArea from "./getPolygon";
import getAnalytics from "./getAnalytics";
import getMonth from "./monthByLatLong";
import getMonthByCityType from "./monthByCity";
import completedByCityType from "./completedBycity";
import completedByLatLon from "./completedByLatLon";
import noOfUnitByCity from "./getNoOfUnitByCity";
import noOfUnitByLatLon from "./getNoOfUnitByLatLon";
import getRateLimitByCityType from "./rateLimtByCity";
import getStateByRegion from "./getSearchByRegion";
import getZoneByCity from "./zoneByCity";
import getLocalityByCity from "./localityByCity";
import getGrid from "./getGrid";
import barByzone from "./barByzone";
import barByLocality from "./barByLocality";
import barAnalyitics from "./barChartAnalyitics";
import bankData from "./bankData";
import reportUserData from "./reportUser";
import getImageUrl from "./getImageUrl";
import getHistory from "./getHistory";
import reportImageData from "./postReport";
import reCallReportData from "./reCallReport";
import sessonLogin from "./sessonLogin";
import searchHistoryUserData from "./searchHistory";
import searchCityUser from "./searchCity";
import removeImageUser from "./removeImage";
import disableReqIdData from "./disableReqId";
import getApprovalValuation from "./getAutomatedValuation";
import getBuildingName from "./getBuildingName";
import voiceMemo from "./voiceMemo";
import videoMemo from "./videoMemo";
import geoTracking from "./geoTracking";
import getLocationTracking from "./locationTracking";
import getPPIName from "./getPPI";
import azureCalling from "./azureCalling";
import getBranchCities from "./getBranchCities";
import getBranchStates from "./getBranchStates";
import getBranchNames from "./getBranchNames";
import getBranchReport from "./getBranchReport";
import getBranchAgencyDates from "./getBranchAgencyDates";
import getAgencyCities from "./getAgencyCities";
import getAgencyStates from "./getAgencyStates";
import getAgencyNames from "./getAgencyNames";
import getAgencyReport from "./getAgencyReport";
import getAgencyZone from "./getAgencyZone";
import getReportsData from "./reportsData";

import reportAnalytics from "./reportAnalytics";
import serveyReport from "./serveyReport";
import employeeAnalytics from "./employeeAnalytics";
import users from "./users";

// Root Reducer.
const rootReducer = combineReducers({
  login: login,
  stateRequested: stateRequested,
  cityRequested: cityRequested,
  logout: logout,
  categoryType: categoryType,
  getState: getState,
  getStateByRadius: getStateByRadius,
  getBuilder: getBuilder,
  getProjectName: getProjectName,
  getCityName: getCityName,
  getProperty: getProperty,
  getUnitType: getUnitType,
  getBuilderByLatLong: getBuilderByLatLong,
  getApprovalNoByLatLong: getApprovalNoByLatLong,
  getProjectNoByLatLong: getProjectNoByLatLong,
  getAgency: getAgency,
  getBranch: getBranch,
  getApprovalNoByCity: getApprovalNoByCity,
  categoryTypeStateCity: categoryTypeStateCity,
  getPropertyByCity: getPropertyByCity,
  getUnitByStateCityType: getUnitByStateCityType,
  getYearByLatLon: getYearByLatLon,
  getYearByStateCity: getYearByStateCity,
  getPolygonArea: getPolygonArea,
  getAnalytics: getAnalytics,
  getMonth: getMonth,
  getMonthByCityType: getMonthByCityType,
  completedByCityType: completedByCityType,
  completedByLatLon: completedByLatLon,
  noOfUnitByCity: noOfUnitByCity,
  noOfUnitByLatLon: noOfUnitByLatLon,
  getRateLimitByCityType: getRateLimitByCityType,
  getStateByRegion: getStateByRegion,
  getZoneByCity: getZoneByCity,
  getLocalityByCity: getLocalityByCity,
  getGrid: getGrid,
  barByzone: barByzone,
  barByLocality: barByLocality,
  barAnalyitics: barAnalyitics,
  bankData: bankData,
  reportUserData: reportUserData,
  getImageUrl: getImageUrl,
  getHistory: getHistory,
  reportImageData: reportImageData,
  reCallReportData: reCallReportData,
  sessonLogin: sessonLogin,
  searchHistoryUserData: searchHistoryUserData,
  searchCityUser: searchCityUser,
  removeImageUser: removeImageUser,
  disableReqIdData: disableReqIdData,
  getLoginEnc: getLoginEnc,
  getApprovalValuation: getApprovalValuation,
  getBuildingName: getBuildingName,
  getLocationTracking: getLocationTracking,
  getPPIName: getPPIName,
  voiceMemo,
  videoMemo,
  geoTracking,
  azureCalling: azureCalling,
  getBranchCities: getBranchCities,
  getBranchStates: getBranchStates,
  getBranchNames: getBranchNames,
  getBranchReport: getBranchReport,
  getBranchAgencyDates: getBranchAgencyDates,
  getAgencyCities: getAgencyCities,
  getAgencyStates: getAgencyStates,
  getAgencyNames: getAgencyNames,
  getAgencyReport: getAgencyReport,
  reportAnalytics,
  getAgencyZone: getAgencyZone,
  getReportsData: getReportsData,
  serveyReport,
  employeeAnalytics,
  users,
});

export default rootReducer;
