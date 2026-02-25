export enum RatingValue {
  LOVE = 'love',
  DISLIKE = 'dislike',
}

export enum RatingResourceType {
  SONG = 'song',
  ALBUM = 'album',
  PLAYLIST = 'playlist',
}

export type RatingResult = 'love' | 'dislike' | 'none';
