// HomePage.test.js
import { render, screen, waitFor, act } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import HomePage from "./HomePage";
import { userContextAtom } from "../../recoil/atoms";
import { RecoilState, Snapshot, MutableSnapshot } from "recoil";

const initializeState = (mutableSnapshot) => {
  mutableSnapshot.set(userContextAtom, {
    id: 1,
    name: "Test User",
    email: "testuser@example.com",
  });
};

describe("HomePage", () => {
  it("fetches and displays requests", async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <HomePage />
      </RecoilRoot>
    );

    await waitFor(() => {
      const items = screen.getAllByText("Test User");
      expect(items).toHaveLength(2);
    });
    expect(screen.getByText("2023-04-02 / 오전반차")).toBeInTheDocument();
  });

  it("highlights the current user's request", async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <HomePage />
      </RecoilRoot>
    );

    await waitFor(() => {
      const listItem = screen.getAllByText("Test User");
      listItem.forEach((item) => {
        expect(item.closest("ul")).toHaveStyle({ backgroundColor: "blue" });
      });
    });
  });
});
