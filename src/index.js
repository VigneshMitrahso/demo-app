import React from "react";
import ReactDOM from "react-dom";
import "./assets/styles/common.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { Provider } from "react-redux";

// import configureStore from "./configure";
import * as Sentry from "@sentry/react";

// const store = configureStore();

if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: "https://203accc67e5758706c9fa67257dba371@o4506252999000064.ingest.sentry.io/4506273966784512",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [
      "localhost",
      /^https:\/\/rapid\.io\/api/,
      /^https:\/\/dev.rapid\.io\/api/,
    ], // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    beforeSend: function (event, hint) {
      // filter out UnhandledRejection errors that have no information
      if (
        event !== undefined &&
        event.exception !== undefined &&
        event.exception.values !== undefined &&
        event.exception.values.length === 1
      ) {
        var e = event.exception.values[0];
        if (
          e.type === "UnhandledRejection" &&
          e.value === "Non-Error promise rejection captured with value: "
        ) {
          return null;
        }
      }
    },
  });
}

ReactDOM.render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
      <App />
    {/* </Provider> */}
  </React.StrictMode>,
  document.getElementById("root"),
);
serviceWorker.unregister();
