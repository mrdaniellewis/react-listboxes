module.exports = (api) => {
  api.cache(true);

  const presets = [
    '@babel/preset-react',
    ['@babel/preset-env', { useBuiltIns: 'usage' }],
  ];
  const plugins = [
    ['@babel/plugin-transform-runtime', { regenerator: true, corejs: 3 }],
  ];

  return {
    presets,
    plugins,
  };
};
