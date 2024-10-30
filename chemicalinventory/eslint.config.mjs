import pluginReact from 'eslint-plugin-react';

export default [
  {
    files: ["src/**/*.js", "src/**/*.jsx"],
  },
  {
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: {
        version: "detect", 
      },
    },
  },
  pluginReact.configs.flat.recommended,
];
