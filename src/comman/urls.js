// Local development Base URLs
// export const AUTH_BASE_URL = `http://13.235.169.190:8787/v1`;
// export const BASE_URL2 = `http://13.235.169.190:8787/v1`;

import { isEmpty } from "lodash";

// Deployment Base URLs.
export const BASE_URL2 = process.env.REACT_APP_BASE_URL2;
export const AUTH_BASE_URL = process.env.REACT_APP_AUTH_BASE_URL;

export const LOGIN_URL = `${AUTH_BASE_URL}/login-bank-user`;
export const RAPID_LOGIN_URL = `${AUTH_BASE_URL}/login-customer-user`;
export const LOGOUT_URL = `${AUTH_BASE_URL}/logout`;
export const REFERSH_URL = `${AUTH_BASE_URL}/refresh-both-tokens`;
export const SESSON_LOGIN_URL = `${AUTH_BASE_URL}/login-bank-user`;
export const SESSON_LOGOUT_URL = `${BASE_URL2}/logout`;
export const SESSON_REFERSH_URL = `${BASE_URL2}/refresh-both-tokens`;

export const ENCRYPT_URL = `${BASE_URL2}/encrypt/`;
export const LOG_IN_ENCRYPT_URL = `${BASE_URL2}/rsa/`;

// Commonly use state City Api implementation
// State
export function stateUrl(stateUrl) {
  return `${BASE_URL2}/user/${stateUrl}`;
}
// City
export function cityUrl(cityURl) {
  return `${BASE_URL2}/user/${cityURl}`;
}
// property types
// case 1
export function agencyUrl(userId, branchStatus, agencyStatus, urls) {
  var bankUrl = `${BASE_URL2}/branch_agency/${userId}/branch-agency-details?branch_indicator=${branchStatus}&agency_indicator=${agencyStatus}`;

  if (urls !== "") {
    bankUrl += urls;
  }

  return bankUrl;
}

export function getBranchStateUrl(userId) {
  return `${BASE_URL2}/user/${userId}/get-branch-state`;
}
export function getBranchCityUrl(userId, stateName) {
  return `${BASE_URL2}/user/${userId}/get-branch-city?state_name=${stateName}`;
}
export function getBranchListUrl(userId, stateName, cityName) {
  return `${BASE_URL2}/user/${userId}/branch-list?state_name=${stateName}&city_name=${cityName}`;
}
export function getBranchReportUrl(userId, branchCode, date) {
  return `${BASE_URL2}/user/${userId}/get-branch-connect-data?branch_code=${branchCode}&report_date=${date}`;
}

export function getBranchAgencyDatesUrl(userId, type, code) {
  return `${BASE_URL2}/user/${userId}/branch-agency-report-date?property_type=${type}&subsidiary_code=${code}`;
}

export function getAgencyStateUrl(userId, zone) {
  return `${BASE_URL2}/user/${userId}/get-agency-data?zone_name=${zone}`;
}
export function getAgencyCityUrl(userId, stateName) {
  return `${BASE_URL2}/user/${userId}/get-agency-city?state_name=${stateName}`;
}
export function getAgencyListUrl(userId, stateName, zone) {
  return `${BASE_URL2}/user/${userId}/agency-list?state_name=${stateName}&zone_name=${zone}`;
}
export function getAgencyReportUrl(userId, agencyId, date) {
  return `${BASE_URL2}/user/${userId}/get-agency-connect-data?agency_id=${agencyId}&report_date=${date}`;
}

// case 2
export function categoryByLatLonUrl(userId, lat, lon, radius, urls = "") {
  var radiusUrl = `${BASE_URL2}/user/${userId}/latitude/${lat}/longitude/${lon}/get-fill-value?value=category_type&searchRadius=${radius}`;

  if (urls !== "") {
    radiusUrl += urls;
  }
  return radiusUrl;
}

// export function categoryByUrl(userId, lat, lon, radius) {
//   return `${BASE_URL2}/user/${userId}/latitude/${lat}/longitude/${lon}/get-fill-value?value=category_type&searchRadius=${radius}`;
// }

export function createVideoCall(userId, reqId) {
  return `${BASE_URL2}/user/${userId}/new-create-call?request_id=${reqId}&dashboard=${true}`;
}

export function customerVideoCall(userId, reqId) {
  return `${BASE_URL2}/user/${userId}/new-customer-call-access?req_id==${reqId}`;
}

export function customerAddressURL(userId, lat, lon) {
  return `${BASE_URL2}/admin/${userId}/get-location?latitude=${lat}&longitude=${lon}`;
}



export function cancelVideoCall(userId, reqId) {
  return `${BASE_URL2}/user/${userId}/azure-end-call?room=${reqId}&dashboard=${true}`;
}

export const uploadImageURL = (type, appName, userID, reqId) => {
  const url = `${BASE_URL2}/user/${userID}/upload-image?request_id=${reqId}&source=${type}&app_name=${appName}`;
  return url;
};

export const getUserLocationURL = (userID, reqID) => {
  const url = `${BASE_URL2}/user/${userID}/get-customer-location?request_id=${reqID}`;
  return url;
};

export function joinVideoCall(userId, reqId) {
  return `${BASE_URL2}/user/${userId}/customer-call-access?req_id=${reqId}`;
}
export function builderByLatLonUrl(
  userId,
  lat,
  lon,
  radius,
  propertyUrl,
  urlString,
) {
  var radiusUrl = `${BASE_URL2}/user/${userId}/latitude/${lat}/longitude/${lon}/get-fill-value?category_type=${propertyUrl}&value=buildergroup_name&searchRadius=${radius}`;
  if (urlString !== "") {
    radiusUrl += urlString;
  }
  return radiusUrl;
}

export function approvalByLatLonUrl(
  userId,
  lat,
  lon,
  radius,
  propertyUrl,
  urlString,
) {
  var radiusUrl = `${BASE_URL2}/user/${userId}/latitude/${lat}/longitude/${lon}/get-fill-value?category_type=${propertyUrl}&value=approval_number&searchRadius=${radius}`;
  if (urlString !== "") {
    radiusUrl += urlString;
  }

  return radiusUrl;
}

export function projectByLatLonUrl(
  userId,
  lat,
  lon,
  radius,
  propertyUrl,
  urlString,
) {
  var radiusUrl = `${BASE_URL2}/user/${userId}/latitude/${lat}/longitude/${lon}/get-fill-value?category_type=${propertyUrl}&value=project_name&searchRadius=${radius}`;
  if (urlString !== "") {
    radiusUrl += urlString;
  }
  return radiusUrl;
}

export function propertyByLatLonUrl(userId, lat, lon, radius, catagroy, urls) {
  var radiusUrl = `${BASE_URL2}/user/${userId}/latitude/${lat}/longitude/${lon}/get-fill-value?category_type=${catagroy}&value=property_type&searchRadius=${radius}`;
  if (urls !== "") {
    radiusUrl += urls;
  }

  return radiusUrl;
}

export function unitTypeByLatLonUrl(
  userId,
  lat,
  lon,
  radius,
  unitType,
  urlString,
) {
  var radiusUrl = `${BASE_URL2}/user/${userId}/latitude/${lat}/longitude/${lon}/get-fill-value?category_type=${unitType}&value=unit_type&searchRadius=${radius}`;
  if (urlString !== "") {
    radiusUrl += urlString;
  }

  return radiusUrl;
}

export function yearByLatLonUrl(
  userId,
  lat,
  lon,
  radius,
  propertyUrl,
  urlString,
) {
  var radiusUrl = `${BASE_URL2}/user/${userId}/latitude/${lat}/longitude/${lon}/get-fill-value?category_type=${propertyUrl}&value=year&searchRadius=${radius}`;
  if (urlString !== "") {
    radiusUrl += urlString;
  }
  return radiusUrl;
}

export function monthByLatLonUrl(
  userId,
  lat,
  lon,
  radius,
  propertyUrl,
  urlString,
) {
  var radiusUrl = `${BASE_URL2}/user/${userId}/latitude/${lat}/longitude/${lon}/get-fill-value?category_type=${propertyUrl}&value=month&searchRadius=${radius}`;
  if (urlString !== "") {
    radiusUrl += urlString;
  }
  return radiusUrl;
}

export function completedByLatLonUrl(userId, lat, lon, radius) {
  return `${BASE_URL2}/user/${userId}/latitude/${lat}/longitude/${lon}/get-fill-value?value=completed&searchRadius=${radius}`;
}

export function noOfUnitByLatLonUrl(userId, lat, lon, radius) {
  return `${BASE_URL2}/user/${userId}/latitude/${lat}/longitude/${lon}/get-fill-value?value=number_of_units&searchRadius=${radius}`;
}

export function searchRadiusUrl(userId, lat, lon, radius, urls, urlString) {
  var radiusUrl = `${BASE_URL2}/user/${userId}/latitude/${lat}/longitude/${lon}/property`;
  if (urls !== "" && !!urlString) {
    radiusUrl += urls + `${urlString}&searchRadius=${radius}`;
  } else if (urls !== "") {
    radiusUrl += urls + `&searchRadius=${radius}`;
  } else if (urlString !== "") {
    radiusUrl += urlString + `&searchRadius=0`;
  }
  return radiusUrl;
}

// // get property location

// export function searchPropertyUrl(userId, data) {

//   locLat,
//   locLong,
//   north,
//   east,
//   south,
//   west
//   var radiusUrl = `${BASE_URL2}/user/${userId}/latitude/${data.locLat}/longitude/${data.locLong}/property`;

//   if (urls !== "") {
//     radiusUrl += urls + `&searchRadius=${radius}`;
//   }

//   return radiusUrl;
// }

// case 3

export function categoryTypeStateCityUrl(
  userId,
  stateId,
  cityId,
  zoneLocality,
) {
  if (zoneLocality) {
    return `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/get-fill-value?${zoneLocality}&value=category_type`;
  } else {
    return `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/get-fill-value?value=category_type`;
  }
}

export function projectNameUrl(userId, stateId, cityId, propertyUrl) {
  return `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/get-fill-value?category_type=${propertyUrl}&value=project_name`;
}

export function builderUrl(userId, stateId, cityId, propertyUrl) {
  return `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/get-fill-value?category_type=${propertyUrl}&value=buildergroup_name`;
}

export function approvalByCityUrl(userId, stateId, cityId, propertyUrl) {
  return `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/get-fill-value?category_type=${propertyUrl}&value=approval_number`;
}

export function propertyByCityUrl(userId, stateId, cityId, category) {
  return `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/get-fill-value?category_type=${category}&value=property_type`;
}

export function unitTypeByCityUrl(userId, stateId, cityId, unitType) {
  return `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/get-fill-value?category_type=${unitType}&value=unit_type`;
}

export function yearByCityUrl(userId, stateId, cityId, propertyTypeUrl) {
  return `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/get-fill-value?category_type=${propertyTypeUrl}&value=year`;
}

export function monthByCityUrl(userId, stateId, cityId, propertyTypeUrl) {
  return `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/get-fill-value?category_type=${propertyTypeUrl}&value=month`;
}

export function completedByCityUrl(userId, stateId, cityId) {
  return `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/get-fill-value?value=completed`;
}

export function noOfUnitByCityUrl(userId, stateId, cityId) {
  return `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/get-fill-value?value=number_of_units`;
}

export function rateLimitByCityUrl(userId, stateId, cityId) {
  return `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/get-fill-value?value=rate_limit`;
}

export function zoneByCityUrl(userId, stateId, cityId) {
  return `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/get-fill-value?value=zone`;
}

export function localityByCityUrl(userId, stateId, cityId) {
  return `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/get-fill-value?value=pincode`;
  // old url
  // return `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/get-fill-value?zone=${zoneId}&value=locality`;
}

export function searchRegionUrl(userId, stateId, cityId, url) {
  var regionUrl = `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/property`;

  if (url !== "") {
    regionUrl += url;
  }

  return regionUrl;
}

export function searchReqUrl(userId, category, req) {
  var regionUrl = `${BASE_URL2}/user/${userId}/property_req?req=${req}&search_category=${category}`;

  return regionUrl;
}

// third party api

export function polygonAreaUrl() {
  return `/token?identity=TestName&roomName=TestRoom`;
}

// analytics
export function analyticsUrl(userId, stateId, cityId, urls) {
  var analyticUrls = `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/analytics`;

  if (urls !== "") {
    analyticUrls += urls;
  }
  return analyticUrls;
}

export function barAnalyticsUrl(userId, stateId, cityId, urls) {
  var analyticUrls = `${BASE_URL2}/user/${userId}/state/${stateId}/city/${cityId}/bar-analytics`;

  if (urls !== "") {
    analyticUrls += urls;
  }
  return analyticUrls;
}

// third party
export function gridUrl(bbox) {
  return `${BASE_URL2}/grid-data/${bbox}`;
}

// video callsm

export function bankDataUrl(userId, reqId) {
  return `${BASE_URL2}/user/${userId}/bank-data?request_id=${reqId}`;
}
export function recordingGetURL(userID, reqID, propertyType, unitType) {
  return `${BASE_URL2}/user/${userID}/get-recording-url?request_id=${reqID}&source=app&property_type=${propertyType}&unit_type=${unitType}`;
}
export function createRoomUrl(userId, reqId, mobileNo, userName) {
  return `${BASE_URL2}/user/${userId}/create-room?request_id=${reqId}&mobile=${mobileNo}&name=${userName}`;
}

export function genrateTokenUrl(
  userId,
  participantName,
  roomName,
  secretId,
  videoSid,
) {
  return `${BASE_URL2}/user/${userId}/generate-access-token?participant=${participantName}&room=${roomName}&secret=${secretId}&sid=${videoSid}`;
}

export function endRoomCallUrl(userId, roomName) {
  return `${BASE_URL2}/user/${userId}/end-call?room=${roomName}`;
}

export function smsUrl(userId, userName) {
  return `${BASE_URL2}/user/${userId}/send-sms?request_id=${userName}`;
}
export function smsWhatsappUrl(userId, userName) {
  return `${BASE_URL2}/user/${userId}/send-whatsapp?request_id=${userName}`;
}

export function callDataUrl(userId, reqID) {
  return `${BASE_URL2}/user/${userId}/call-data?request_id=${reqID}`;
}

export const updateLocationURL = (userID, reqID, latitude, longitude) => {
  return `${BASE_URL2}/user/${userID}/update-location?request_id=${reqID}&latitude=${latitude}&longitude=${longitude}`;
};

export const joinURL = (userID, name, reqID, secret, sid) => {
  const url = `${BASE_URL2}/user/${userID}/generate-access-token?participant=${name}&room=${reqID}&secret=${secret}&sid=${sid}`;
  return url;
};
export function disableReqIdUrl(userId, name, mobileNo) {
  return `${BASE_URL2}/user/${userId}/disable-credentials?request_id=${name}&mobile_number=${mobileNo}`;
}
// https://dev.api.satsure.co/skies/v1/user/f63beda1-7a5a-11eb-b3c6-000000000000/
// get-video-recording-url?request_id=Bd6zU5bPeTo0Y5NFMJEeDJ1U5Pdo4NDbX993tGglc7k%253D&source=app
// Video recording
export function videoRecordingGetURL(userID, reqID, propertyType, unitType) {
  return `${BASE_URL2}/user/${userID}/get-video-recording-url?request_id=${reqID}&source=app&property_type=${propertyType}&unit_type=${unitType}`;
}
// report user

export function reportUserUrl(userId, reqId) {
  return `${BASE_URL2}/user/${userId}/report-data?request_id=${reqId}`;
}

export const getReportURL = (userID, reqId, properType, unitType) => {
  const url = `${BASE_URL2}/user/${userID}/recall-report-data?request_id=${reqId}&property_type=${properType}&unit_type=${unitType}`;
  return url;
};

export const updateReportURL = (userID, reqId, status) => {
  const url = `${BASE_URL2}/user/${userID}/update-report-data?request_id=${reqId}&status=${status}`;
  return url;
};

// https://dev.api.satsure.co/skies/v1/user/f63beda1-7a5a-11eb-b3c6-000000000000/get-image-url?request_id=MVHPysRXXW2Z0c%252FwKwhaNarVpqtIJKWViWTulF6Yxcc%253D&source=app%2Cscratchpad
export function getImageUrl(userId, reqId) {
  return `${BASE_URL2}/user/${userId}/get-image-url?request_id=${reqId}&source=app%2Cscratchpad`;
}
export function postImageDataUrl(userId, reqId, status) {
  return `${BASE_URL2}/user/${userId}/update-report-data?request_id=${reqId}&status=${status}`;
}

export function reCallReportUrl(userId, reqId) {
  return `${BASE_URL2}/user/${userId}/recall-report-data?request_id=${reqId}`;
}
export function removeImageUrl(userId, imageUrl, reqId) {
  return `${BASE_URL2}/user/${userId}/remove-image?img_url=${imageUrl}&request_id=${reqId}`;
}

// history

export function getHistoryUrl(userId) {
  return `${BASE_URL2}/user/${userId}/status-history`;
}

export function searchHistoryUserUrl(userId, reqId) {
  return `${BASE_URL2}/user/${userId}/status-history?request_id=${reqId}`;
}

export function calculatorUrl(userId, query = "") {
  let urlData = `${BASE_URL2}/admin/${userId}/residual-categories`;
  if (!!query) {
    urlData = `${urlData}?${query}`;
  }
  return urlData;
}

export function calculatorCounterUrl(userId) {
  let urlData = `${BASE_URL2}/analytics/${userId}/api-counter`;
  return urlData;
}


export function calculatoTablerUrl(userId, query = "") {
  let urlData = `${BASE_URL2}/admin/${userId}/residual-calculator`;
  if (!!query) {
    urlData = `${urlData}?${query}`;
  }
  return urlData;
}

export function calculatorCityurl(userId, key) {
  return `${BASE_URL2}/admin/${userId}/residual-suggested-data-categories`;
}

export function calculatorSuggestedData(userId, city) {
  return `${BASE_URL2}/admin/${userId}/residual-suggested-data?city=${city}`;
}

// search city
export function searchCityUrl(userId, key) {
  return `${BASE_URL2}/user/${userId}/key-search?keyword=${key}`;
}

// refer

export function branchUrl(userId) {
  return `${BASE_URL2}/user/${userId}/branch-details`;
}

export function statePropertyUrl(userId, propertyId, stateId, lon, lat) {
  var statePropertyBaseUrl = `${BASE_URL2}/user/${userId}/property-type/${propertyId}/state/${stateId}/property`;

  if (lat != null) {
    statePropertyBaseUrl += `?centroid=` + lon + `%2c` + lat;
  }

  return statePropertyBaseUrl;
}

// error-report
export function errorReportUrl() {
  return `${BASE_URL2}/master/error-report`;
}

//geo Tracking URLS
// http://localhost:5050/skies/v1/user/f63beda1-7a5a-11eb-b3c6-000000000000/
// bank-user-location?timeline=week
// http://localhost:5050/skies/v1/user/f63beda1-7a5a-11eb-b3c6-000000000000/
// bank-user-location?timeline=week&zone=zone
export function getTimelineURL(userID, timeline, timelineFilter) {
  if (
    timelineFilter === "zone" ||
    timelineFilter === "region" ||
    timelineFilter === "city"
  ) {
    const url = `${BASE_URL2}/user/${userID}/bank-user-location?timeline=${timeline}&${timelineFilter}=${timelineFilter}`;
    return url;
  } else {
    const url = `${BASE_URL2}/user/${userID}/bank-user-location?timeline=${timeline}`;
    return url;
  }
}
// http://localhost:5050/skies/v1/user/f63beda1-7a5a-11eb-b3c6-000000000000/
// bank-user-location?start-date=2022-01-24&end-date=2022-01-26 &zone=zone &region=region &city=city
export function getLocationURL(userID, startDateG, endDateG, filter) {
  if (startDateG && endDateG && filter === "zone") {
    const url = `${BASE_URL2}/user/${userID}/bank-user-location?start_date=${startDateG}&end_date=${endDateG}&zone=${filter}`;
    return url;
  } else if (startDateG && endDateG && filter === "region") {
    const url = `${BASE_URL2}/user/${userID}/bank-user-location?start_date=${startDateG}&end_date=${endDateG}&region=${filter}`;
    return url;
  } else if (startDateG && endDateG && filter === "city") {
    const url = `${BASE_URL2}/user/${userID}/bank-user-location?start_date=${startDateG}&end_date=${endDateG}&city=${filter}`;
    return url;
  } else {
    const url = `${BASE_URL2}/user/${userID}/bank-user-location?start_date=${startDateG}&end_date=${endDateG}`;
    return url;
  }
}
// http://localhost:5050/skies/v1/user/f63beda1-7a5a-11eb-b3c6-000000000000/
// bank-user-location/519a9707-df51-4eba-9783-7cc1b394899c?timeline=week
// http://localhost:5050/skies/v1/user/f63beda1-7a5a-11eb-b3c6-000000000000/
// bank-user-location/519a9707-df51-4eba-9783-7cc1b394899c?start_date=2022-02-21&end_date=2022-02-28
export function getAgentGeoData(
  userID,
  agentID,
  agentTimeLine,
  agentidStart,
  agentidEnd,
) {
  if (agentTimeLine === "week" || agentTimeLine === "month") {
    const url = `${BASE_URL2}/user/${userID}/bank-user-location/${agentID}?timeline=${agentTimeLine}`;
    return url;
  } else {
    const url = `${BASE_URL2}/user/${userID}/bank-user-location/${agentID}?start_date=${agentidStart}&end_date=${agentidEnd}`;
    return url;
  }
}
//Automated-Valuation
// State
export function automatedValuationStateUrl(userId) {
  var automatedValuationStateUrl = `${BASE_URL2}/user/${userId}/automated-valuation/state`;
  return automatedValuationStateUrl;
}

export function getAVMurl(userId, url) {
  var getAVMurl = `${BASE_URL2}/avm/${userId}/getavm?${url}`;
  return getAVMurl;
}

export function getAvmDataUrl(userId, requestID, property, unit) {
  var getAVMurl = `${BASE_URL2}/avm/${userId}/get_avm_data_request?request_code=${requestID}&property_type=${property}&unit_type=${unit}`;
  return getAVMurl;
}

export function updateAvmDataUrl(userId) {
  var getAVMurl = `${BASE_URL2}/avm/${userId}/insert_avm_data_request`;
  return getAVMurl;
}

export function getCategoryUrl(userId, id) {
  var getAVMurl = `${BASE_URL2}/user/${userId}/categories?id=${id}`;
  return getAVMurl;
}

// City
export function automatedValuationCityUrl(userId, state_name) {
  var automatedValuationCityUrl = `${BASE_URL2}/user/${userId}/automated-valuation/state/${state_name}/city`;
  return automatedValuationCityUrl;
}
// Building Name
export function approvalBuildingNameUrl(userId, approvalNumber, project_name) {
  if (project_name && approvalNumber) {
    return `${BASE_URL2}/user/${userId}/building-name?project_name=${project_name}&approval_number=${approvalNumber}`;
  } else if (project_name) {
    return `${BASE_URL2}/user/${userId}/building-name?project_name=${project_name}`;
  } else {
    return `${BASE_URL2}/user/${userId}/building-name?approval_number=${approvalNumber}`;
  }
}
// Apply Filter AVM API Data
export function approvalValuationUrl(userId, propertyAnalyticsUrl) {
  return `${BASE_URL2}/user/${userId}/${propertyAnalyticsUrl}`;
}
// http://localhost:5050/skies/v1/user/f63beda1-7a5a-11eb-b3c6-000000000000/track-location?emp_id=04abd006-61d4-4d8c-a13a-2d46dea3cd4a
export function locationTracking(userId, emp_id) {
  if (emp_id === "") {
    return `${BASE_URL2}/user/${userId}/track-location`;
  } else {
    return `${BASE_URL2}/user/${userId}/track-location?emp_id=${emp_id}`;
  }
}

// Property Index
export function proprtyIndex(appendUrl) {
  return `${BASE_URL2}/user/${appendUrl}`;
}
export function proprtyIndexAnalytics(analyticsUrl) {
  return `${BASE_URL2}/user/${analyticsUrl}`;
}

export function getReportYearUrl(userId, property_type) {
  return `${BASE_URL2}/branch_agency/${userId}/branch-agency-year-list?property_type=${property_type}`;
}

export function serveyReportUrl(userId, screen, state, city) {
  let url = `${BASE_URL2}/survey/${userId}/survey-table?screen=${screen}`;
  if (!isEmpty(state) && isEmpty(city)) {
    url = `${BASE_URL2}/survey/${userId}/survey-table?screen=${screen}&state=${state}`;
  }
  if (!isEmpty(state) && !isEmpty(city)) {
    url = `${BASE_URL2}/survey/${userId}/survey-table?screen=${screen}&state=${state}&city=${city}`;
  }

  return url;
}

export function surveyReportUserUrl(userId){
    let url = `${BASE_URL2}/survey/${userId}/survey-user-table`;
    return url;
}

export function employeeAnalyticsurl(
  userId,
  screen,
  state,
  city,
  startDate,
  endDate,
) {
  let url = `${BASE_URL2}/analytics/${userId}/analytics?screen=${screen}`;
  if (!isEmpty(startDate) && !isEmpty(endDate)) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }
  if (!isEmpty(state) && isEmpty(city)) {
    url += `&state=${state}`;
  }
  if (!isEmpty(state) && !isEmpty(city)) {
    url += `&state=${state}&city=${city}`;
  }

  return url;
}

export function advariskListurl(userId, pageNumber) {
  let url = `${BASE_URL2}/avm/${userId}/get_advarisk?page=${pageNumber}&per_page=10`;
  return url;
}

export function avmReportListUrl(userId, pageNumber,search="") {
  let url = `${BASE_URL2}/avm/${userId}/get_avm_data_request_table?page=${pageNumber}&per_page=10`;
  if(!!search){
    url = `${url}&request_code=${search}`
  }
  return url;
}

export function getAdvariskAggr(userId) {
  let url = `${BASE_URL2}/avm/${userId}/get_advarisk_aggr`;
  return url;
}

export function saveAdvariskUrl(userId) {
  let url = `${BASE_URL2}/avm/${userId}/advarisk_request`;
  return url;
}

export function getAdvariskStatsUrl(userId) {
  let url = `${BASE_URL2}/avm/${userId}/get_advarisk_region?query_type=state`;
  return url;
}

export function getAdvariskDistrictUrl(userId, state) {
  let url = `${BASE_URL2}/avm/${userId}/get_advarisk_region?state_name=${state}&query_type=district`;
  return url;
}

export function getAdvariskPincodeUrl(userId, state, district) {
  let url = `${BASE_URL2}/avm/${userId}/get_advarisk_region?state_name=${state}&query_type=pincode&district_name=${district}`;
  return url;
}

export function advariskDetailUrl(userId, orderID) {
  let url = `${BASE_URL2}/avm/${userId}/get_advarisk_order?order_id=${orderID}`;
  return url;
}

export function reportAnalyticsurl(userId, startDate, endDate, empId, module) {
  let url = `${BASE_URL2}/analytics/${userId}/analytics_data?module=${module}&emp_id=${empId}`;
  if (!isEmpty(startDate) && !isEmpty(endDate)) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }
  return url;
}

export function exportEmployeeAnalyticsurl(
  userId,
  screen,
  state,
  city,
  startDate,
  endDate,
) {
  let url = `${BASE_URL2}/analytics/${userId}/analytics-export?screen=${screen}`;
  if (!isEmpty(startDate) && !isEmpty(endDate)) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }
  if (!isEmpty(state) && isEmpty(city)) {
    url += `&state=${state}`;
  }
  if (!isEmpty(state) && !isEmpty(city)) {
    url += `&state=${state}&city=${city}`;
  }

  return url;
}

export const employeeAnalyticDetailsUrl = (userId, empId) =>
  `${BASE_URL2}/admin/${userId}/get-employee?emp_id=${empId}`;

export function serveyAESKeyUrl() {
  return `${BASE_URL2}/survey/aes-key`;
}

export function serveyReportDataUrl(userId, reqid) {
  return `${BASE_URL2}/survey/${userId}/survey-report?id=${reqid}`;
}

export function serveyReportRequestUrl(userId, reqid) {
  return `${BASE_URL2}/survey/${userId}/survey-report-request`;
}

export function serveyReportCoverageRequestUrl(userId) {
  return `${BASE_URL2}/survey/${userId}/report-coverage`;
}
export function getVendorStateUrl(userId) {
  return `${BASE_URL2}/branch_agency/${userId}/get-agency-state`;
}

export function getVendorCityUrl(userId, state) {
  return `${BASE_URL2}/branch_agency/${userId}/get-agency-city?state_name=${state}`;
}

export function getVendorAgencyListUrl(userId, state,city) {
  return `${BASE_URL2}/branch_agency/${userId}/get-agency-name?state=${state}&city=${city}`;
}


export function getVendorListUrl(userId, state,city,agencyName) {
  return `${BASE_URL2}/branch_agency/${userId}/get-agency-data?state=${state}&city=${city}&agency_id=${agencyName}`;
}

// getMapMyindia

export function getMapMyindia(userId) {
  return `${BASE_URL2}/user/${userId}/map_my_india`;
}

export function getAnalyticalListUrl(userId,queryString) {
  return `${BASE_URL2}/analytics/${userId}/get_analytics_data?${queryString}`;
}



export function serveyReportGenUrl(userId, reqid) {
  return `${BASE_URL2}/survey/${userId}/generate-pdf?id=${reqid}`;
}

export function getBranchAgencyAnalyticsReportUrl(
  userId,
  property_type,
  aggrigation,
  timeLine,
  year,
) {
  return `${BASE_URL2}/branch_agency/${userId}/branch-agency-analytics?property_type=${property_type}&aggregation_type=${aggrigation}&timeline=${timeLine}&year=${year}`;
}

export function getZonesUrl(userId) {
  return `${BASE_URL2}/user/${userId}/get-agency-zone`;
}

export function getStateByCityZoneUrl(
  userId,
  property_type,
  aggrigation,
  timeLine,
  year,
  aggregation_name,
) {
  return `${BASE_URL2}/branch_agency/${userId}/branch-agency-analytics?property_type=${property_type}&aggregation_type=${aggrigation}&timeline=${timeLine}&year=${year}&aggregation_name=${aggregation_name}`;
}

export function getBranchAgencyUrl(
  userId,
  property_type,
  aggrigation_type,
  timeLine,
  year,
  aggregation_name,
) {
  return `${BASE_URL2}/branch_agency/${userId}/branch-agency-analytics?property_type=${property_type}&aggregation_type=Analytics&timeline=${timeLine}&year=${year}&aggregation_name=${aggregation_name}`;
}

export function getBranchContactDataUrl(userId, branchcode, timeLine, year) {
  return `${BASE_URL2}/branch_agency/${userId}/get-branch-connect-data?branch_code=${branchcode}&timeline=${timeLine}&year=${year}`;
}

export function getAgencyContactDataUrl(userId, agencyId, timeLine, year) {
  return `${BASE_URL2}/branch_agency/${userId}/get-agency-connect-data?agency_id=${agencyId}&timeline=${timeLine}&year=${year}`;
}

export function getTotalCountUrl(
  userId,
  propertyType,
  aggregation,
  timeLine,
  year,
) {
  return `${BASE_URL2}/branch_agency/${userId}/branch-agency-analytics?property_type=${propertyType}&aggregation_type=India&timeline=${timeLine}&year=${year}`;
}

// Andmin users

export function insertUserUrl(userId) {
  return `${BASE_URL2}/admin/${userId}/employee-insertion`;
}

export function getUserUrl(userId, empId) {
  return `${BASE_URL2}/admin/${userId}/get-employee?emp_id=${empId}`;
}

export function getEmployeeListUrl(userId, pageNumber) {
  // return `${BASE_URL2}/admin/${userId}/get-employee-list`;
  return `${BASE_URL2}/admin/${userId}/get-employee-list?page=${pageNumber}&per_page=10`;
}

export function employeeEcelExport(userId) {
  return `${BASE_URL2}/admin/${userId}/excel-export?request_type=employee`;
}

export function ecelExport(userId, start, end, type) {
  return `${BASE_URL2}/admin/${userId}/excel-export?start_date=${start}&end_date=${end}&request_type=${type}`;
}

export function marketTransactionUrl(userID) {
  return `${BASE_URL2}/user/${userID}/market_transactions?dashboard=true`;
}

export function marketTransactionExportUrl(userID, startDate, end_date) {
  return `${BASE_URL2}/admin/${userID}/mvt_excel-export?start_date=${startDate}&end_date=${end_date}`;
}
