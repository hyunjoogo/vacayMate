import { atom } from "recoil";

export const userContextAtom = atom({
  key: "userContext",
  default: {
    id: 25,
    name: "김현주",
    email: "hyunjoogo@gmail.com",
    position: null,
    department: null,
    role: "user",
    enter_date: null,
    is_leave: false,
    user_img:
      "https://lh3.googleusercontent.com/a/AGNmyxaclBGD7hthbuiGSFpJ2eImWUbJWQiZLn7lAPEnXg=s96-c",
    created_at: "2023-04-23T17:35:58.000Z",
  },
});
