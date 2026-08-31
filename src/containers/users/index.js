import React from "react";
import Header from "../../components/header";
import UsersList from "../../components/users-page/usersList";

const Users = (props) => {
  return (
    <div className="geo-tracking-container">
      <Header isAdmin={true} link="/landingPage" />
      <div className="agent-travel-data" style={{ justifyContent: "center" }}>
        <UsersList {...props} />
      </div>
    </div>
  );
};

export default Users;
