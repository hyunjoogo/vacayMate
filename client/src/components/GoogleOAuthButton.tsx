import React from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useSetRecoilState } from "recoil";
import { userContextAtom } from "../recoil/atoms";
import { setAuthorizations } from "../utils/CookieUtil";
import { useNavigate } from "react-router-dom";

const GoogleOAuthButton = () => {
  const navigate = useNavigate();
  const setAppContext = useSetRecoilState(userContextAtom);

  const onSuccess = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;
    const payload = credential ? jwt_decode(credential) : undefined;

    if (payload) {
      try {
        const { data } = await axios.post(
          "http://localhost:3300/api/common/v1/login",
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${credential}`,
            },
          }
        );
        setAppContext(data.user);
        setAuthorizations(data.token);
        navigate("/", { replace: true });
      } catch (err) {
        console.error(err);
      }
    }
  };
  const onFailure = () => {
    console.error();
  };

  return (
    <div>
      <h3>React Google OAuth Authentication</h3>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onFailure}
        text="signin"
        size="large"
      />
    </div>
  );
};

export default GoogleOAuthButton;
