const vueConfig = {
  env: {
    browser: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: ['plugin:vue/essential', 'eslint-config-tencent', 'eslint-config-tencent/prettier'],
  plugins: ['vue'],
};

const reactConfig = {
  env: {
    browser: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      generators: true,
      experimentalObjectRestSpread: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: ['plugin:react/recommended', 'eslint-config-tencent', 'eslint-config-tencent/prettier'],
  plugins: ['react'],
};

module.exports = {
  vueConfig,
  reactConfig,
};
