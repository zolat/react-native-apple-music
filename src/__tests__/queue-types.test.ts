import { QueueInsertionPosition, ShuffleMode, RepeatMode } from '../types/queue';

describe('QueueInsertionPosition', () => {
  it('has NEXT = "next"', () => {
    expect(QueueInsertionPosition.NEXT).toBe('next');
  });

  it('has LATER = "later"', () => {
    expect(QueueInsertionPosition.LATER).toBe('later');
  });
});

describe('ShuffleMode', () => {
  it('has OFF = "off"', () => {
    expect(ShuffleMode.OFF).toBe('off');
  });

  it('has SONGS = "songs"', () => {
    expect(ShuffleMode.SONGS).toBe('songs');
  });
});

describe('RepeatMode', () => {
  it('has NONE = "none"', () => {
    expect(RepeatMode.NONE).toBe('none');
  });

  it('has ONE = "one"', () => {
    expect(RepeatMode.ONE).toBe('one');
  });

  it('has ALL = "all"', () => {
    expect(RepeatMode.ALL).toBe('all');
  });
});
