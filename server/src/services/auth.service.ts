import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { generateSecret, verify as verifyOtp, generateURI } from 'otplib';
import nodemailer from 'nodemailer';
import type { UserRole } from '@prisma/client';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { ConflictError, UnauthorizedError } from '../utils/errors';
import { DEFAULT_USER_SETTINGS } from '@ai-fitness-coach/shared';

const SALT_ROUNDS = 12;

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Hash a plain-text password.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare password with hash.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT access token.
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

/**
 * Verify JWT access token.
 */
export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}

/**
 * Create and persist a refresh token.
 */
export async function createRefreshToken(userId: string): Promise<string> {
  const token = randomBytes(64).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: { userId, token, expiresAt },
  });

  return token;
}

/**
 * Rotate refresh token — revoke old, issue new.
 */
export async function rotateRefreshToken(oldToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const stored = await prisma.refreshToken.findUnique({
    where: { token: oldToken },
    include: { user: true },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const accessToken = generateAccessToken({
    id: stored.user.id,
    email: stored.user.email,
    role: stored.user.role,
  });
  const refreshToken = await createRefreshToken(stored.user.id);

  return { accessToken, refreshToken };
}

/**
 * Register a new user with default goals and settings.
 */
export async function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  preferredLanguage?: 'en' | 'ta';
  healthConditions?: string[];
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new ConflictError('Email already registered');

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      preferredLanguage: data.preferredLanguage ?? 'en',
      healthConditions: (data.healthConditions ?? []) as never[],
      goals: { create: {} },
      settings: {
        create: {
          preferences: DEFAULT_USER_SETTINGS as object,
        },
      },
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      preferredLanguage: true,
      createdAt: true,
    },
  });

  return user;
}

/**
 * Authenticate user and return tokens.
 */
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw new UnauthorizedError('Invalid credentials');

  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = await createRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
    },
    accessToken,
    refreshToken,
    expiresIn: 900,
  };
}

/**
 * Revoke all refresh tokens for a user (logout everywhere).
 */
const mailer =
  process.env.SMTP_HOST &&
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

async function sendEmail(to: string, subject: string, html: string) {
  if (mailer) {
    await mailer.sendMail({ from: process.env.SMTP_FROM ?? 'noreply@fitcoach.app', to, subject, html });
  } else {
    console.log(`[email] To: ${to} | ${subject}\n${html}`);
  }
}

export async function requestEmailVerification(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new UnauthorizedError('User not found');
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await prisma.user.update({
    where: { id: userId },
    data: { emailVerifyToken: token, emailVerifyExpires: expires },
  });
  const link = `${process.env.CORS_ORIGIN ?? 'http://localhost:5173'}/verify-email?token=${token}`;
  await sendEmail(user.email, 'Verify your email', `<p>Click <a href="${link}">here</a> to verify.</p>`);
  return { sent: true };
}

export async function verifyEmail(token: string) {
  const user = await prisma.user.findFirst({
    where: { emailVerifyToken: token, emailVerifyExpires: { gt: new Date() } },
  });
  if (!user) throw new UnauthorizedError('Invalid token');
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, emailVerifyToken: null, emailVerifyExpires: null },
  });
  return user;
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { sent: true };
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken: token, passwordResetExpires: expires },
  });
  const link = `${process.env.CORS_ORIGIN ?? 'http://localhost:5173'}/reset-password?token=${token}`;
  await sendEmail(user.email, 'Reset password', `<p>Reset: <a href="${link}">${link}</a></p>`);
  return { sent: true };
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: { passwordResetToken: token, passwordResetExpires: { gt: new Date() } },
  });
  if (!user) throw new UnauthorizedError('Invalid token');
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(newPassword),
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });
}

export async function setup2FA(userId: string) {
  const secret = generateSecret();
  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorSecret: secret, twoFactorEnabled: false },
  });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const otpauth = generateURI({ issuer: 'AI Fitness Coach', label: user!.email, secret });
  return { secret, otpauth };
}

export async function enable2FA(userId: string, code: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.twoFactorSecret) throw new UnauthorizedError('Setup 2FA first');
  const ok = await verifyOtp({ secret: user.twoFactorSecret, token: code });
  if (!ok) throw new UnauthorizedError('Invalid code');
  await prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: true } });
}

export async function verify2FA(email: string, password: string, code: string) {
  const result = await loginUser(email, password);
  const user = await prisma.user.findUnique({ where: { email } });
  if (user?.twoFactorEnabled && user.twoFactorSecret) {
    const ok = await verifyOtp({ secret: user.twoFactorSecret, token: code });
    if (!ok) throw new UnauthorizedError('Invalid 2FA code');
  }
  return result;
}

export async function completeOnboarding(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { onboardingCompleted: true },
  });
}

export async function logoutUser(userId: string, refreshToken?: string): Promise<void> {
  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { userId, token: refreshToken, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  } else {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
