import { selector } from "recoil";
import { userContextAtom } from "./atoms";

export const userContextSelector = selector({
  key: "userContextSelector",
  get: ({ get }) => get(userContextAtom),
});
