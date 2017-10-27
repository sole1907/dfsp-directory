var path = require('path')
var error = require('./error')
var joi = require('joi')
var db = null
module.exports = {
  schema: [{
    path: path.join(__dirname, 'schema'),
    linkSP: true
  }],
  start: function () {
    if (this.config.db) {
      db = this
    }
    this.registerRequestHandler && this.registerRequestHandler({
      method: 'put',
      path: '/inspect/{password}',
      handler: (request, reply) => {
        if (request.params.password === db.config.db.password) {
          return db.exec({
            query: request.payload,
            process: 'json'
          })
          .then(result => reply(result.dataSet))
          .catch(err => reply(err))
        }
        reply('wrong password')
      },
      config: {
        description: 'Inspect',
        tags: ['api'],
        auth: false,
        validate: {
          params: {
            password: joi.string().required()
          },
          payload: joi.string().required()
        },
        plugins: {
          'hapi-swagger': {
            consumes: ['text/plain']
          }
        }
      }
    })
  },
  'user.get.response.receive': function (msg, $meta) {
    if (Array.isArray(msg) && !msg.length) {
      return Promise.reject(error.userNotFound())
    }
    return msg
  },
  'user.add.error.receive': function (msg) {
    if (msg.type && error[msg.type]) {
      throw error[msg.type]()
    }
    return msg
  }
}
