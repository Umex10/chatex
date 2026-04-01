package org.devtiro.chatex.events;

import java.util.UUID;

import org.devtiro.chatex.domain.entities.User;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Event object representing a user interaction (like a profile view).
 * Used internally to trigger side effects such as updating recently viewed lists.
 */
@Getter
@RequiredArgsConstructor
public class UserInteractionEvent {

  private final User targetUser;
  private final UUID viewerId;

}
