import webpush from 'web-push';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

const vapidPublic = process.env.VAPID_PUBLIC_KEY;
const vapidPrivate = process.env.VAPID_PRIVATE_KEY;

if (vapidPublic && vapidPrivate) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? 'mailto:admin@fitcoach.demo',
    vapidPublic,
    vapidPrivate
  );
}

export async function createNotification(
  userId: string,
  title: string,
  body: string,
  type: string,
  data?: Record<string, unknown>
) {
  return prisma.notification.create({
    data: { userId, title, body, type, data: (data ?? undefined) as Prisma.InputJsonValue | undefined },
  });
}

export async function listNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function markRead(userId: string, id: string) {
  const n = await prisma.notification.findFirst({ where: { id, userId } });
  if (!n) throw new NotFoundError('Notification');
  return prisma.notification.update({ where: { id }, data: { read: true } });
}

export async function subscribePush(userId: string, subscription: { endpoint: string; keys: object }) {
  await prisma.pushSubscription.deleteMany({ where: { userId, endpoint: subscription.endpoint } });
  return prisma.pushSubscription.create({
    data: { userId, endpoint: subscription.endpoint, keys: subscription.keys },
  });
}

export async function sendPushToUser(userId: string, title: string, body: string) {
  if (!vapidPublic || !vapidPrivate) return;
  const subs = await prisma.pushSubscription.findMany({ where: { userId } });
  await Promise.allSettled(
    subs.map((s) =>
      webpush.sendNotification(
        { endpoint: s.endpoint, keys: s.keys as webpush.PushSubscription['keys'] },
        JSON.stringify({ title, body })
      )
    )
  );
}
