package org.devtiro.chatex.services;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.CreateShoutRequest;
import org.devtiro.chatex.domain.entities.Shout;
import org.devtiro.chatex.domain.entities.User;

public interface ShoutService {

  List<Shout> getShouts(String username);

  Shout getShout(UUID shoutId);

  Shout createShout(UUID userId, CreateShoutRequest createShoutRequest);

  Set<User> getLikedBy(UUID shoutId);

  Set<User> getReShoutedBy(UUID shoutId);

  void deleteShout(UUID shoutId);

  void likeTheShout(UUID shoutId, UUID userId);

  void dislikeTheShout(UUID shoutId, UUID userId);

  void reShoutTheShout(UUID shoutId, UUID userId);

  void unShoutTheShout(UUID shoutId, UUID userId);

  boolean isUserLikingTheShout(UUID shoutId, UUID userId);

  boolean isUserReShoutingTheShout(UUID shoutId, UUID userId);

}
