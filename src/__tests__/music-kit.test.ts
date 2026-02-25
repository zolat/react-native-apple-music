/* eslint-disable @typescript-eslint/no-explicit-any */
import { CatalogSearchType } from '../types/catalog-search';
import { MusicItem } from '../types/music-item';

const mockMusicModule = (global as any).__mockMusicModule as Record<string, jest.Mock>;

import MusicKit from '../modules/music-kit';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('MusicKit - catalogSearch', () => {
  it('passes search term, types, and options to native', async () => {
    const mockResult = { songs: [{ id: '1', title: 'Song' }], albums: [] };
    mockMusicModule.catalogSearch.mockResolvedValue(mockResult);

    const result = await MusicKit.catalogSearch('test', [CatalogSearchType.SONGS], { limit: 10 });
    expect(mockMusicModule.catalogSearch).toHaveBeenCalledWith('test', [CatalogSearchType.SONGS], { limit: 10 });
    expect(result).toEqual(mockResult);
  });

  it('returns empty result on error', async () => {
    mockMusicModule.catalogSearch.mockRejectedValue(new Error('fail'));
    const result = await MusicKit.catalogSearch('test', [CatalogSearchType.SONGS]);
    expect(result).toEqual({ songs: [], albums: [] });
  });
});

describe('MusicKit - setPlaybackQueue', () => {
  it('calls native with itemId and type', async () => {
    mockMusicModule.setPlaybackQueue.mockResolvedValue('ok');
    await MusicKit.setPlaybackQueue('12345', MusicItem.SONG);
    expect(mockMusicModule.setPlaybackQueue).toHaveBeenCalledWith('12345', 'song');
  });
});

describe('MusicKit - Library Access', () => {
  it('getTracksFromLibrary resolves with tracks', async () => {
    const mockTracks = { recentlyPlayedItems: [{ id: 'r1', title: 'Recent' }] };
    mockMusicModule.getTracksFromLibrary.mockResolvedValue(mockTracks);

    const result = await MusicKit.getTracksFromLibrary();
    expect(result).toEqual(mockTracks);
  });

  it('getTracksFromLibrary returns empty on error', async () => {
    mockMusicModule.getTracksFromLibrary.mockRejectedValue(new Error('fail'));
    const result = await MusicKit.getTracksFromLibrary();
    expect(result).toEqual({ recentlyPlayedItems: [] });
  });

  it('getUserPlaylists passes options', async () => {
    const mockPlaylists = { playlists: [{ id: 'p1', name: 'My Playlist' }] };
    mockMusicModule.getUserPlaylists.mockResolvedValue(mockPlaylists);

    const result = await MusicKit.getUserPlaylists({ limit: 5, offset: 0 });
    expect(mockMusicModule.getUserPlaylists).toHaveBeenCalledWith({ limit: 5, offset: 0 });
    expect(result).toEqual(mockPlaylists);
  });

  it('getUserPlaylists sends empty object when no options', async () => {
    mockMusicModule.getUserPlaylists.mockResolvedValue({ playlists: [] });
    await MusicKit.getUserPlaylists();
    expect(mockMusicModule.getUserPlaylists).toHaveBeenCalledWith({});
  });

  it('getLibrarySongs passes options', async () => {
    const mockSongs = { songs: [{ id: 's1', title: 'Song' }] };
    mockMusicModule.getLibrarySongs.mockResolvedValue(mockSongs);

    const result = await MusicKit.getLibrarySongs({ limit: 25 });
    expect(mockMusicModule.getLibrarySongs).toHaveBeenCalledWith({ limit: 25 });
    expect(result).toEqual(mockSongs);
  });

  it('getPlaylistSongs passes playlistId and options', async () => {
    const mockSongs = { songs: [{ id: 's1', title: 'Track 1' }] };
    mockMusicModule.getPlaylistSongs.mockResolvedValue(mockSongs);

    const result = await MusicKit.getPlaylistSongs('p.123', { limit: 10 });
    expect(mockMusicModule.getPlaylistSongs).toHaveBeenCalledWith('p.123', { limit: 10 });
    expect(result).toEqual(mockSongs);
  });

  it('playLibrarySong passes songId', async () => {
    mockMusicModule.playLibrarySong.mockResolvedValue('ok');
    await MusicKit.playLibrarySong('l.12345');
    expect(mockMusicModule.playLibrarySong).toHaveBeenCalledWith('l.12345');
  });

  it('playLibraryPlaylist passes playlistId and startingAt', async () => {
    mockMusicModule.playLibraryPlaylist.mockResolvedValue('ok');
    await MusicKit.playLibraryPlaylist('p.abc', 3);
    expect(mockMusicModule.playLibraryPlaylist).toHaveBeenCalledWith('p.abc', 3);
  });

  it('playLibraryPlaylist defaults startingAt to -1', async () => {
    mockMusicModule.playLibraryPlaylist.mockResolvedValue('ok');
    await MusicKit.playLibraryPlaylist('p.abc');
    expect(mockMusicModule.playLibraryPlaylist).toHaveBeenCalledWith('p.abc', -1);
  });
});
