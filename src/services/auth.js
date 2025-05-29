import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils.js';

export async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email is already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const { accessToken, expiresAt: accessTokenValidUntil } = generateAccessToken(user._id.toString());
  const { refreshToken, expiresAt: refreshTokenValidUntil } = generateRefreshToken();

  const session = await Session.create({
    userId: user._id,
    refreshToken,
    refreshTokenValidUntil,
    accessToken,
    accessTokenValidUntil,
  });

  return {
    user,
    accessToken,
    refreshToken,
    sessionId: session._id.toString(),
  };
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  // Видалення попередніх сесій користувача
  await Session.deleteMany({ userId: user._id });

  const { accessToken, expiresAt: accessTokenValidUntil } = generateAccessToken(user._id.toString());
  const { refreshToken, expiresAt: refreshTokenValidUntil } = generateRefreshToken();

  const session = await Session.create({
    userId: user._id,
    refreshToken,
    refreshTokenValidUntil,
    accessToken,
    accessTokenValidUntil,
  });

  return {
    user,
    accessToken,
    refreshToken,
    sessionId: session._id.toString(),
  };
}

export async function logoutUser(sessionId) {
  const deletedSession = await Session.findByIdAndDelete(sessionId);
  if (!deletedSession) {
    throw createHttpError(404, 'Session not found');
  }
}

export async function refreshTokens(oldRefreshToken) {
  if (!oldRefreshToken) {
    throw createHttpError(401, 'Refresh token is missing');
  }

  const session = await Session.findOne({ refreshToken: oldRefreshToken });
  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const { accessToken, expiresAt: accessTokenValidUntil } = generateAccessToken(session.userId.toString());
  const { refreshToken, expiresAt: refreshTokenValidUntil } = generateRefreshToken();

  session.refreshToken = refreshToken;
  session.refreshTokenValidUntil = refreshTokenValidUntil;
  session.accessToken = accessToken;
  session.accessTokenValidUntil = accessTokenValidUntil;

  await session.save();

  return {
    accessToken,
    refreshToken,
    sessionId: session._id.toString(),
  };
}
