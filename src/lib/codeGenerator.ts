export function generateRoomCode(): string {
  const prefixes = ['LOVE', 'DEAR', 'SWEET', 'HONEY', 'HEART', 'KISS', 'FOREVER', 'CUPID'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomDigits = Math.floor(100 + Math.random() * 900); // 3 digits
  return `${prefix}${randomDigits}`;
}

export function isValidRoomCode(code: string): boolean {
  return /^[A-Za-z0-9_-]{4,12}$/.test(code.trim());
}
