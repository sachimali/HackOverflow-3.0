// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       animation:{
//         scale:"scaleBackground 2s infinite alternate"
//       },
//       keyframes:{
//         scaleBackground: {
//           "0% ":{
//             transform: "scale(1)"
//           },
//           "100%": {
//             transform: "scale(1.25)"
//           }
//         },
//       },
//     },
//   },
//   plugins: [],
// }
/** @type {import('tailwindcss').Config}*/
const tailwindConfig = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        scaleBackground: "scaleBackground 15s infinite alternate",
        "spinner-fzua35": "spinner 1s infinite ease",
      },
      keyframes: {
        scaleBackground: {
          "0%": {
            transform: "scale(1)",
            animationTimingFunction: "ease-in-out",
          },
          "100%": {
            transform: "scale(1.13)",
            animationTimingFunction: "ease-in-out",
          },
        },
        spinner: {
          "0%, 10%, 20%, 30%, 50%, 60%, 70%, 80%, 90%, 100%": {
            transform:
              "rotate(calc(var(--rotation) * 1deg)) translateY(calc(var(--translation) * 1%))",
          },
          "50%": {
            transform:
              "rotate(calc(var(--rotation) * 1deg)) translateY(calc(var(--translation) * 1.5%))",
          },
        },
      },
    },
  },
  plugins: [
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/forms'),
    // // Add other plugins as needed
  ],
};

export default tailwindConfig;
