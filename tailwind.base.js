const defaultPlugin = require("tailwindcss/plugin")(
  // https://tailwindcss.com/docs/plugins
  ({ addUtilities, addComponents, addBase }) => {
    addUtilities({
      ".centric": {
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
      },
    });
    addComponents({});
    addBase({});
  },
  {
    theme: {
      container: { center: true },
      extend: {
        transitionProperty: {
          all: "all",
        },
        keyframes: {
          fadeIn: {
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
          },
          flyOut: {
            "0%": { opacity: 1, transform: "translate(-50%, -100%)" },
            "100%": { opacity: 0, transform: "translate(-50%, -140%)" },
          },
          drop: {
            "0%": { opacity: 0, transform: "translate(-50%, -140%)" },
            "100%": { opacity: 1, transform: "translate(-50%, -100%)" },
          },
          fadeOut: {
            "0%": { opacity: 1 },
            "100%": { opacity: 0 },
          },
          flash: {
            "0%": { opacity: 1 },
            "50%": { opacity: 0.2 },
            "100%": { opacity: 1 },
          },
          spin: {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
          pop: {
            "0%": { transform: "scale(0, 0)" },
            "50%": { transform: "scale(1.5, 1.5)" },
            "100%": { transform: "scale(1, 1)" },
          },
        },
        animation: {
          fadeIn: "fadeIn 0.5s ease-in-out forwards",
          fadeOut: "fadeOut 0.5s ease-in-out forwards",
          flyOut: "flyOut 0.5s ease-in-out forwards",
          drop: "drop 0.5s ease-in-out forwards",
          flash: "flash 1s linear infinite",
          spin: "spin 1s linear infinite",
          pop: "pop 0.5s ease-in-out forwards",
        },
      },
    },
  }
);

module.exports = { defaultPlugin };
