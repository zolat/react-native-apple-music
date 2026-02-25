export interface IQueueEntry {
  id: string;
  title: string;
  subtitle: string;
  artworkUrl: string;
  isTransient: boolean;
  itemId?: string;
  type?: 'song' | 'musicVideo' | 'unknown';
}

export interface IQueueResponse {
  entries: IQueueEntry[];
  currentEntryId?: string;
}

export enum QueueInsertionPosition {
  NEXT = 'next',
  LATER = 'later',
}

export enum ShuffleMode {
  OFF = 'off',
  SONGS = 'songs',
}

export enum RepeatMode {
  NONE = 'none',
  ONE = 'one',
  ALL = 'all',
}
