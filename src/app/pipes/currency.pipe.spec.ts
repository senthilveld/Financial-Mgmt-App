import { CurrencyPipe } from './currency.pipe';

describe('CurrencyPipe', () => {
  let pipe: CurrencyPipe;

  beforeEach(() => {
    pipe = new CurrencyPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format positive numbers correctly', () => {
    expect(pipe.transform(1234.56)).toBe('$1,234.56');
  });

  it('should format negative numbers correctly', () => {
    expect(pipe.transform(-1234.56)).toBe('-$1,234.56');
  });

  it('should handle null and undefined values', () => {
    expect(pipe.transform(null)).toBe('$0.00');
    expect(pipe.transform(undefined)).toBe('$0.00');
  });

  it('should show positive sign when requested', () => {
    expect(pipe.transform(1234.56, 'USD', true)).toBe('+$1,234.56');
  });

  it('should handle zero values', () => {
    expect(pipe.transform(0)).toBe('$0.00');
  });
});
