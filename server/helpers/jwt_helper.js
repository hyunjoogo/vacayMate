import jwt from 'jsonwebtoken';
import redisCli from './init_redis.js'

const signAccessToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: '1h',
      issuer: 'Vacay-Mate',
      audience: String(user.id),
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err.message);
        return;
      }
      resolve(token);
    });
  });
};

const verifyAccessToken = async (token) => {
  // if (!req.headers['authorization']) return next(createError.Unauthorized())
  // const authHeader = req.headers['authorization']
  // const bearerToken = authHeader.split(' ')
  // const token = bearerToken[1]
  // JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
  //   if (err) {
  //     const message =
  //       err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
  //     return next(createError.Unauthorized(message))
  //   }
  //   req.payload = payload
  //   next()
  // })
};

const signRefreshToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: '1y',
      issuer: 'Vacay-Mate',
      audience: String(user.id),
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err.message);
        return;
      }
      resolve(token)
    });
  });
};

const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        const userId = payload.aud
        // client.GET(userId, (err, result) => {
        //   if (err) {
        //     console.log(err.message)
        //     reject(createError.InternalServerError())
        //     return
        //   }
        //   if (refreshToken === result) return resolve(userId)
        //   reject(createError.Unauthorized())
        // })
      }
    )
  })
}


export { signAccessToken, verifyAccessToken, signRefreshToken , verifyRefreshToken};

