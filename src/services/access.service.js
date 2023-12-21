'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { RoleShop } = require('../constants');
const { createTokenPair } = require('../auth/authUtil');
const { getInfoData } = require('../utils');
const {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
} = require('../core/error.response');

class AccessService {
  static signup = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new ForbiddenError('Error: Shop already exists');
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });
      if (newShop) {
        // created privateKey: sign token, publicKey: verify token
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
        });

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!publicKeyString) {
          throw new ForbiddenError('Error: Create key token failed');
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString);

        // create token pair
        const tokenPair = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyObject,
          privateKey
        );

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ['_id', 'name', 'email'],
              data: newShop,
            }),
            tokenPair,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  };
}

module.exports = AccessService;
