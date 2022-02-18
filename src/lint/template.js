// vue 2
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

// vue 3
const vue3Config = {
  env: {
    browser: true,
    'vue/setup-compiler-macros': true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: ['plugin:vue/vue3-essential', 'eslint-config-tencent', 'eslint-config-tencent/prettier'],
  plugins: ['vue'],
};

// react
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
  vue3Config,
  reactConfig,
};
