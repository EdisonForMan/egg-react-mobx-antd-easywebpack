const moduleAliases = require('./tools/alias');
module.exports = {
  entry: {
    app: 'app/web/page/app.js',
    login: 'app/web/page/login.js',
  },
  alias: moduleAliases.webpack.alias,
  module: {
    rules: [
        { less: true }
    ]
  }
};