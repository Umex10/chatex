package org.devtiro.chatex.services;

import java.util.List;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.CreateShoutRequest;
import org.devtiro.chatex.domain.entities.Shout;

public interface ShoutService {

  List<Shout> getShouts();

  Shout createShout(UUID userId, CreateShoutRequest createShoutRequest);

  void deleteShout(UUID shoutId);

  void likeTheShout(UUID shoutId);

  void reShoutTheShout(UUID shoutId);
  
}
