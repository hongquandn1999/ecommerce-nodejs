'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const RoleShop = {
  ADMIN: '0000',
  WRITER: '0001',
  EDITOR: '0002',
  SHOP: '0003',
};

class AccessService {
  static signup = async ({ name, email, password }) => {
    try {
      const holderShop = shopModel.findOne({ email }).lean();
      if (holderShop) {
        return res.status(400).json({
          code: '40001',
          message: 'Shop already exists',
          status: 'error',
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = new shopModel({
        name,
        email,
        passwordHash,
        roles: [RoleShop.SHOP],
      });
      if (newShop) {
        // created privateKey: sign token, publicKey: verify token
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
          },
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ code: '50001', message: error.message, status: 'error' });
    }
  };
}
