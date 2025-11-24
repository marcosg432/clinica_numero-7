import authService from '../services/authService.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res) {
  // Com JWT stateless, logout é no frontend (remover token)
  // Se usar refresh token blacklist, invalidar aqui
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
}

export async function getProfile(req, res) {
  res.json({
    success: true,
    data: req.user,
  });
}


