// https://docs.expo.dev/guides/using-eslint/

module.exports = {
  extends: ['expo', 'plugin:import/recommended', 'plugin:import/typescript'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json'
      }
    }
  }
};
