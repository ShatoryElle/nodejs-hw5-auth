// export function registerController(req, res) {
//     res.send('Register');
//   }

import { registerUser, loginUser, logoutUser, refreshTokens } from '../services/auth.js';

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await registerUser({ name, email, password });

  res.status(201).json({
    status: 'success',
    code: 201,
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

  const tokens = await loginUser(email, password);

  res.status(200).json({
    status: 'success',
    code: 200,
    data: tokens,
  });
};

export const logoutController = async (req, res) => {
  const { refreshToken } = req.body;

  await logoutUser(refreshToken);

  res.status(204).send();
};

export const refreshController = async (req, res) => {
  const { refreshToken } = req.body;

  const tokens = await refreshTokens(refreshToken);

  res.status(200).json({
    status: 'success',
    code: 200,
    data: tokens,
  });
};
