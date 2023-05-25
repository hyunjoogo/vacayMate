import React from "react";
import { Link, Outlet } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Public Page</Link>
        </li>
        <li>
          <Link to="/login">Login Page</Link>
        </li>
        <li>
          <Link to="/home">Home Page</Link>
        </li>
        <li>
          <Link to="/request">Request Page</Link>
        </li>
        <li>
          <Link to="/request-mgmt">Request-Mgmt Page</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};

export default Header;
