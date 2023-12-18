'use strict';

const keyTokenModel = require('../models/keyToken.model');

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const keyToken = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });
      console.log(keyToken);
      return keyToken ? publicKeyString : null;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = KeyTokenService;
