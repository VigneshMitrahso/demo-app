import React from "react";
import { Redirect, Route } from "react-router-dom";

import { userLoggedIn } from "../comman/common";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const whetherUserLoggedIn = userLoggedIn();

  return (
    <Route
      {...rest}
      render={(props) =>
        whetherUserLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/" }} />
        )
      }
    />
  );
};

export default PrivateRoute;
