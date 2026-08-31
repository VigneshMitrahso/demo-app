import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const checkNetworkBandwidth = () => {
  return new Promise(async (resolve, reject) => {
    // try {
    let imageUrl = window.location.href.replace("/customer-connect", "");
    if (imageUrl.includes("?call=true")) {
      imageUrl = imageUrl.replace("?call=true", "");
    }
    imageUrl = `${imageUrl}/static/media/network-1.090e8e97.png`;
    const numTests = 3; // Number of times to run the test
    let totalSpeed = 0;

    let flag = true;

    for (let i = 0; i < numTests; i++) {
      const startTime = performance.now();

      try {
        const response = await fetch(imageUrl, {
          method: "GET",
          cache: "no-cache",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.arrayBuffer(); // Wait for the entire response
        const endTime = performance.now();

        const duration = (endTime - startTime) / 1000; // Duration in seconds
        const fileSizeInBytes = data.byteLength;
        const speedInBps = (fileSizeInBytes * 8) / duration; // Speed in bits per second (bytes to bits: multiply by 8)
        const speedInMbps = (speedInBps / (1024 * 1024)).toFixed(2); // Speed in Mbps
        totalSpeed += parseFloat(speedInMbps);
      } catch (error) {
        flag = false;
      }
    }
    if (flag) {
      const averageSpeed = (totalSpeed / numTests).toFixed(2);
      resolve(averageSpeed);
    } else {
      toast.error("Connectivity check failed! Please try again", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      reject(0);
    }
  });
};

const getNetworkBandwidth = async () => {
  try {
    const networkSpeed = await checkNetworkBandwidth();
    if (networkSpeed >= 1) {
      toast.success("Internet Connection Stable.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      toast.error("Internet Connection Unstable.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return false;
    }
  } catch (error) {
    return false;
  }
};

export { getNetworkBandwidth };
