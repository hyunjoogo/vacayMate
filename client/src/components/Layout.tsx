import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div style={{ backgroundColor: "white" }}>
      <ul>
        <li>
          <Link to="/">Public Page</Link>
        </li>
        <li>
          <Link to="/login">Login Page</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};

export default Layout;
