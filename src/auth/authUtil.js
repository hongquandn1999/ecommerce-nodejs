const jwt = require('jsonwebtoken');
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
      console.log(`:::decoded::: ${JSON.stringify(decoded)}`);
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

module.exports = { createTokenPair };
