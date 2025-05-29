import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokens,
} from '../services/auth.js';

export const registerController = async (req, res) => {
  try {
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
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const { _id, createdAt, updatedAt } = user;

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        name,
        email,
        _id,
        createdAt,
        updatedAt,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'Internal server error',
      data: null,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken, sessionId } = await loginUser(
      email,
      password
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'Internal server error',
      data: null,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    const { sessionId } = req.cookies;

    if (!sessionId) {
      return res.status(400).json({
        status: 400,
        message: 'Session ID is missing',
        data: null,
      });
    }

    await logoutUser(sessionId);

    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'Internal server error',
      data: null,
    });
  }
};

export const refreshController = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        status: 401,
        message: 'Refresh token is missing',
        data: null,
      });
    }

    const { accessToken, refreshToken: newRefreshToken, sessionId } =
      await refreshTokens(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'Internal server error',
      data: null,
    });
  }
};
