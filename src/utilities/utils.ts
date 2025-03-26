import { customAlphabet } from 'nanoid';
import bcrypt from 'bcryptjs';

export function getUniqueAllNumberId(size: number): string {
  const uniqueId = customAlphabet('0123456789', size);
  const id = uniqueId();
  return id;
}

export function hashWord(word: string): string | undefined {
  if (word) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(word, salt);
  }
  return undefined;
}

export function validatePassword(
  password: string,
  hashedPassword: string,
): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}
