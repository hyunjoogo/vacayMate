/** @type {import("tailwindcss").Config} */

import defaultTheme from "tailwindcss/defaultTheme";

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard Variable", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
