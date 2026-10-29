export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Formata os dígitos digitados como dd/mm/aaaa, aceitando valores parciais. */
export function maskDate(value: string): string {
  const digits = onlyDigits(value).slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)];

  return parts.filter(Boolean).join('/');
}

/** Verdadeiro para uma data real (DDMMAAAA), que não esteja no futuro. */
export function isValidBirthDate(digits: string, today = new Date()): boolean {
  if (!/^\d{8}$/.test(digits)) {
    return false;
  }

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  return isRealDate && year >= 1 && date <= today;
}
