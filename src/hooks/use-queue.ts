import { useEffect, useState } from 'react';
import Player from '../modules/player';
import type { IQueueEntry, IQueueResponse } from '../types/queue';

/**
 * A hook to track the current playback queue from Apple Music.
 * Listens for queue changes from the native music player and updates state.
 */
const useQueue = (): { entries: IQueueEntry[]; currentEntryId?: string; error?: Error } => {
  const [entries, setEntries] = useState<IQueueEntry[]>([]);
  const [currentEntryId, setCurrentEntryId] = useState<string>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    Player.getQueue()
      .then((response) => {
        setEntries(response.entries);
        setCurrentEntryId(response.currentEntryId);
      })
      .catch(setError);

    const listener = Player.addListener('onQueueChange', (data: IQueueResponse) => {
      setError(undefined);
      setEntries(data?.entries ?? []);
      setCurrentEntryId(data?.currentEntryId);
    });

    return () => listener.remove();
  }, []);

  return { entries, currentEntryId, error };
};

export default useQueue;
