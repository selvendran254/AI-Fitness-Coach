import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import * as aiService from '../services/ai.service';
import type { UserSettings } from '@ai-fitness-coach/shared';

/**
 * POST /ai/chat — real-time coaching
 */
export async function chat(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { settings: true },
    });

    await prisma.chatMessage.create({
      data: { userId: req.user!.id, role: 'user', content: req.body.message },
    });

    const history = await prisma.chatMessage.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    const settings = user?.settings?.preferences as Partial<UserSettings> | undefined;
    const reply = await aiService.chatWithCoach(
      history.map((m: { role: string; content: string }) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      settings,
      user?.preferredLanguage
    );

    const assistantMsg = await prisma.chatMessage.create({
      data: { userId: req.user!.id, role: 'assistant', content: reply },
    });

    sendSuccess(res, { message: assistantMsg });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /ai/chat/history
 */
export async function chatHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });
    sendSuccess(res, messages);
  } catch (err) {
    next(err);
  }
}
