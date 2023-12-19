const apiKeyModel = require('../models/apiKey.model');
const crypto = require('crypto');

const findById = async (key) => {
  const keys = await apiKeyModel.create({
    key: crypto.randomBytes(64).toString('hex'),
    permissions: ['0000'],
  });
  console.log(keys);

  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    const { permissions } = req.objKey;
    if (!permissions) {
      return res.status(403).json({ message: 'Permission Denied' });
    }
    if (permissions.includes(permission)) {
      return next();
    }
    return res.status(403).json({ message: 'Permission Denied' });
  };
};

module.exports = {
  findById,
  checkPermission,
};
