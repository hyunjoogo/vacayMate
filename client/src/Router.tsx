import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { useAuthentication } from "./contexts/AppContext";
import Header from "./components/Header";

const Router = () => {
  useAuthentication();
  //       <Route element={<Layout />}>
  //  children
  //       </Route>

  // Layout에는 내용+ <Outlet />를 해야한다.
  // Layout이 기본적으로 보이고 children의 내용이 나오게 된다.
  // https://stackblitz.com/github/remix-run/react-router/tree/main/examples/auth?file=src%2FApp.tsx
  return (
    <Routes>
      <Route element={<Header />}>
        <Route path="/*" element={<Layout />} />
      </Route>
    </Routes>
  );
};

export default Router;
