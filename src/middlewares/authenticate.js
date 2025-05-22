import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import Session from '../db/models/session.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';

export default async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw createHttpError(401, 'Authorization header is missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw createHttpError(401, 'Invalid authorization format');
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_ACCESS_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Invalid access token');
    }

    const session = await Session.findOne({ accessToken: token });

    if (!session) {
      throw createHttpError(401, 'Session not found or token not valid');
    }

    if (session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Access token expired');
    }

    req.user = {
      id: payload.id,
      sessionId: session._id,
    };

    next();
  } catch (error) {
    next(error);
  }
}
