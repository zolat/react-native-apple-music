// MusicItemMapper.swift

import Foundation
import MusicKit

@available(iOS 15.0, *)
enum MusicItemMapper {

  // MARK: - Song

  static func map(_ song: Song) -> [String: Any] {
    [
      "id": String(describing: song.id),
      "title": song.title,
      "artistName": song.artistName,
      "artworkUrl": extractArtworkURL(song.artwork),
      "duration": String(song.duration ?? 0),
    ]
  }

  // MARK: - Album

  static func map(_ album: Album) -> [String: Any] {
    [
      "id": String(describing: album.id),
      "title": album.title,
      "artistName": album.artistName,
      "artworkUrl": extractArtworkURL(album.artwork),
      "trackCount": String(album.trackCount),
    ]
  }

  // MARK: - Playlist

  static func map(_ playlist: Playlist) -> [String: Any] {
    [
      "id": String(describing: playlist.id),
      "name": playlist.name,
      "description": playlist.standardDescription ?? "",
      "artworkUrl": extractArtworkURL(playlist.artwork),
      "trackCount": playlist.tracks?.count ?? 0,
    ]
  }

  // MARK: - Music Video (iOS 16+)

  @available(iOS 16.0, *)
  static func map(_ musicVideo: MusicVideo) -> [String: Any] {
    [
      "id": String(describing: musicVideo.id),
      "title": musicVideo.title,
      "artistName": musicVideo.artistName,
      "artworkUrl": extractArtworkURL(musicVideo.artwork),
      "duration": musicVideo.duration ?? 0,
    ]
  }

  // MARK: - Recently Played Items (iOS 16+)

  @available(iOS 16.0, *)
  static func map(_ item: RecentlyPlayedMusicItem) -> [String: Any] {
    var result: [String: Any] = [
      "id": String(describing: item.id),
      "title": item.title,
      "subtitle": String(describing: item.subtitle ?? ""),
    ]

    switch item {
    case .album:
      result["type"] = "album"
    case .playlist:
      result["type"] = "playlist"
    case .station:
      result["type"] = "station"
    default:
      result["type"] = "unknown"
    }

    return result
  }

  // MARK: - Queue Entry

  static func mapQueueEntry(_ entry: ApplicationMusicPlayer.Queue.Entry) -> [String: Any] {
    var result: [String: Any] = [
      "id": String(describing: entry.id),
      "title": entry.title,
      "subtitle": entry.subtitle ?? "",
      "artworkUrl": extractArtworkURL(entry.artwork),
      "isTransient": entry.isTransient,
    ]

    if let item = entry.item {
      switch item {
      case .song(let song):
        result["itemId"] = String(describing: song.id)
        result["type"] = "song"
      case .musicVideo(let musicVideo):
        result["itemId"] = String(describing: musicVideo.id)
        result["type"] = "musicVideo"
      @unknown default:
        result["type"] = "unknown"
      }
    }

    return result
  }

  // MARK: - Shuffle Mode

  static func describeShuffleMode(_ mode: MusicPlayer.ShuffleMode?) -> String {
    switch mode {
    case .off, .none:
      return "off"
    case .songs:
      return "songs"
    @unknown default:
      return "off"
    }
  }

  static func parseShuffleMode(_ string: String) -> MusicPlayer.ShuffleMode {
    switch string {
    case "songs": return .songs
    default: return .off
    }
  }

  // MARK: - Repeat Mode

  static func describeRepeatMode(_ mode: MusicPlayer.RepeatMode?) -> String {
    switch mode {
    case .none:
      return "none"
    case .one:
      return "one"
    case .all:
      return "all"
    @unknown default:
      return "none"
    }
  }

  static func parseRepeatMode(_ string: String) -> MusicPlayer.RepeatMode {
    switch string {
    case "one": return .one
    case "all": return .all
    default: return MusicPlayer.RepeatMode.none
    }
  }

  // MARK: - Playback Status

  static func describePlaybackStatus(_ status: MusicPlayer.PlaybackStatus) -> String {
    switch status {
    case .playing: return "playing"
    case .paused: return "paused"
    case .stopped: return "stopped"
    case .interrupted: return "interrupted"
    case .seekingForward: return "seekingForward"
    case .seekingBackward: return "seekingBackward"
    @unknown default: return "unknown"
    }
  }

  // MARK: - Private Helpers

  private static func extractArtworkURL(_ artwork: Artwork?, width: Int = 200, height: Int = 200) -> String {
    guard let artwork = artwork,
          let url = artwork.url(width: width, height: height),
          url.scheme == "https" || url.scheme == "http"
    else {
      return ""
    }
    return url.absoluteString
  }
}
