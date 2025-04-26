// craco.config.js
const ModuleScopePluginName = 'ModuleScopePlugin';
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        plugin => plugin.constructor.name !== ModuleScopePluginName
      );
      return webpackConfig;
    },
  },
};
