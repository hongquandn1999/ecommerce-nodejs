const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');
const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id',
  REFRESH_TOKEN: 'refresh-token',
};
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, privateKey, {
      expiresIn: '2 days',
      algorithm: 'RS256',
    });

    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: '7 days',
      algorithm: 'RS256',
    });

    jwt.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        throw err;
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /**
   * 1. Check userId exist
   * 2. get accessToken from header
   * 3. verify accessToken
   * 4. check user at dbs
   * 5. check keyStore with userId at dbs
   * 6. return next()
   */

  // 1. Check userId exist
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError('Invalid request');
  }

  // 2
  const keyStore = await findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError('Not found keyStore');
  }
  // 3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError('Invalid request accessToken');
  }

  // 4
  try {
    const decodeUser = await jwt.verify(
      accessToken,
      keyStore.publicKey,
      (err, decoded) => {
        if (err) {
          throw err;
        }
      }
    );
    // if (userId !== decodeUser.userId) {
    //   throw new AuthFailureError('Invalid userId');
    // }
    req.keyStore = keyStore;
    next();
    // 5
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  /**
   * 1. Check userId exist
   * 2. get accessToken from header
   * 3. verify accessToken
   * 4. check user at dbs
   * 5. check keyStore with userId at dbs
   * 6. return next()
   */

  // 1. Check userId exist
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError('Invalid request');
  }

  // 2
  const keyStore = await findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError('Not found keyStore');
  }

  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decodeUser = await jwt.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) {
        throw new AuthFailureError('Invalid userId');
      }
      req.keyStore = keyStore;
      req.refreshToken = refreshToken;
      req.user = decodeUser;
      return next();
      // 5
    } catch (error) {
      throw error;
    }
  }

  // 3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError('Invalid request accessToken');
  }

  // 4
  try {
    const decodeUser = await jwt.verify(
      accessToken,
      keyStore.publicKey,
      (err, decoded) => {
        if (err) {
          throw err;
        }
      }
    );
    if (userId !== decodeUser?.userId) {
      throw new AuthFailureError('Invalid userId');
    }
    req.keyStore = keyStore;
    return next();
    // 5
  } catch (error) {
    throw error;
  }
});

const verifyToken = async (token, keySecret) => {
  return await jwt.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyToken,
  authenticationV2,
};
