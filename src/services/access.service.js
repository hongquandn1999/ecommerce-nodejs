'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { RoleShop } = require('../constants');
const { createTokenPair, verifyToken } = require('../auth/authUtil');
const { getInfoData } = require('../utils');
const {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  AuthFailureError,
} = require('../core/error.response');
const { findByEmail } = require('./shop.service');

class AccessService {
  /**
   * check this token already used
   */

  static handleRefreshToken = async (refreshToken) => {
    // check this token already used
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      // check token expired
      const { userId, email } = await verifyToken(
        refreshToken,
        foundToken.privateKey
      );

      console.log('userId', userId);
      console.log('email', email);
      // remove key token
      await KeyTokenService.removeKeyById(foundToken._id);
      throw new ForbiddenError(
        'Something wrong happened !! Please login again'
      );
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);

    if (!holderToken) {
      throw new AuthFailureError('Shop not registered');
    }

    // verify token
    const { userId, email } = await verifyToken(
      refreshToken,
      holderToken.privateKey
    );

    console.log('::2::', { userId, email });

    const foundShop = await findByEmail(email);

    if (!foundShop) {
      throw new AuthFailureError('Error: Shop not found');
    }

    // create new token pair
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // update key token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };
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
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      userId,
      publicKey,
      privateKey,
    });

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

  static logout = async (keyStore) => {
    const deleteKey = await KeyTokenService.removeKeyById(keyStore._id);
    if (!deleteKey) {
      throw new ForbiddenError('Error: Delete key token failed');
    }
    return deleteKey;
  };
}

module.exports = AccessService;
