module.exports = {
  'extends': '@react-native-community',
  'parser': 'babel-eslint',
  'env': {
    'jest': true
  },
  'rules': {
    'prettier/prettier': 0,
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'comma-dangle': 'off',
    'arrow-body-style': 0,
    'react/jsx-one-expression-per-line': 'off',
    'eol-last': 0,
    'object-curly-newline': 0,
    'no-useless-constructor': 0,
    'padded-blocks': 0,
    'no-trailing-spaces': 0,
    'object-curly-spacing': 0
  },
  'globals': {
    'fetch': false
  }
};