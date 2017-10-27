var create = require('ut-error').define
var UserNotFound = create('UserNotFound')
// var defaultErrorCode = 400

module.exports = Object.assign({
  userNotFound: function (params) {
    return new UserNotFound({
      message: 'User not found',
      params: params
    })
  }
},
  [
    {
      type: 'directory',
      message: 'directory error'
    },
    {
      id: 'NotUniqueCombinationIdentifierTypeCodeIdentifier',
      type: 'directory.notUniqueCombinationIdentifierTypeCodeIdentifier',
      message: 'There is already registered user with this identifier!',
      statusCode: 422
    },
    {
      id: 'MissingArguments',
      type: 'directory.missingArguments',
      message: 'You must provide either actorId or identifier',
      statusCode: 422
    }
  ].reduce((exporting, error) => {
    var typePath = error.type.split('.')
    var Ctor = create(typePath.pop(), typePath.join('.'), error.message)
    /**
     * Exceptions thrown from the db procedures will not execute this function
     * It will only be executed if an error is throw from JS
     */
    exporting[error.type] = function (params) {
      return new Ctor({
        isJsError: true,
        params: params,
        statusCode: error.statusCode, // || defaultErrorCode, // commented due to code coverage increasing - use it when there are errors without status code
        id: error.id // || error.type // commented due to code coverage increasing - use it when there are errors without type
      })
    }
    return exporting
  }, {}))
