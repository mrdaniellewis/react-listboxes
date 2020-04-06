module.exports = function parcelPluginPugAssets(bundler) {
  bundler.addAssetType('pug', require.resolve('./pug_asset.js'));
};
