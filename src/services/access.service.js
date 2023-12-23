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
  AuthFailureError,
} = require('../core/error.response');
const { findByEmail } = require('./shop.service');

class AccessService {
  /*
    1. Check email exist
    2. Compare password
    3. Create token pair
    4. Return token pair

  */
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail(email);
    if (!foundShop) {
      throw new BadRequestError('Error: Shop not found');
    }

    const isMatch = await bcrypt.compare(password, foundShop.password);
    if (!isMatch) {
      throw new AuthFailureError('Authentication Error');
    }
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
    // generate key token
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        data: foundShop,
      }),
      tokens,
    };
  };

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
        const tokenPair = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );
        const keyStore = await KeyTokenService.createKeyToken({
          refreshToken: tokenPair.refreshToken,
          userId: { _id: newShop._id, email },
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          throw new ForbiddenError('Error: Create key token failed');
        }

        // create token pair

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
