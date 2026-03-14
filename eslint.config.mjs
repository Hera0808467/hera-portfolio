import nextConfig from "eslint-config-next";

const config = [
  // Keep the reverse-engineered artifact out of linting.
  { ignores: ["reference/**", "public/**"] },

  ...nextConfig,

  {
    name: "project-overrides",
    rules: {
      // These rules are too restrictive for typical UI apps (and for this reverse-engineered project).
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",

      // This project intentionally uses plain <img> to match the artifact and keep it simple.
      "@next/next/no-img-element": "off"
    }
  }
];

export default config;
