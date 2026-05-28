import { Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

/**
 * POST /auth/register
 */
export async function register(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await authService.registerUser(req.body);
    sendSuccess(res, user, 201, 'Registration successful');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /auth/login
 */
export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await authService.loginUser(req.body.email, req.body.password);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /auth/refresh
 */
export async function refresh(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const tokens = await authService.rotateRefreshToken(req.body.refreshToken);
    sendSuccess(res, tokens);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /auth/logout
 */
export async function logout(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (req.user) {
      await authService.logoutUser(req.user.id, req.body.refreshToken);
    }
    sendSuccess(res, null, 200, 'Logged out');
  } catch (err) {
    next(err);
  }
}

export async function verifyEmailRequest(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await authService.requestEmailVerification(req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await authService.verifyEmail(req.body.token));
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await authService.requestPasswordReset(req.body.email));
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    sendSuccess(res, { ok: true });
  } catch (err) {
    next(err);
  }
}

export async function setup2FA(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await authService.setup2FA(req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function enable2FA(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await authService.enable2FA(req.user!.id, req.body.code);
    sendSuccess(res, { ok: true });
  } catch (err) {
    next(err);
  }
}

export async function login2FA(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await authService.verify2FA(req.body.email, req.body.password, req.body.code));
  } catch (err) {
    next(err);
  }
}
