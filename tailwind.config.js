/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: "var(--espresso)",
        brown: "var(--brown)",
        chestnut: "var(--chestnut)",
        paper: "var(--paper)",
        parchment: "var(--parchment)",
        butter: "var(--butter)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        brass: "var(--brass)",
        gold: "var(--gold)",
        sage: "var(--sage)",
        brick: "var(--brick)",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        serif: ["var(--font-libre-baskerville)", "Libre Baskerville", "serif"],
      },
    },
  },
  plugins: [],
};
