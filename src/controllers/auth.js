import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokens,
} from '../services/auth.js';

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  const { user, refreshToken, sessionId } = await registerUser({
    name,
    email,
    password,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken, sessionId } = await loginUser(
    email,
    password
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      accessToken,
      sessionId,
    },
  });
};

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;

  if (!sessionId) {
    return res.status(400).json({
      status: 'error',
      message: 'Session ID is missing',
      data: null,
    });
  }

  await logoutUser(sessionId);

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(200).json({
    status: 'success',
    message: 'Logout successful',
    data: null,
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken } = req.cookies;

  const { accessToken, refreshToken: newRefreshToken, sessionId } =
    await refreshTokens(refreshToken);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    message: 'Token refreshed',
    data: {
      accessToken,
      sessionId,
    },
  });
};
