import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

describe('Password hashing', () => {
  it('hashes and verifies passwords', async () => {
    const hash = await hashPassword('test-password-123');
    expect(hash).not.toBe('test-password-123');
    expect(await comparePassword('test-password-123', hash)).toBe(true);
    expect(await comparePassword('wrong', hash)).toBe(false);
  });
});
