import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import QueryClientConfig from "./QueryClientConfig";
import Router from "./Router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserContextProvider } from "./contexts/AppContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
    <QueryClientConfig>
      <RecoilRoot>
        <BrowserRouter>
          <UserContextProvider>
            <Router />
          </UserContextProvider>
        </BrowserRouter>
      </RecoilRoot>
    </QueryClientConfig>
  </GoogleOAuthProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
