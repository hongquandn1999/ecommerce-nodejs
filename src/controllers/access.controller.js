const AccessService = require('../services/Access.service');

class AccessController {
  signup = async (req, res, next) => {
    try {
      console.log(`:::singup::: ${JSON.stringify(req.body)}`);

      return res.status(200).json(await AccessService.signup(req.body));
    } catch (error) {}
  };
}

module.exports = new AccessController();
