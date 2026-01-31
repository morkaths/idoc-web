/** @type {import('tailwindcss').Config} */
const config = require("../tailwind-config/tailwind.config.cjs");

module.exports = {
  ...config,
  content: [
    "./src/**/*.{tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
};