package org.devtiro.chatex.services;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.CreateShoutRequest;
import org.devtiro.chatex.domain.entities.Shout;
import org.devtiro.chatex.domain.entities.User;

/**
 * Service interface for shout (post) management operations.
 * Provides methods for creating, retrieving, deleting shouts and handling
 * user engagement actions (likes and re-shouts).
 */
public interface ShoutService {

  /**
   * Retrieves all shouts for the given username, ordered by creation date
   * descending.
   *
   * @return a list of Shout entities
   */
  List<Shout> getShouts(String username);

  /**
   * Retrieves a single shout by its unique identifier.
   *
   * @return the Shout entity
   */
  Shout getShout(UUID shoutId);

  /**
   * Creates a new shout on behalf of the user identified by the given ID.
   *
   * @return the persisted Shout entity
   */
  Shout createShout(UUID userId, CreateShoutRequest createShoutRequest);

  /**
   * Creates a new shout (Comment) on behalf of the user identified by the given
   * ID.
   *
   * @return the persisted Shout (Comment) entity
   */
  Shout createComment(UUID userId, UUID mainShoutId, CreateShoutRequest createShoutRequest);

  /**
   * Creates a new shout (UnComment) on behalf of the user identified by the given
   * ID.
   *
   * @return the persisted Shout (UnComment) entity
   */
  void unComment(UUID shoutId);

  

  /**
   * Returns the set of users who liked the given shout.
   *
   * @return a Set of User entities
   */
  Set<User> getLikedBy(UUID shoutId);

  /**
   * Returns the set of users who re-shouted the given shout.
   *
   * @return a Set of User entities
   */
  Set<User> getReShoutedBy(UUID shoutId);

  /**
   * Deletes the shout identified by the given ID.
   */
  void deleteShout(UUID shoutId);

  /**
   * Adds a like from the given user to the given shout.
   */
  void likeTheShout(UUID shoutId, UUID userId);

  /**
   * Removes a like from the given user on the given shout.
   */
  void dislikeTheShout(UUID shoutId, UUID userId);

  /**
   * Adds a re-shout from the given user to the given shout.
   */
  void reShoutTheShout(UUID shoutId, UUID userId);

  /**
   * Removes a re-shout from the given user on the given shout.
   */
  void unShoutTheShout(UUID shoutId, UUID userId);

  /**
   * Checks whether the given user has liked the given shout.
   *
   * @return {@code true} if the user liked the shout, {@code false} otherwise
   */
  boolean isUserLikingTheShout(UUID shoutId, UUID userId);

  /**
   * Checks whether the given user has re-shouted the given shout.
   *
   * @return {@code true} if the user re-shouted the shout, {@code false}
   *         otherwise
   */
  boolean isUserReShoutingTheShout(UUID shoutId, UUID userId);

}
