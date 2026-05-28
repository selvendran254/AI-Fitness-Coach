import QRCode from 'qrcode';
import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export async function createPairingToken(userId: string) {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const row = await prisma.pairingToken.create({
    data: { userId, expiresAt },
  });
  const url = `${process.env.CORS_ORIGIN ?? 'http://localhost:5173'}/devices?pair=${row.token}`;
  const qrDataUrl = await QRCode.toDataURL(url, { width: 280, margin: 2 });
  return { token: row.token, url, qrDataUrl, expiresAt };
}

export async function consumePairingToken(token: string) {
  const row = await prisma.pairingToken.findUnique({ where: { token } });
  if (!row || row.usedAt || row.expiresAt < new Date()) {
    throw new NotFoundError('Invalid or expired pairing code');
  }
  await prisma.pairingToken.update({
    where: { id: row.id },
    data: { usedAt: new Date() },
  });
  return { userId: row.userId };
}
