package org.devtiro.chatex.events;

import java.util.UUID;

import org.devtiro.chatex.domain.entities.User;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class UserInteractionEvent {

  private final User targetUser;
  private final UUID viewerId;

}
