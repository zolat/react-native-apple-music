import { QueueInsertionPosition, ShuffleMode, RepeatMode } from '../types/queue';
import { RatingValue, RatingResourceType } from '../types/rating';

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

describe('RatingValue', () => {
  it('has LOVE = "love"', () => {
    expect(RatingValue.LOVE).toBe('love');
  });

  it('has DISLIKE = "dislike"', () => {
    expect(RatingValue.DISLIKE).toBe('dislike');
  });
});

describe('RatingResourceType', () => {
  it('has SONG = "song"', () => {
    expect(RatingResourceType.SONG).toBe('song');
  });

  it('has ALBUM = "album"', () => {
    expect(RatingResourceType.ALBUM).toBe('album');
  });

  it('has PLAYLIST = "playlist"', () => {
    expect(RatingResourceType.PLAYLIST).toBe('playlist');
  });
});
