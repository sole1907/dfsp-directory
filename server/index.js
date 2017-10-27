module.exports = {
  ports: [
    require('../db'),
    require('../httpserver')
  ],
  modules: {
    directory: require('../service/directory')
  },
  validations: {
    directory: require('../service/directory/api')
  }
}
