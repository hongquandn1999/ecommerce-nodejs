'use strict';

const { Types } = require('mongoose');
const keyTokenModel = require('../models/keyToken.model');

class KeyTokenService {
  static createKeyToken = async ({
    refreshToken,
    userId,
    publicKey,
    privateKey,
  }) => {
    try {
      // lv0
      const publicKeyString = publicKey.toString();
      const privateKeyString = privateKey.toString();
      // const keyToken = await keyTokenModel.create({
      //   user: userId,
      //   publicKey: publicKeyString,
      //   privateKey: privateKeyString,
      // });
      // return keyToken ? publicKeyString : null;

      // lv xxx
      const filter = { user: userId },
        update = {
          publicKey: publicKeyString,
          privateKey: privateKeyString,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      throw error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) });
  };

  static removeKeyById = async (id) => {
    const result = await keyTokenModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
    return result;
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.findByIdAndDelete({ user: userId });
  };
}

module.exports = KeyTokenService;
