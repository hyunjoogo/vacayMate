import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  queryByAttribute,
} from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { RecoilRoot } from "recoil";
import { MemoryRouter } from "react-router-dom";
import GoogleOAuthButton from "../../components/GoogleOAuthButton";
import { GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

const server = setupServer(
  rest.post("http://localhost:3300/api/common/v1/login", (req, res, ctx) => {
    return res(ctx.json({ user: { name: "Test User" }, token: "test-token" }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

export const renderWithRecoilAndRouter = (component) => {
  return render(
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <RecoilRoot>
        <MemoryRouter>{component}</MemoryRouter>
      </RecoilRoot>
    </GoogleOAuthProvider>
  );
};

describe("GoogleOAuthButton", () => {
  it("renders Google OAuth button", async () => {
    renderWithRecoilAndRouter(<GoogleOAuthButton />);
    const getById = queryByAttribute.bind(null, "style");
    const element = getById(document.documentElement, "height: 40px;");
    expect(element).toBeInTheDocument();
  });

  it("handles onSuccess event", async () => {});
});
