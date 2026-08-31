// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from "react";
import { Redirect, Route } from "react-router-dom";

import { userLoggedIn } from "../comman/common";

const OnBoardingRoute = ({ component: Component, ...rest }) => {
  const whetherUserLoggedIn = userLoggedIn();

  return (
    <Route
      {...rest}
      render={(props) =>
        whetherUserLoggedIn ? (
          <Redirect
            to={{
              pathname: "/landingPage",
              state: { from: props.location },
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default OnBoardingRoute;
