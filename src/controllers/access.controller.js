const { ForbiddenError } = require('../core/error.response');
const { Created, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/Access.service');

class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      message: 'Login OK!',
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signup = async (req, res, next) => {
    new Created({
      message: 'Registered OK!',
      metadata: await AccessService.signup(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
