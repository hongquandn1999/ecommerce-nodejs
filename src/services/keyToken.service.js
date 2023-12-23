'use strict';

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
}

module.exports = KeyTokenService;
