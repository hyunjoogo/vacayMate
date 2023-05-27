import React from "react";
import { Link, Outlet } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <ul className="flex gap-3 h-8 bg-blue-400">
        <li>
          <Link to="/">Public</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/request">Request</Link>
        </li>
        <li>
          <Link to="/request-mgmt">Request-Mgmt</Link>
        </li>
        <li>
          <Link to="/members">members</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};

export default Header;
