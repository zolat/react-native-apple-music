// RatingService.swift
// Manages Apple Music personal ratings (love/dislike) via MusicDataRequest.

import Foundation
import MusicKit

@available(iOS 15.0, *)
final class RatingService {

  // MARK: - Types

  enum Rating: String {
    case love
    case dislike
  }

  enum RatingResourceType: String {
    case song
    case album
    case playlist
  }

  // MARK: - Public API

  /// Gets the user's rating for a specific item.
  /// Returns "love", "dislike", or "none".
  func getRating(itemId: String, type: String) async throws -> String {
    guard let resourceType = RatingResourceType(rawValue: type) else {
      throw RatingServiceError.unknownResourceType(type)
    }

    let isLibrary = QueueService.isLibraryId(itemId)
    let path = buildPath(for: resourceType, itemId: itemId, isLibrary: isLibrary)
    let url = try buildURL(path: path)

    var request = URLRequest(url: url)
    request.httpMethod = "GET"

    let dataRequest = MusicDataRequest(urlRequest: request)
    let response = try await dataRequest.response()

    guard response.urlResponse.statusCode == 200 else {
      // 404 means no rating exists
      if response.urlResponse.statusCode == 404 {
        return "none"
      }
      throw RatingServiceError.httpError(response.urlResponse.statusCode)
    }

    return parseRatingValue(from: response.data)
  }

  /// Sets a rating (love or dislike) on a specific item.
  func addRating(itemId: String, type: String, rating: String) async throws {
    guard let resourceType = RatingResourceType(rawValue: type) else {
      throw RatingServiceError.unknownResourceType(type)
    }
    guard let ratingValue = Rating(rawValue: rating) else {
      throw RatingServiceError.unknownRating(rating)
    }

    let isLibrary = QueueService.isLibraryId(itemId)
    let path = buildPath(for: resourceType, itemId: itemId, isLibrary: isLibrary)
    let url = try buildURL(path: path)

    var request = URLRequest(url: url)
    request.httpMethod = "PUT"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")

    let value: Int = ratingValue == .love ? 1 : -1
    let body: [String: Any] = [
      "type": "rating",
      "attributes": ["value": value],
    ]
    request.httpBody = try JSONSerialization.data(withJSONObject: body)

    let dataRequest = MusicDataRequest(urlRequest: request)
    let response = try await dataRequest.response()

    let statusCode = response.urlResponse.statusCode
    guard statusCode == 200 || statusCode == 204 else {
      throw RatingServiceError.httpError(statusCode)
    }
  }

  /// Removes the user's rating from a specific item.
  func removeRating(itemId: String, type: String) async throws {
    guard let resourceType = RatingResourceType(rawValue: type) else {
      throw RatingServiceError.unknownResourceType(type)
    }

    let isLibrary = QueueService.isLibraryId(itemId)
    let path = buildPath(for: resourceType, itemId: itemId, isLibrary: isLibrary)
    let url = try buildURL(path: path)

    var request = URLRequest(url: url)
    request.httpMethod = "DELETE"

    let dataRequest = MusicDataRequest(urlRequest: request)
    let response = try await dataRequest.response()

    let statusCode = response.urlResponse.statusCode
    guard statusCode == 200 || statusCode == 204 || statusCode == 404 else {
      throw RatingServiceError.httpError(statusCode)
    }
  }

  // MARK: - Private Helpers

  private static let baseURL = "https://api.music.apple.com"

  private func buildPath(for type: RatingResourceType, itemId: String, isLibrary: Bool) -> String {
    let resourceName: String
    switch type {
    case .song:
      resourceName = isLibrary ? "library-songs" : "songs"
    case .album:
      resourceName = isLibrary ? "library-albums" : "albums"
    case .playlist:
      resourceName = isLibrary ? "library-playlists" : "playlists"
    }
    return "/v1/me/ratings/\(resourceName)/\(itemId)"
  }

  private func buildURL(path: String) throws -> URL {
    guard let url = URL(string: "\(Self.baseURL)\(path)") else {
      throw RatingServiceError.invalidURL(path)
    }
    return url
  }

  private func parseRatingValue(from data: Data) -> String {
    guard let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
          let dataArray = json["data"] as? [[String: Any]],
          let first = dataArray.first,
          let attributes = first["attributes"] as? [String: Any],
          let value = attributes["value"] as? Int
    else {
      return "none"
    }

    switch value {
    case 1: return "love"
    case -1: return "dislike"
    default: return "none"
    }
  }
}

// MARK: - Errors

enum RatingServiceError: LocalizedError {
  case unknownResourceType(String)
  case unknownRating(String)
  case invalidURL(String)
  case httpError(Int)

  var errorDescription: String? {
    switch self {
    case .unknownResourceType(let type):
      return "Unknown rating resource type: \(type). Expected 'song', 'album', or 'playlist'"
    case .unknownRating(let rating):
      return "Unknown rating value: \(rating). Expected 'love' or 'dislike'"
    case .invalidURL(let path):
      return "Failed to construct URL for path: \(path)"
    case .httpError(let code):
      return "Rating request failed with HTTP status \(code)"
    }
  }
}
