import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export async function inviteCaregiver(patientId: string, caregiverEmail: string) {
  return prisma.caregiverLink.create({
    data: { patientId, caregiverEmail, status: 'pending' },
  });
}

export async function acceptCaregiverInvite(token: string, caregiverId: string) {
  const link = await prisma.caregiverLink.findUnique({ where: { inviteToken: token } });
  if (!link) throw new NotFoundError('Invite');
  return prisma.caregiverLink.update({
    where: { id: link.id },
    data: { caregiverId, status: 'active' },
  });
}

export async function getPatientSummaryForCaregiver(caregiverId: string, patientId: string) {
  const link = await prisma.caregiverLink.findFirst({
    where: { caregiverId, patientId, status: 'active' },
  });
  if (!link) throw new NotFoundError('Caregiver access');

  const [progress, devices] = await Promise.all([
    prisma.progressEntry.findMany({
      where: { userId: patientId },
      orderBy: { recordedAt: 'desc' },
      take: 7,
    }),
    prisma.deviceConnection.findMany({
      where: { userId: patientId, status: 'CONNECTED' },
    }),
  ]);

  const patient = await prisma.user.findUnique({
    where: { id: patientId },
    select: { firstName: true, lastName: true, email: true },
  });

  return { patient, progress, devices };
}

export async function listCaregiverPatients(caregiverId: string) {
  return prisma.caregiverLink.findMany({
    where: { caregiverId, status: 'active' },
    include: { patient: { select: { id: true, firstName: true, lastName: true, email: true } } },
  });
}
