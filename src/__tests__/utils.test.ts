import { isLibraryItem } from '../utils/is-library-item';
import { getErrorMessage } from '../utils/get-error-message';

describe('isLibraryItem', () => {
  it('returns true for library IDs starting with "l."', () => {
    expect(isLibraryItem('l.abc123')).toBe(true);
  });

  it('returns true for library IDs starting with "i."', () => {
    expect(isLibraryItem('i.abc123')).toBe(true);
  });

  it('returns true for library IDs starting with "p."', () => {
    expect(isLibraryItem('p.abc123')).toBe(true);
  });

  it('returns false for numeric catalog IDs', () => {
    expect(isLibraryItem('1234567890')).toBe(false);
  });

  it('returns true for non-numeric strings without prefix', () => {
    // The implementation treats non-numeric IDs as library items
    expect(isLibraryItem('abc123')).toBe(true);
  });
});

describe('getErrorMessage', () => {
  it('returns the error message when error has a message property', () => {
    expect(getErrorMessage(new Error('Something went wrong'))).toBe('Something went wrong');
  });

  it('returns the error message from plain objects', () => {
    expect(getErrorMessage({ message: 'Custom error' })).toBe('Custom error');
  });

  it('returns default message for null', () => {
    expect(getErrorMessage(null)).toBe('Authorization failed');
  });

  it('returns default message for undefined', () => {
    expect(getErrorMessage(undefined)).toBe('Authorization failed');
  });

  it('returns default message for empty string message', () => {
    expect(getErrorMessage({ message: '' })).toBe('Authorization failed');
  });

  it('returns default message for whitespace-only message', () => {
    expect(getErrorMessage({ message: '   ' })).toBe('Authorization failed');
  });

  it('returns default message for non-string message', () => {
    expect(getErrorMessage({ message: 42 })).toBe('Authorization failed');
  });
});
