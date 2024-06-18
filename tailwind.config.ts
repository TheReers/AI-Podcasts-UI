import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {

    extend: {
      colors:{
'alt-black':"#191919"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-conic-t": "url('../../public/gradient-background.png')",
        "button-gradient":"linear-gradient(289.33deg, #D391E1 5.5%, #FFD9BB 89.93%)",
        "box-gradient":"linear-gradient(289.33deg, #D391E1 5.5%, #FFD9BB 89.93%, rgba(255, 255, 255, 0.85) )",
        "create-gradient":"linear-gradient(289.33deg, rgba(211, 145, 225, 0.07) 5.5%, rgba(255, 217, 187, 0.07) 89.93%)",
        "br-pink":"rgba(224, 162, 219, 0.13)",
        "t-grey":"rgba(135, 135, 135, 1)"
        
      },
    },
  },
  plugins: [],
};
export default config;
