import { atom } from "recoil";

export const userContextAtom = atom({
  key: "userContext",
  default: {},
});

export const modalStateAtom = atom({
  key: "modalState",
  default: false,
});
