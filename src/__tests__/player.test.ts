/* eslint-disable @typescript-eslint/no-explicit-any */
import { MusicItem } from '../types/music-item';
import { QueueInsertionPosition, ShuffleMode, RepeatMode } from '../types/queue';

// Access the mock set up in setup.ts
const mockMusicModule = (global as any).__mockMusicModule as Record<string, jest.Mock>;

// Import Player after the mock is in place
import Player from '../modules/player';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Player - Playback Controls', () => {
  it('play() calls MusicModule.play', () => {
    Player.play();
    expect(mockMusicModule.play).toHaveBeenCalledTimes(1);
  });

  it('pause() calls MusicModule.pause', () => {
    Player.pause();
    expect(mockMusicModule.pause).toHaveBeenCalledTimes(1);
  });

  it('togglePlayerState() calls MusicModule.togglePlayerState', () => {
    Player.togglePlayerState();
    expect(mockMusicModule.togglePlayerState).toHaveBeenCalledTimes(1);
  });

  it('skipToNextEntry() calls MusicModule.skipToNextEntry', () => {
    Player.skipToNextEntry();
    expect(mockMusicModule.skipToNextEntry).toHaveBeenCalledTimes(1);
  });

  it('skipToPreviousEntry() calls MusicModule.skipToPreviousEntry', () => {
    Player.skipToPreviousEntry();
    expect(mockMusicModule.skipToPreviousEntry).toHaveBeenCalledTimes(1);
  });

  it('restartCurrentEntry() calls MusicModule.restartCurrentEntry', () => {
    Player.restartCurrentEntry();
    expect(mockMusicModule.restartCurrentEntry).toHaveBeenCalledTimes(1);
  });

  it('seekToTime() calls MusicModule.seekToTime with time', () => {
    Player.seekToTime(42.5);
    expect(mockMusicModule.seekToTime).toHaveBeenCalledWith(42.5);
  });
});

describe('Player - getCurrentState', () => {
  it('resolves with the state from native module', async () => {
    const mockState = {
      playbackStatus: 'playing',
      playbackRate: 1.0,
      playbackTime: 30.5,
      currentSong: { id: '123', title: 'Test Song' },
    };
    mockMusicModule.getCurrentState.mockResolvedValue(mockState);

    const result = await Player.getCurrentState();
    expect(result).toEqual(mockState);
  });

  it('throws on native error', async () => {
    mockMusicModule.getCurrentState.mockRejectedValue(new Error('Native error'));
    await expect(Player.getCurrentState()).rejects.toThrow('Native error');
  });
});

describe('Player - Queue Manipulation', () => {
  it('getQueue() resolves with queue entries', async () => {
    const mockQueue = {
      entries: [
        { id: 'e1', title: 'Song 1', subtitle: 'Artist 1', artworkUrl: '', isTransient: false },
      ],
      currentEntryId: 'e1',
    };
    mockMusicModule.getQueue.mockResolvedValue(mockQueue);

    const result = await Player.getQueue();
    expect(result).toEqual(mockQueue);
    expect(mockMusicModule.getQueue).toHaveBeenCalledTimes(1);
  });

  it('getQueue() returns empty entries on error', async () => {
    mockMusicModule.getQueue.mockRejectedValue(new Error('fail'));
    const result = await Player.getQueue();
    expect(result).toEqual({ entries: [] });
  });

  it('insertIntoQueue() calls native with correct args', async () => {
    mockMusicModule.insertIntoQueue.mockResolvedValue('ok');

    await Player.insertIntoQueue('12345', MusicItem.SONG, QueueInsertionPosition.NEXT);
    expect(mockMusicModule.insertIntoQueue).toHaveBeenCalledWith('12345', 'song', 'next');
  });

  it('insertIntoQueue() defaults position to NEXT', async () => {
    mockMusicModule.insertIntoQueue.mockResolvedValue('ok');

    await Player.insertIntoQueue('12345', MusicItem.ALBUM);
    expect(mockMusicModule.insertIntoQueue).toHaveBeenCalledWith('12345', 'album', 'next');
  });

  it('insertIntoQueue() supports LATER position', async () => {
    mockMusicModule.insertIntoQueue.mockResolvedValue('ok');

    await Player.insertIntoQueue('pl.123', MusicItem.PLAYLIST, QueueInsertionPosition.LATER);
    expect(mockMusicModule.insertIntoQueue).toHaveBeenCalledWith('pl.123', 'playlist', 'later');
  });

  it('insertIntoQueue() throws on native error', async () => {
    mockMusicModule.insertIntoQueue.mockRejectedValue(new Error('Not found'));
    await expect(
      Player.insertIntoQueue('bad', MusicItem.SONG),
    ).rejects.toThrow('Not found');
  });

  it('removeQueueEntry() calls native with index', async () => {
    mockMusicModule.removeQueueEntry.mockResolvedValue('ok');

    await Player.removeQueueEntry(2);
    expect(mockMusicModule.removeQueueEntry).toHaveBeenCalledWith(2);
  });

  it('removeQueueEntry() throws on out of bounds', async () => {
    mockMusicModule.removeQueueEntry.mockRejectedValue(new Error('Index out of bounds'));
    await expect(Player.removeQueueEntry(99)).rejects.toThrow('Index out of bounds');
  });

  it('clearQueue() calls native clearQueue', async () => {
    mockMusicModule.clearQueue.mockResolvedValue('ok');

    await Player.clearQueue();
    expect(mockMusicModule.clearQueue).toHaveBeenCalledTimes(1);
  });
});

describe('Player - Shuffle Mode', () => {
  it('getShuffleMode() returns current mode', async () => {
    mockMusicModule.getShuffleMode.mockResolvedValue('off');
    const mode = await Player.getShuffleMode();
    expect(mode).toBe('off');
  });

  it('setShuffleMode() calls native with mode string', async () => {
    mockMusicModule.setShuffleMode.mockResolvedValue('songs');
    await Player.setShuffleMode(ShuffleMode.SONGS);
    expect(mockMusicModule.setShuffleMode).toHaveBeenCalledWith('songs');
  });

  it('getShuffleMode() throws on native error', async () => {
    mockMusicModule.getShuffleMode.mockRejectedValue(new Error('fail'));
    await expect(Player.getShuffleMode()).rejects.toThrow('fail');
  });
});

describe('Player - Repeat Mode', () => {
  it('getRepeatMode() returns current mode', async () => {
    mockMusicModule.getRepeatMode.mockResolvedValue('all');
    const mode = await Player.getRepeatMode();
    expect(mode).toBe('all');
  });

  it('setRepeatMode() calls native with mode string', async () => {
    mockMusicModule.setRepeatMode.mockResolvedValue('one');
    await Player.setRepeatMode(RepeatMode.ONE);
    expect(mockMusicModule.setRepeatMode).toHaveBeenCalledWith('one');
  });

  it('setRepeatMode(NONE) sends "none"', async () => {
    mockMusicModule.setRepeatMode.mockResolvedValue('none');
    await Player.setRepeatMode(RepeatMode.NONE);
    expect(mockMusicModule.setRepeatMode).toHaveBeenCalledWith('none');
  });
});

describe('Player - configurePlayer', () => {
  it('calls native with mixWithOthers flag', async () => {
    mockMusicModule.configurePlayer.mockResolvedValue({ mixWithOthers: true });
    const result = await Player.configurePlayer(true);
    expect(mockMusicModule.configurePlayer).toHaveBeenCalledWith(true);
    expect(result).toEqual({ mixWithOthers: true });
  });

  it('defaults mixWithOthers to false', async () => {
    mockMusicModule.configurePlayer.mockResolvedValue({ mixWithOthers: false });
    await Player.configurePlayer();
    expect(mockMusicModule.configurePlayer).toHaveBeenCalledWith(false);
  });
});
