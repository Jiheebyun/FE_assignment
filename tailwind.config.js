// tailwind.config.js
import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{ts,tsx}"],
	theme: { extend: {} },
	plugins: [tailwindcssAnimate], // 원치 않으면 [] 로 두세요.
};
