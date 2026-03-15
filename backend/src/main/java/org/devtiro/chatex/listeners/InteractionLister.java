package org.devtiro.chatex.listeners;

import java.util.UUID;

import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.events.UserInteractionEvent;
import org.devtiro.chatex.services.UserService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class InteractionLister {

  private final UserService userService;

  @EventListener
  public void handleUserInteraction(UserInteractionEvent event) {

    User targetUser = event.getTargetUser();
    UUID viewerId = event.getViewerId();

    if (targetUser == null || viewerId == null || targetUser.getId().equals(viewerId)) {
      return;
    }

    userService.addUserToRecentlyViewedUsersList(
        targetUser,
        viewerId);

    System.out.println("Listener: Interaktion for user " + event.getTargetUser().getUsername() + " conducted!");
  }

}
