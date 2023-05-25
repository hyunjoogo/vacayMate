import App from "./App";
import LoginPage from "./pages/login/LoginPage";
import HomePage from "./pages/home/HomePage";
import RequestPage from "./pages/request/RequestPage";
import RequestMgmtPage from "./pages/request-mgmt/RequestMgmtPage";
import React from "react";

interface Routes {
  path: string;
  component: React.ComponentType;
}

const routes: Routes[] = [
  { path: "/", component: App },
  { path: "/login", component: LoginPage },
  { path: "/home", component: HomePage },
  { path: "/request", component: RequestPage },
  { path: "/request-mgmt", component: RequestMgmtPage },
];

export default routes;
