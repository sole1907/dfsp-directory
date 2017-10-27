var test = require('ut-run/test')
var config = require('./../lib/appConfig')
var joi = require('joi')
var uuid = require('uuid/v4')

const IDENTIFIER_1 = uuid()
const FIRST_NAME_1 = uuid()
const LAST_NAME_1 = uuid()
const NATIONAL_ID_1 = uuid()

const IDENTIFIER_2 = uuid()
const FIRST_NAME_2 = uuid()
const LAST_NAME_2 = uuid()
const NATIONAL_ID_2 = uuid()

test({
  type: 'integration',
  name: 'Directory service',
  server: config.server,
  serverConfig: config.serverConfig,
  client: config.client,
  clientConfig: config.clientConfig,
  steps: function (test, bus, run) {
    return run(test, bus, [
      {
        name: 'Add user #1',
        method: 'directory.user.add',
        params: (context) => {
          return {
            identifier: IDENTIFIER_1,
            identifierTypeCode: 'tel',
            firstName: FIRST_NAME_1,
            lastName: LAST_NAME_1,
            dob: '1972/01/02',
            nationalId: NATIONAL_ID_1
          }
        },
        result: (result, assert) => {
          assert.equals(joi.validate(result, {
            actorId: joi.number().required(),
            identifier: joi.string().valid(IDENTIFIER_1).required(),
            identifierTypeCode: joi.string().valid('tel').required(),
            firstName: joi.string().valid(FIRST_NAME_1).required(),
            lastName: joi.string().valid(LAST_NAME_1).required(),
            dob: joi.date().required(),
            nationalId: joi.string().valid(NATIONAL_ID_1).required()
          }).error, null, 'user added successfully')
        }
      },
      {
        name: 'Try to add user #1 - again',
        method: 'directory.user.add',
        params: (context) => {
          return {
            identifier: IDENTIFIER_1,
            identifierTypeCode: 'tel',
            firstName: FIRST_NAME_1,
            lastName: LAST_NAME_1,
            dob: '1972/01/02',
            nationalId: NATIONAL_ID_1
          }
        },
        error: (error, assert) => {
          assert.equals(
            error.errorPrint,
            'There is already registered user with this identifier!',
            'Check the error message for adding already registered user'
          )
        }
      },
      {
        name: 'Add user #2',
        method: 'directory.user.add',
        params: (context) => {
          return {
            identifier: IDENTIFIER_2,
            identifierTypeCode: 'tel',
            firstName: FIRST_NAME_2,
            lastName: LAST_NAME_2,
            dob: '1972/01/02',
            nationalId: NATIONAL_ID_2
          }
        },
        result: (result, assert) => {
          assert.equals(joi.validate(result, {
            actorId: joi.number().required(),
            identifier: joi.string().valid(IDENTIFIER_2).required(),
            identifierTypeCode: joi.string().valid('tel').required(),
            firstName: joi.string().valid(FIRST_NAME_2).required(),
            lastName: joi.string().valid(LAST_NAME_2).required(),
            dob: joi.date().required(),
            nationalId: joi.string().valid(NATIONAL_ID_2).required()
          }).error, null, 'user added successfully')
        }
      },
      {
        name: 'Fetch single user',
        method: 'directory.user.fetch',
        params: (context) => {
          return {
            actorId: [context['Add user #1'].actorId]
          }
        },
        result: (result, assert) => {
          assert.equals(
            joi.validate(result, joi.array().items({
              actorId: joi.number().required(),
              identifiers: joi.array().items({
                identifier: IDENTIFIER_1,
                identifierTypeCode: 'tel'
              }).length(1).required(),
              firstName: joi.string().valid(FIRST_NAME_1).required(),
              lastName: joi.string().valid(LAST_NAME_1).required(),
              dob: joi.date().required(),
              nationalId: joi.string().valid(NATIONAL_ID_1).required()
            }).length(1)).error,
            null,
            'user fetched successfully'
          )
        }
      },
      {
        name: 'Fetch users',
        method: 'directory.user.fetch',
        params: (context) => {
          return {
            actorId: [context['Add user #1'].actorId, context['Add user #2'].actorId]
          }
        },
        result: (result, assert) => {
          assert.equals(
            joi.validate(result, joi.array().ordered({
              actorId: joi.number().required(),
              identifiers: joi.array().items({
                identifier: IDENTIFIER_1,
                identifierTypeCode: 'tel'
              }).length(1).required(),
              firstName: joi.string().valid(FIRST_NAME_1).required(),
              lastName: joi.string().valid(LAST_NAME_1).required(),
              dob: joi.date().required(),
              nationalId: joi.string().valid(NATIONAL_ID_1).required()
            },
              {
                actorId: joi.number().required(),
                identifiers: joi.array().items({
                  identifier: IDENTIFIER_2,
                  identifierTypeCode: 'tel'
                }).length(1).required(),
                firstName: joi.string().valid(FIRST_NAME_2).required(),
                lastName: joi.string().valid(LAST_NAME_2).required(),
                dob: joi.date().required(),
                nationalId: joi.string().valid(NATIONAL_ID_2).required()
              }).length(2)).error,
            null,
            'users fetched successfully'
          )
        }
      },
      {
        name: 'Fetch empty users',
        method: 'directory.user.fetch',
        params: {},
        result: (result, assert) => {
          assert.deepEquals(
            result,
            [],
            'no users fetched successfully'
          )
        }
      },
      {
        name: 'Get user by actorId',
        method: 'directory.user.get',
        params: (context) => {
          return {
            actorId: context['Add user #1'].actorId
          }
        },
        result: (result, assert) => {
          assert.equals(
            joi.validate(result, {
              actorId: joi.number().required(),
              identifiers: joi.array().items({
                identifier: IDENTIFIER_1,
                identifierTypeCode: 'tel'
              }).length(1).required(),
              firstName: joi.string().valid(FIRST_NAME_1).required(),
              lastName: joi.string().valid(LAST_NAME_1).required(),
              dob: joi.date().required(),
              nationalId: joi.string().valid(NATIONAL_ID_1).required()
            }).error,
            null,
            'user get successfully'
          )
        }
      },
      {
        name: 'Get user by actorId and identifier',
        method: 'directory.user.get',
        params: (context) => {
          return {
            actorId: context['Add user #1'].actorId,
            identifier: IDENTIFIER_1
          }
        },
        result: (result, assert) => {
          assert.equals(
            joi.validate(result, {
              actorId: joi.number().required(),
              identifiers: joi.array().items({
                identifier: IDENTIFIER_1,
                identifierTypeCode: 'tel'
              }).length(1).required(),
              firstName: joi.string().valid(FIRST_NAME_1).required(),
              lastName: joi.string().valid(LAST_NAME_1).required(),
              dob: joi.date().required(),
              nationalId: joi.string().valid(NATIONAL_ID_1).required()
            }).error,
            null,
            'user get successfully'
          )
        }
      },
      {
        name: 'Get user by actorId and identifier and identifier type',
        method: 'directory.user.get',
        params: (context) => {
          return {
            actorId: context['Add user #1'].actorId,
            identifier: IDENTIFIER_1,
            identifierTypeCode: 'tel'
          }
        },
        result: (result, assert) => {
          assert.equals(
            joi.validate(result, {
              actorId: joi.number().required(),
              identifiers: joi.array().items({
                identifier: IDENTIFIER_1,
                identifierTypeCode: 'tel'
              }).length(1).required(),
              firstName: joi.string().valid(FIRST_NAME_1).required(),
              lastName: joi.string().valid(LAST_NAME_1).required(),
              dob: joi.date().required(),
              nationalId: joi.string().valid(NATIONAL_ID_1).required()
            }).error,
            null,
            'user get successfully'
          )
        }
      },
      {
        name: 'Get user by actorId and identifier type',
        method: 'directory.user.get',
        params: (context) => {
          return {
            actorId: context['Add user #1'].actorId,
            identifierTypeCode: 'tel'
          }
        },
        result: (result, assert) => {
          assert.equals(
            joi.validate(result, {
              actorId: joi.number().required(),
              identifiers: joi.array().items({
                identifier: IDENTIFIER_1,
                identifierTypeCode: 'tel'
              }).length(1).required(),
              firstName: joi.string().valid(FIRST_NAME_1).required(),
              lastName: joi.string().valid(LAST_NAME_1).required(),
              dob: joi.date().required(),
              nationalId: joi.string().valid(NATIONAL_ID_1).required()
            }).error,
            null,
            'user get successfully'
          )
        }
      },
      {
        name: 'Get user without actorId',
        method: 'directory.user.get',
        params: (context) => {
          return {
            identifier: IDENTIFIER_1,
            identifierTypeCode: 'tel'
          }
        },
        result: (result, assert) => {
          assert.equals(
            joi.validate(result, {
              actorId: joi.number().required(),
              identifiers: joi.array().items({
                identifier: IDENTIFIER_1,
                identifierTypeCode: 'tel'
              }).length(1).required(),
              firstName: joi.string().valid(FIRST_NAME_1).required(),
              lastName: joi.string().valid(LAST_NAME_1).required(),
              dob: joi.date().required(),
              nationalId: joi.string().valid(NATIONAL_ID_1).required()
            }).error,
            null,
            'user get successfully'
          )
        }
      },
      {
        name: 'Get user without actorId and identifier',
        method: 'directory.user.get',
        params: (context) => {
          return {
            identifierTypeCode: 'tel'
          }
        },
        error: (error, assert) => {
          assert.equals(
            error.errorPrint,
            'You must provide either actorId or identifier',
            'get without actorId and identifier throws'
          )
        }
      },
      {
        name: 'Get user with invalid identifier type',
        method: 'directory.user.get',
        params: (context) => {
          return {
            actorId: context['Add user #1'].actorId,
            identifierTypeCode: 'xxx'
          }
        },
        error: (error, assert) => {
          assert.equals(
            error.errorPrint,
            'directory.identifierTypeCodeNotFound',
            'get invalid identifier type throws'
          )
        }
      },
      {
        name: 'Remove user',
        method: 'directory.user.remove',
        params: (context) => {
          return {
            actorId: context['Add user #1'].actorId
          }
        },
        result: function (result, assert) {
          assert.equals(
            joi.validate(result, {
              actorId: this['Add user #1'].actorId,
              identifiers: joi.array().items({
                identifier: IDENTIFIER_1,
                identifierTypeCode: 'tel'
              }).length(1).required()
            }).error,
            null,
            'user removed successfully'
          )
        }
      },
      {
        name: 'Remove user no params',
        method: 'directory.user.remove',
        params: (context) => {
          return {}
        },
        result: (result, assert) => {
          assert.deepEquals(
            result,
            {},
            'no user removed successfully'
          )
        }
      },
      {
        name: 'Remove user invalid params',
        method: 'directory.user.remove',
        params: (context) => {
          return {
            actorId: context['Add user #1'].actorId
          }
        },
        result: (result, assert) => {
          assert.deepEquals(
            result,
            {},
            'no user removed successfully'
          )
        }
      },
      {
        name: 'Get user with invalid identifier type',
        method: 'directory.user.get',
        params: (context) => {
          return {
            actorId: 999999999,
            identifierTypeCode: 'eur'
          }
        },
        error: (error, assert) => {
          assert.equals(
            error.errorPrint,
            'User not found',
            'Try to get user by not existing actorId'
          )
        }
      },
      {
        name: 'Add user #2',
        method: 'directory.user.add',
        params: (context) => {
          return {
            identifier: IDENTIFIER_2,
            identifierTypeCode: 'tel'
          }
        },
        error: (error, assert) => {
          assert.equals(error.errorPrint, 'There is already registered user with this identifier!', 'Check that we can not add user with not unique identifier and identifierTypeCode')
        }
      },
      {
        name: 'Get unregistered user',
        method: 'directory.user.get',
        params: {
          actorId: 544644
        },
        error: (error, assert) => {
          assert.equals(error.errorPrint, 'User not found', 'Check error message')
        }
      }
    ])
  }
}, module.parent)
