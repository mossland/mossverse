const { createGlobPatternsForDependencies } = require("@nx/next/tailwind");
const { join } = require("path");
const { defaultPlugin } = require("../../tailwind.base");

module.exports = {
  content: [
    join(__dirname, "./app/**/*.{js,ts,jsx,tsx}"),
    join(__dirname, "./lib/**/*.{js,ts,jsx,tsx}"),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
    keyframes: {
      inventoryOpen: {
        "0%": {
          transform: "scale(0, 0)",
          width: "0px",
          opacity: 0.4,
        },
        "100%": {
          transform: "scale(1, 1)",
          width: "398px",
          opacity: 1,
        },
      },
      inventoryClose: {
        "0%": {
          transform: "scale(1, 1)",
          width: "398px",
          opacity: 0.4,
        },
        "100%": {
          transform: "scale(0, 0)",
          width: "0px",
          height: "0px",
          opacity: 0,
        },
      },
    },

    animation: {
      inventoryOpen: "inventoryOpen 0.3s ease-in-out forwards",
      inventoryClose: "inventoryClose 0.3s ease-in-out forwards",
    },
  },
  daisyui: {
    themes: [
      {
        app: {
          primary: "#66FEF0",
          secondary: "#FFD749",
          accent: "#EE0000",
          neutral: "#141924",
          "base-100": "#ffffff",
          info: "#4157C3",
          success: "#269786",
          warning: "#EDA35A",
          error: "#F26E81",
        },
      },
    ],
  },
  plugins: [
    defaultPlugin,
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
    require("tailwind-scrollbar"),
    require("daisyui"),
  ],
};
