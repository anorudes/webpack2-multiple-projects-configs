const path = require('path');

module.exports = {
  resolve: {
    alias: {
      components: path.join(__dirname, '../src/components/'),
      components_projects: path.join(__dirname, '../src/components_projects/'),
      'redux/modules': path.join(__dirname, '../src/redux/modules/'),
      'redux/store': path.join(__dirname, '../src/redux/store/'),
      constants: path.join(__dirname, '../src/constants/'),
      config: path.join(__dirname, '../src/config/'),
      decorators: path.join(__dirname, '../src/decorators/'),
      utils: path.join(__dirname, '../src/utils/'),
    },
  },
};
