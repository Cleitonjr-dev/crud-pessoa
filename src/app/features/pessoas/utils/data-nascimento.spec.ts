import { isValidBirthDate, maskDate, onlyDigits } from './data-nascimento';

describe('onlyDigits', () => {
  it('should keep only the digits', () => {
    expect(onlyDigits('01/02/2000')).toBe('01022000');
    expect(onlyDigits('abc')).toBe('');
  });
});

describe('maskDate', () => {
  it('should format complete and partial dates', () => {
    expect(maskDate('01022000')).toBe('01/02/2000');
    expect(maskDate('0102')).toBe('01/02');
    expect(maskDate('010')).toBe('01/0');
    expect(maskDate('')).toBe('');
  });

  it('should ignore letters and extra digits', () => {
    expect(maskDate('01a02b20001234')).toBe('01/02/2000');
  });
});

describe('isValidBirthDate', () => {
  const today = new Date(2026, 5, 15);

  it('should accept a real date', () => {
    expect(isValidBirthDate('29022000', today)).toBe(true);
    expect(isValidBirthDate('15062026', today)).toBe(true);
  });

  it('should reject dates that do not exist', () => {
    expect(isValidBirthDate('31022000', today)).toBe(false);
    expect(isValidBirthDate('29022001', today)).toBe(false);
    expect(isValidBirthDate('00012000', today)).toBe(false);
    expect(isValidBirthDate('01132000', today)).toBe(false);
  });

  it('should reject future dates', () => {
    expect(isValidBirthDate('16062026', today)).toBe(false);
  });

  it('should reject incomplete values', () => {
    expect(isValidBirthDate('0102200', today)).toBe(false);
    expect(isValidBirthDate('', today)).toBe(false);
  });
});
