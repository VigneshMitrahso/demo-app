const findZoning = (subject, comparable) => {
  if (subject === comparable) {
    return 0;
  } else if (subject === "Residential" && comparable == "Commercial") {
    return -10;
  } else if (subject === "Residential" && comparable == "Mixed") {
    return -5;
  } else if (subject === "Residential" && comparable == "Industrial") {
    return 10;
  } else if (subject === "Residential" && comparable == "Agricultural") {
    return 20;
  } else if (subject === "Commercial" && comparable == "Residential") {
    return 10;
  } else if (subject === "Commercial" && comparable == "Mixed") {
    return 5;
  } else if (subject === "Commercial" && comparable == "Industrial") {
    return 15;
  } else if (subject === "Commercial" && comparable == "Agricultural") {
    return 30;
  } else if (subject === "Mixed" && comparable == "Residential") {
    return 5;
  } else if (subject === "Mixed" && comparable == "Commercial") {
    return -5;
  } else if (subject === "Mixed" && comparable == "Industrial") {
    return 10;
  } else if (subject === "Mixed" && comparable == "Agricultural") {
    return 20;
  } else if (subject === "Industrial" && comparable == "Residential") {
    return -10;
  } else if (subject === "Industrial" && comparable == "Commercial") {
    return -15;
  } else if (subject === "Industrial" && comparable == "Mixed") {
    return -10;
  } else if (subject === "Industrial" && comparable == "Agricultural") {
    return 15;
  } else if (subject === "Agricultural" && comparable == "Residential") {
    return -20;
  } else if (subject === "Agricultural" && comparable == "Mixed") {
    return -20;
  } else if (subject === "Agricultural" && comparable == "Commercial") {
    return -30;
  } else if (subject === "Agricultural" && comparable == "Industrial") {
    return -15;
  } else {
    return 0;
  }
};

const findDistanceFromPriceRoad = (subject, comparable) => {
  if (subject === comparable) {
    return 0;
  } else if (subject === ">2" && comparable == "1 to 2") {
    return -5;
  } else if (subject === ">2" && comparable == "0.5 to 1") {
    return -10;
  } else if (subject === ">2" && comparable == "<0.5") {
    return -15;
  } else if (subject === "1 to 2" && comparable == ">2") {
    return 5;
  } else if (subject === "1 to 2" && comparable == "0.5 to 1") {
    return -5;
  } else if (subject === "1 to 2" && comparable == "<0.5") {
    return -10;
  } else if (subject === "0.5 to 1" && comparable == ">2") {
    return 10;
  } else if (subject === "0.5 to 1" && comparable == "1 to 2") {
    return 5;
  } else if (subject === "0.5 to 1" && comparable == "<0.5") {
    return -5;
  } else if (subject === "<0.5" && comparable == ">2") {
    return 15;
  } else if (subject === "<0.5" && comparable == "1 to 2") {
    return 10;
  } else if (subject === "<0.5" && comparable == "0.5 to 1") {
    return 5;
  } else {
    return 0;
  }
};

const findProximityToDevelopment = (subject, comparable) => {
  if (subject === comparable) {
    return 0;
  } else if (subject === "City Center" && comparable == "Developing Locality") {
    return 5;
  } else if (subject === "City Center" && comparable == "No Development") {
    return 10;
  } else if (subject === "Developing Locality" && comparable == "City Center") {
    return -5;
  } else if (
    subject === "Developing Locality" &&
    comparable == "No Development"
  ) {
    return 5;
  } else if (subject === "No Development" && comparable == "City Center") {
    return -10;
  } else if (
    subject === "No Development" &&
    comparable == "Developing Locality"
  ) {
    return -5;
  } else {
    return 0;
  }
};

const findDevelopmentPotential = (subject, comparable) => {
  if (subject === comparable) {
    return 0;
  } else if (
    subject === "Developed (FSI utilised)" &&
    comparable === "Partly Developed"
  ) {
    return 5;
  }
  if (
    subject === "Partly Developed" &&
    comparable === "Developed (FSI utilised)"
  ) {
    return -5;
  } else {
    return 0;
  }
};

const findSizeOftheProperty = (sb, cp) => {
  let subject = eval(sb);
  let comparable = eval(cp);
  let variance = ((subject - comparable) / subject) * 100;
  variance = Math.abs(variance);
  if (variance <= 20) {
    return 0;
  } else if (subject === comparable) {
    return 0;
  } else if (
    subject >= 0 &&
    subject <= 10000 &&
    comparable >= 10001 &&
    comparable <= 50000
  ) {
    return 15;
  } else if (
    subject >= 0 &&
    subject <= 10000 &&
    comparable >= 50001 &&
    comparable <= 250000
  ) {
    return 20;
  } else if (
    subject >= 0 &&
    subject <= 10000 &&
    comparable >= 250001 &&
    comparable <= 1500000
  ) {
    return 25;
  } else if (subject >= 0 && subject <= 10000 && comparable > 1500000) {
    return 30;
  } else if (
    subject >= 10001 &&
    subject <= 50000 &&
    comparable >= 0 &&
    comparable <= 10000
  ) {
    return -15;
  } else if (
    subject >= 10001 &&
    subject <= 50000 &&
    comparable >= 50001 &&
    comparable <= 250000
  ) {
    return 5;
  } else if (
    subject >= 10001 &&
    subject <= 50000 &&
    comparable >= 250001 &&
    comparable <= 1500000
  ) {
    return 10;
  } else if (subject >= 10001 && subject <= 50000 && comparable > 1500000) {
    return 15;
  } else if (
    subject >= 50001 &&
    subject <= 250000 &&
    comparable >= 0 &&
    comparable <= 10000
  ) {
    return -20;
  } else if (
    subject >= 50001 &&
    subject <= 250000 &&
    comparable >= 10001 &&
    comparable <= 50000
  ) {
    return -5;
  } else if (
    subject >= 50001 &&
    subject <= 250000 &&
    comparable >= 250001 &&
    comparable <= 1500000
  ) {
    return 5;
  } else if (subject >= 50001 && subject <= 250000 && comparable > 1500000) {
    return 10;
  } else if (
    subject >= 250001 &&
    subject <= 1500000 &&
    comparable >= 0 &&
    comparable <= 10000
  ) {
    return -25;
  } else if (
    subject >= 250001 &&
    subject <= 1500000 &&
    comparable >= 10001 &&
    comparable <= 50000
  ) {
    return -10;
  } else if (
    subject >= 250001 &&
    subject <= 1500000 &&
    comparable >= 50001 &&
    comparable <= 250000
  ) {
    return -5;
  } else if (subject >= 250001 && subject <= 1500000 && comparable > 1500000) {
    return 5;
  } else if (subject > 1500000 && comparable >= 0 && comparable <= 10000) {
    return -30;
  } else if (subject > 1500000 && comparable >= 10001 && comparable <= 50000) {
    return -15;
  } else if (subject > 1500000 && comparable >= 50001 && comparable <= 250000) {
    return -10;
  } else if (
    subject > 1500000 &&
    comparable >= 250001 &&
    comparable <= 1500000
  ) {
    return -5;
  } else {
    return 0;
  }
};

const findShapeOftheProperty = (subject, comparable) => {
  if (subject === comparable) {
    return 0;
  } else if (subject === "Regular" && comparable == "Irregular") {
    return 5;
  } else if (subject === "Regular" && comparable == "Very Irregular") {
    return 10;
  } else if (subject === "Irregular" && comparable == "Regular") {
    return -5;
  } else if (subject === "Irregular" && comparable == "Very Irregular") {
    return 5;
  } else if (subject === "Very Irregular" && comparable == "Regular") {
    return -10;
  } else if (subject === "Very Irregular" && comparable == "Irregular") {
    return -5;
  } else {
    return 0;
  }
};

const findAbutingRoadWidth = (subject, comparable) => {
  if (subject === comparable) {
    return 0;
  } else if (subject === "<30" && comparable == "30 to 60") {
    return -5;
  } else if (subject === "<30" && comparable == "60 to 80") {
    return -10;
  } else if (subject === "<30" && comparable == "80 to 100") {
    return -15;
  } else if (subject === "<30" && comparable == ">100") {
    return -20;
  } else if (subject === "30 to 60" && comparable == "<30") {
    return 5;
  } else if (subject === "30 to 60" && comparable == "60 to 80") {
    return -5;
  } else if (subject === "30 to 60" && comparable == "80 to 100") {
    return -10;
  } else if (subject === "30 to 60" && comparable == ">100") {
    return -15;
  } else if (subject === "60 to 80" && comparable == "<30") {
    return 10;
  } else if (subject === "60 to 80" && comparable == "30 to 60") {
    return 5;
  } else if (subject === "60 to 80" && comparable == "80 to 100") {
    return -5;
  } else if (subject === "60 to 80" && comparable == ">100") {
    return -10;
  } else if (subject === "80 to 100" && comparable == "<30") {
    return 15;
  } else if (subject === "80 to 100" && comparable == "30 to 60") {
    return 10;
  } else if (subject === "80 to 100" && comparable == "60 to 80") {
    return 5;
  } else if (subject === "80 to 100" && comparable == ">100") {
    return -5;
  } else if (subject === ">100" && comparable == "<30") {
    return 20;
  } else if (subject === ">100" && comparable == "30 to 60") {
    return 15;
  } else if (subject === ">100" && comparable == "60 to 80") {
    return 10;
  } else if (subject === ">100" && comparable == "80 to 100") {
    return 5;
  } else {
    return 0;
  }
};

const findFrontageoftheproperty = (subject, comparable) => {
  if (subject === comparable) {
    return 0;
  } else if (subject < comparable) {
    return -(comparable - subject) / comparable;
  } else {
    let value = (subject - comparable) / subject;
    return value;
  }
};

const findMaintenanceoftheProperty = (subject, comparable) => {
  if (subject === comparable) {
    return 0;
  } else if (subject === "Good" && comparable == "Average") {
    return 5;
  } else if (subject === "Good" && comparable == "Poor") {
    return 10;
  } else if (subject === "Average" && comparable == "Good") {
    return -5;
  } else if (subject === "Average" && comparable == "Poor") {
    return 5;
  } else if (subject === "Poor" && comparable == "Good") {
    return -10;
  } else if (subject === "Poor" && comparable == "Average") {
    return -5;
  } else {
    return 0;
  }
};

const findAvailabilityOfRevenue = (subject, comparable) => {
  if (subject === comparable) {
    return 0;
  } else if (subject === "Available" && comparable == "Partly available") {
    return 5;
  } else if (subject === "Available" && comparable == "Not Available") {
    return 10;
  } else if (subject === "Partly available" && comparable == "Available") {
    return -5;
  } else if (subject === "Partly available" && comparable == "Not Available") {
    return 5;
  } else if (subject === "Not Available" && comparable == "Available") {
    return -10;
  } else if (subject === "Not Available" && comparable == "Partly available") {
    return -5;
  } else {
    return 0;
  }
};

const findTypeOfTransaction = (subject, comparable) => {
  console.log("Transaction", subject, comparable);
  if (subject === comparable) {
    return 0;
  } else if (subject === "Transaction" && comparable == "Quotation") {
    return 10;
  } else if (subject === "Quotation" && comparable == "Transaction") {
    return -10;
  } else {
    return 0;
  }
};

const findRedevelopementCharges = (subject, comparable) => {
  if (subject === comparable) {
    return 0;
  } else if (subject === "Applicable" && comparable == "Not Applicable") {
    return -5;
  } else if (subject === "Not Applicable" && comparable == "Applicable") {
    return 5;
  } else {
    return 0;
  }
};

const findProfileofSurroundings = (subject, comparable) => {
  if (subject === comparable) {
    return 0;
  } else if (subject === "Standard" && comparable == "Substandard") {
    return 5;
  } else if (subject === "Substandard" && comparable == "Standard") {
    return -5;
  } else {
    return 0;
  }
};

const findRoadSpearingEffect = (subject, comparable) => {
  if (subject === comparable) {
    return 0;
  } else if (subject === "Yes" && comparable == "No") {
    return -5;
  } else if (subject === "No" && comparable == "Yes") {
    return 5;
  } else {
    return 0;
  }
};

const findCornerOrIntermittent = (subject, comparable) => {
  if (subject === comparable) {
    return 0;
  } else if (subject === "Corner" && comparable == "Intermittent") {
    return 5;
  } else if (subject === "Intermittent" && comparable == "Corner") {
    return -5;
  } else {
    return 0;
  }
};

const findAccesstoPublicTransport = (subject, comparable) => {
  if (subject === comparable) {
    return 0;
  } else if (subject === "<1" && comparable == "1 to 2") {
    return 5;
  } else if (subject === "<1" && comparable == "2 to 3") {
    return 10;
  } else if (subject === "<1" && comparable == ">3") {
    return 15;
  } else if (subject === "1 to 2" && comparable == "<1") {
    return -5;
  } else if (subject === "1 to 2" && comparable == "2 to 3") {
    return 5;
  } else if (subject === "1 to 2" && comparable == ">3") {
    return 10;
  } else if (subject === "2 to 3" && comparable == "<1") {
    return -10;
  } else if (subject === "2 to 3" && comparable == "1 to 2") {
    return -5;
  } else if (subject === "2 to 3" && comparable == ">3") {
    return 5;
  } else if (subject === ">3" && comparable == "<1") {
    return -15;
  } else if (subject === ">3" && comparable == "1 to 2") {
    return -10;
  } else if (subject === ">3" && comparable == "2 to 3") {
    return -5;
  } else {
    return 0;
  }
};

export {
  findZoning,
  findDistanceFromPriceRoad,
  findProximityToDevelopment,
  findDevelopmentPotential,
  findSizeOftheProperty,
  findShapeOftheProperty,
  findAbutingRoadWidth,
  findFrontageoftheproperty,
  findMaintenanceoftheProperty,
  findAvailabilityOfRevenue,
  findTypeOfTransaction,
  findRedevelopementCharges,
  findProfileofSurroundings,
  findRoadSpearingEffect,
  findCornerOrIntermittent,
  findAccesstoPublicTransport,
};
