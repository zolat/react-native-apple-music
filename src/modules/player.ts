import type { EmitterSubscription } from 'react-native';
// eslint-disable-next-line import/named
import { NativeEventEmitter, NativeModules } from 'react-native';
import type { MusicItem } from '../types/music-item';
import type { IPlaybackState } from '../types/playback-state';
import type { IQueueResponse, ShuffleMode, RepeatMode } from '../types/queue';
import { QueueInsertionPosition } from '../types/queue';
import type { ISong } from '../types/song';

const { MusicModule } = NativeModules;

export interface IPlayerConfig {
  mixWithOthers: boolean;
}

interface IPlaybackTimeUpdate {
  playbackTime: number;
}

interface IPlayerEvents {
  onPlaybackStateChange: IPlaybackState;
  onCurrentSongChange: ISong;
  onPlaybackTimeUpdate: IPlaybackTimeUpdate;
  onQueueChange: IQueueResponse;
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const nativeEventEmitter = new NativeEventEmitter(MusicModule);

class Player {
  /**
   * Skips to the next entry in the playback queue.
   */
  public static skipToNextEntry(): void {
    MusicModule.skipToNextEntry();
  }

  /**
   * Skips to the previous entry in the playback queue.
   */
  public static skipToPreviousEntry(): void {
    MusicModule.skipToPreviousEntry();
  }

  /**
   * Restarts the current entry from the beginning.
   */
  public static restartCurrentEntry(): void {
    MusicModule.restartCurrentEntry();
  }

  /**
   * Seeks to a specific time in the current track.
   * @param {number} time - The time in seconds to seek to.
   */
  public static seekToTime(time: number): void {
    MusicModule.seekToTime(time);
  }

  /**
   * Toggles the playback state between play and pause.
   */
  public static togglePlayerState(): void {
    MusicModule.togglePlayerState();
  }

  /**
   * Starts playback of the current song.
   */
  public static play(): void {
    MusicModule.play();
  }

  /**
   * Pauses playback of the current song.
   */
  public static pause(): void {
    MusicModule.pause();
  }

  /**
   * Retrieves the current playback state from the native music player.
   * This function returns a promise that resolves to the current playback state.
   * @returns {Promise<IPlaybackState>} A promise that resolves to the current playback state of the music player.
   */
  public static async getCurrentState(): Promise<IPlaybackState> {
    try {
      return await MusicModule.getCurrentState();
    } catch (error) {
      console.error('Apple Music Kit: getCurrentState failed.', error);
      throw error;
    }
  }

  /**
   * Method to add a listener for an event.
   * @param eventType - Type of the event to listen for.
   * @param listener - Function to execute when the event is emitted.
   * @returns An EmitterSubscription which can be used to remove the listener.
   */
  public static addListener(
    eventType: keyof IPlayerEvents,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (eventData: any) => void,
  ): EmitterSubscription {
    return nativeEventEmitter.addListener(eventType, listener);
  }

  /**
   * Method to remove all listeners of event.
   * @param eventType - Type of the event to remove listener for.
   */
  public static removeAllListeners(eventType: keyof IPlayerEvents): void {
    return nativeEventEmitter.removeAllListeners(eventType);
  }

  /**
   * Configures the audio session behavior for mixing with other audio sources.
   * @param {boolean} mixWithOthers - If true, allows mixing with other audio sources (like react-native-track-player).
   *                                  When true, uses .mixWithOthers and .duckOthers options.
   * @returns {Promise<IPlayerConfig>} The applied configuration
   */
  public static async configurePlayer(mixWithOthers = false): Promise<IPlayerConfig> {
    return MusicModule.configurePlayer(mixWithOthers);
  }

  // MARK: - Queue Manipulation

  /**
   * Retrieves the current playback queue entries.
   * @returns {Promise<IQueueResponse>} The current queue entries and current entry ID.
   */
  public static async getQueue(): Promise<IQueueResponse> {
    try {
      return await MusicModule.getQueue();
    } catch (error) {
      console.error('Apple Music Kit: getQueue failed.', error);
      return { entries: [] };
    }
  }

  /**
   * Inserts an item into the playback queue at the specified position.
   * @param {string} itemId - The catalog or library ID of the item.
   * @param {MusicItem} type - The type of item (song, album, playlist, station).
   * @param {QueueInsertionPosition} position - Where to insert ('next' or 'later').
   * @returns {Promise<void>}
   */
  public static async insertIntoQueue(
    itemId: string,
    type: MusicItem,
    position: QueueInsertionPosition = QueueInsertionPosition.NEXT,
  ): Promise<void> {
    try {
      await MusicModule.insertIntoQueue(itemId, type, position);
    } catch (error) {
      console.error('Apple Music Kit: insertIntoQueue failed.', error);
      throw error;
    }
  }

  /**
   * Removes a specific entry from the playback queue by index.
   * @param {number} index - The zero-based index of the entry to remove.
   * @returns {Promise<void>}
   */
  public static async removeQueueEntry(index: number): Promise<void> {
    try {
      await MusicModule.removeQueueEntry(index);
    } catch (error) {
      console.error('Apple Music Kit: removeQueueEntry failed.', error);
      throw error;
    }
  }

  /**
   * Removes all entries from the playback queue.
   * @returns {Promise<void>}
   */
  public static async clearQueue(): Promise<void> {
    try {
      await MusicModule.clearQueue();
    } catch (error) {
      console.error('Apple Music Kit: clearQueue failed.', error);
      throw error;
    }
  }

  // MARK: - Shuffle & Repeat

  /**
   * Gets the current shuffle mode.
   * @returns {Promise<ShuffleMode>} The current shuffle mode ('off' or 'songs').
   */
  public static async getShuffleMode(): Promise<ShuffleMode> {
    try {
      return (await MusicModule.getShuffleMode()) as ShuffleMode;
    } catch (error) {
      console.error('Apple Music Kit: getShuffleMode failed.', error);
      throw error;
    }
  }

  /**
   * Sets the shuffle mode.
   * @param {ShuffleMode} mode - The shuffle mode to set ('off' or 'songs').
   * @returns {Promise<void>}
   */
  public static async setShuffleMode(mode: ShuffleMode): Promise<void> {
    try {
      await MusicModule.setShuffleMode(mode);
    } catch (error) {
      console.error('Apple Music Kit: setShuffleMode failed.', error);
      throw error;
    }
  }

  /**
   * Gets the current repeat mode.
   * @returns {Promise<RepeatMode>} The current repeat mode ('none', 'one', or 'all').
   */
  public static async getRepeatMode(): Promise<RepeatMode> {
    try {
      return (await MusicModule.getRepeatMode()) as RepeatMode;
    } catch (error) {
      console.error('Apple Music Kit: getRepeatMode failed.', error);
      throw error;
    }
  }

  /**
   * Sets the repeat mode.
   * @param {RepeatMode} mode - The repeat mode to set ('none', 'one', or 'all').
   * @returns {Promise<void>}
   */
  public static async setRepeatMode(mode: RepeatMode): Promise<void> {
    try {
      await MusicModule.setRepeatMode(mode);
    } catch (error) {
      console.error('Apple Music Kit: setRepeatMode failed.', error);
      throw error;
    }
  }
}

export default Player;
