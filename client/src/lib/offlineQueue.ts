const KEY = 'fitcoach-offline-queue';

export interface OfflineMutation {
  id: string;
  method: 'POST' | 'PATCH';
  url: string;
  body: unknown;
  createdAt: string;
}

export function queueMutation(m: Omit<OfflineMutation, 'id' | 'createdAt'>) {
  const q = getQueue();
  q.push({ ...m, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(q));
}

export function getQueue(): OfflineMutation[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export async function flushQueue(fetcher: (m: OfflineMutation) => Promise<void>) {
  const q = getQueue();
  const remain: OfflineMutation[] = [];
  for (const m of q) {
    try {
      await fetcher(m);
    } catch {
      remain.push(m);
    }
  }
  localStorage.setItem(KEY, JSON.stringify(remain));
}
