// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from "react";
import { Redirect, Route } from "react-router-dom";

import { isAdmin } from "../comman/common";

const AdminRoute = ({ component: Component, ...rest }) => {
  const whetherUserLoggedIn = isAdmin();

  return (
    <Route
      {...rest}
      render={(props) =>
        whetherUserLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/landingPage",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default AdminRoute;
