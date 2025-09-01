// tailwind.config.js
import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{ts,tsx}"],
	theme: { extend:{
		colors: {
		  brand: {
			DEFAULT: "#1DA1F2", // 기본값
			dark: "#34495E",
			light: "#F9FAFB",
		  },
		},
	  }, 
	},
	plugins: [tailwindcssAnimate], // 원치 않으면 [] 로 두세요.
};
