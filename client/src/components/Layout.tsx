import React from "react";
import { Route, Routes } from "react-router-dom";

import Modal from "./Modal";
import routes from "../routes";

const Layout = () => {
  return (
    <main>
      <Routes>
        {routes.map((route, idx) => {
          return (
            route.component && (
              <Route
                key={idx}
                path={route.path}
                element={<route.component />}
              />
            )
          );
        })}
      </Routes>

      <Modal />
    </main>
  );
};

export default Layout;
