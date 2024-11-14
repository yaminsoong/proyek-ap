module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module:react-native-dotenv', // This line if you use dotenv
        {
          moduleName: '@env',
          path: '.env',
        },
      ],
      ['@babel/plugin-transform-class-properties', { loose: true }], // Set loose mode
      ['@babel/plugin-transform-private-methods', { loose: true }],   // Set loose mode
      ['@babel/plugin-transform-private-property-in-object', { loose: true }], // Set loose mode
    ],
  };
  