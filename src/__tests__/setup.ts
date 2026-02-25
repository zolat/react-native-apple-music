/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock react-native NativeModules and NativeEventEmitter for unit tests

const mockMusicModule: Record<string, jest.Mock> = {
  // Auth
  authorization: jest.fn(),
  checkSubscription: jest.fn(),
  // Player
  play: jest.fn(),
  pause: jest.fn(),
  togglePlayerState: jest.fn(),
  skipToNextEntry: jest.fn(),
  skipToPreviousEntry: jest.fn(),
  restartCurrentEntry: jest.fn(),
  seekToTime: jest.fn(),
  getCurrentState: jest.fn(),
  configurePlayer: jest.fn(),
  // Queue
  setPlaybackQueue: jest.fn(),
  getQueue: jest.fn(),
  insertIntoQueue: jest.fn(),
  removeQueueEntry: jest.fn(),
  clearQueue: jest.fn(),
  // Shuffle & Repeat
  getShuffleMode: jest.fn(),
  setShuffleMode: jest.fn(),
  getRepeatMode: jest.fn(),
  setRepeatMode: jest.fn(),
  // Ratings
  getRating: jest.fn(),
  addRating: jest.fn(),
  removeRating: jest.fn(),
  // Catalog
  catalogSearch: jest.fn(),
  // Library
  getTracksFromLibrary: jest.fn(),
  getUserPlaylists: jest.fn(),
  getLibrarySongs: jest.fn(),
  getPlaylistSongs: jest.fn(),
  playLibrarySong: jest.fn(),
  playLibraryPlaylist: jest.fn(),
  // Event emitter
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};

jest.mock('react-native', () => ({
  NativeModules: {
    MusicModule: mockMusicModule,
  },
  NativeEventEmitter: jest.fn().mockImplementation(() => ({
    addListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
    removeAllListeners: jest.fn(),
  })),
}));

// Make the mock accessible to tests
(global as any).__mockMusicModule = mockMusicModule;
