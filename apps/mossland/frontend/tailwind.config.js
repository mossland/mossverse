const { createGlobPatternsForDependencies } = require("@nrwl/next/tailwind");
const { join } = require("path");
const { generateColors } = require("../../../generateColors");

module.exports = {
  content: [
    join(__dirname, "./pages/**/*.{js,ts,jsx,tsx}"),
    join(__dirname, "./components/**/*.{js,ts,jsx,tsx}"),
    ...createGlobPatternsForDependencies(__dirname),
  ],

  theme: {
    screens: {
      sm: "640px",
      md: "800px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1736px",
    },
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "600px",
        md: "800px",
        lg: "984px",
        xl: "1148px",
        "2xl": "1736px",
      },
    },
    fontFamily: {
      lemonmilk: ["lemonmilk"],
      appleGothic: ["appleGothic"],
      notosans: ["notosans"],
      bodoni: ["bodoni"],
    },
    extend: {
      colors: {
        ...generateColors("color-main", "#66FEF0"),
        ...generateColors("color-sub", "#c51c1e"),
        ...generateColors("color-extra", "#FFE177"),
        "color-sub-dark": "#8d3435",
      },
      transitionProperty: {
        all: "all",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        flyOut: {
          "0%": {
            opacity: 1,
            transform: "translate(-50%, -100%)",
          },
          "100%": {
            opacity: 0,
            transform: "translate(-50%, -140%)",
          },
        },
        drop: {
          "0%": {
            opacity: 0,
            transform: "translate(-50%, -140%)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%, -100%)",
          },
        },

        fadeOut: {
          "0%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
          },
        },
        nextPageButton: {
          "0%": {
            transform: "translateX(100%)",
          },
          "100%": {
            transform: "translateX(0%)",
          },
        },
        homeLogo: {
          "0%": {
            opacity: 0,
            transform: "scale(0.8)",
          },
          "100%": {
            opacity: 1,
            transform: "scale(1)",
          },
        },
        homeLogoText1: {
          "0%": {
            transform: "translateY(50%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0%))",
            opacity: 1,
          },
        },
        homeLogoText2: {
          "0%": {
            transform: "translateY(-50%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0%))",
            opacity: 1,
          },
        },
        homeButton: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        mintButton: {
          "0%": {
            transform: "scale(1)",
          },
          "70%": {
            transform: "scale(1.2)",
          },

          // "50%": {
          //   transform: "scale(1.1)",
          // },
          // "100%": {
          //   transform: "scale(1)",
          // },
        },
        homeImage: {
          // "0%": {
          //   opacity: 0,
          // },
          // "100%": {
          //   opacity: 1,
          // },
        },
        jouneyText: {
          "0%": {
            transform: "translateY(2em)",
          },
          "100%": {
            transform: "translateY(0))",
          },
        },
        teamItem: {
          "0%": {
            width: "33.33333333%",
            height: "50%",
          },
          "100%": {
            width: "100%",
            height: "100%",
          },
        },
        pack1: {
          "0%": {
            transform: "translate(-4.33em, 0em) rotate(0deg)",
          },
          "100%": {
            transform: "translate(-15em, 8em) rotate(-6deg)",
          },
        },
        tedDeco1: {
          "0%": {
            transform: "translate(0em, 0em) rotate(0deg)",
            opacity: 1,
          },
          "100%": {
            transform: "translate(0em, 0.5em) rotate(-2deg)",
            opacity: 0,
          },
        },
        tedDeco2: {
          "0%": {
            transform: "translate(0em, 0em) rotate(0deg)",
            opacity: 0,
          },
          "100%": {
            transform: "translate(0em, 0.5em) rotate(2deg)",
            opacity: 1,
          },
        },
        tedDeco3: {
          "0%": {
            transform: "translate(0em, 0em) rotate(0deg)",
          },
          "100%": {
            transform: "translate(0em, 0.5em) rotate(-2deg)",
          },
        },
        tedDeco4: {
          "0%": {
            opacity: 0,
            transform: "translate(0em, 0em) scale(1)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(2em) scale(1.1)",
          },
        },
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
        emojiOpen: {
          "0%": {
            transform: "scale(0, 0)",
            width: "0px",
            opacity: 0.4,
          },
          "100%": {
            transform: "scale(1, 1)",
            width: "282px",
            opacity: 1,
          },
        },
        emojiClose: {
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
        fadeIn: "fadeIn 0.5s ease forwards",
        fadeOut: "fadeOut 0.5s ease-in-out forwards",
        flyOut: "flyOut 0.5s ease-in-out forwards",
        drop: "drop 0.5s ease-in-out forwards",
        mainLogo: "fadeIn 1s ease-in-out forwards",
        mainButtons: "fadeIn 0.5s ease-in-out 0.5s forwards",
        nextPageButton: "nextPageButton 0.5s ease-in-out forwards",
        homeLogo: "homeLogo 1s ease-in-out 1.2s forwards",
        homeLogoText1: "homeLogoText1 1s ease-in-out 0.8s forwards",
        homeLogoText2: "homeLogoText2 1s ease-in-out 0.8s forwards",
        homeButton: "homeButton 1s ease-in-out 2s forwards",
        homeImage: "homeImage 0.5s ease-in-out 0.8s forwards",
        teamItem: "teamItem 1s ease-in-out forwards",
        jouneyTitle: "jouneyText 1s ease-in-out forwards",
        jouneyDesc: "jouneyText 1s ease-in-out 0.5s forwards",
        mintButton: "mintButton 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        tedDeco1: "tedDeco1 1s ease-in-out infinite alternate",
        tedDeco2: "tedDeco2 1s ease-in-out infinite alternate",
        tedDeco3: "tedDeco3 1s ease-in-out infinite alternate",
        tedDeco4: "tedDeco4 1s ease-in-out forwards",
        inventoryOpen: "inventoryOpen 0.3s ease-in-out forwards",
        inventoryClose: "inventoryClose 0.3s ease-in-out forwards",
        emojiOpen: "emojiOpen 0.3s ease-in-out forwards",
        emojiClose: "emojiClose 0.3s ease-in-out forwards",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/aspect-ratio"), require("tailwind-scrollbar"), require("daisyui")],
  corePlugins: {
    preflight: false,
  },
};
