package org.devtiro.chatex.services.ipl;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.CreateShoutRequest;
import org.devtiro.chatex.domain.entities.Shout;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.reps.ShoutRep;
import org.devtiro.chatex.reps.UserRep;
import org.devtiro.chatex.services.ShoutService;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

/**
 * Implementation of the ShoutService interface.
 * Handles shout CRUD operations and user engagement actions (likes, re-shouts)
 * using the Shout and User repositories.
 */
@Service
@RequiredArgsConstructor
public class ShoutServiceIpl implements ShoutService {

  private final ShoutRep shoutRep;
  private final UserRep userRep;

  /** {@inheritDoc} */
  @Override
  public Shout getShout(UUID shoutId) {
    return shoutRep.findById(shoutId).orElseThrow(
      () -> new EntityNotFoundException("The shout with the shoutId: " + shoutId + 
        " was not found"));
  }

  /** {@inheritDoc} */
  @Override
  public List<Shout> getShouts(String username) {
    return shoutRep.findAllShoutsByUsername(username);
  }

  /** {@inheritDoc} */
  @Override
  public Shout createShout(UUID userId, CreateShoutRequest createShoutRequest) {
    User user = userRep.findById(userId)
        .orElseThrow(() -> new EntityNotFoundException("The user with the userid: " + userId +
            " was not found"));

    Shout shout = Shout.builder()
        .user(user)
        .text(createShoutRequest.getText())
        .images(createShoutRequest.getImages())
        .createdAt(LocalDate.now())
        .build();

    return shoutRep.save(shout);
  }

  /** {@inheritDoc} */
  @Override
  public Set<User> getLikedBy(UUID shoutId) {
    Shout shout = shoutRep.findLikedByUsersByShoutId(shoutId)
        .orElseThrow(() -> new EntityNotFoundException("The user with the shoutId: " + shoutId +
            " was not found"));

    return shout.getLikedBy();
  }

  /** {@inheritDoc} */
  @Override
  public Set<User> getReShoutedBy(UUID shoutId) {
    Shout shout = shoutRep.findReShoutedByUsersByShoutId(shoutId)
        .orElseThrow(() -> new EntityNotFoundException("The user with the shoutId: " + shoutId +
            " was not found"));

    return shout.getReShoutedBy();
  }

  /** {@inheritDoc} */
  @Override
  public void deleteShout(UUID shoutId) {

    Shout shout = shoutRep.findById(shoutId)
        .orElseThrow(() -> new EntityNotFoundException("The shout with the shoutId: " + shoutId +
            " was not found"));
    ;

    shoutRep.delete(shout);
  }

  /** {@inheritDoc} */
  @Override
  public void likeTheShout(UUID shoutId, UUID userId) {
    Shout shout = shoutRep.findById(shoutId)
        .orElseThrow(() -> new EntityNotFoundException("The shout with the shoutId: " + shoutId +
            " was not found"));
    ;

    User user = userRep.findById(userId)
        .orElseThrow(() -> new EntityNotFoundException("The user with the userid: " + userId +
            " was not found"));

    shout.getLikedBy().add(user);

    shoutRep.save(shout);
  }

  /** {@inheritDoc} */
  @Override
  public void dislikeTheShout(UUID shoutId, UUID userId) {
    Shout shout = shoutRep.findById(shoutId)
        .orElseThrow(() -> new EntityNotFoundException("The shout with the shoutId: " + shoutId +
            " was not found"));
    ;

    User user = userRep.findById(userId)
        .orElseThrow(() -> new EntityNotFoundException("The user with the userid: " + userId +
            " was not found"));

    shout.getLikedBy().remove(user);
    shoutRep.save(shout);
  }

  /** {@inheritDoc} */
  @Override
  public void reShoutTheShout(UUID shoutId, UUID userId) {
    Shout shout = shoutRep.findById(shoutId)
        .orElseThrow(() -> new EntityNotFoundException("The shout with the shoutId: " + shoutId +
            " was not found"));
    ;

    User user = userRep.findById(userId)
        .orElseThrow(() -> new EntityNotFoundException("The user with the userid: " + userId +
            " was not found"));

    shout.getReShoutedBy().add(user);

    shoutRep.save(shout);
  }

  /** {@inheritDoc} */
  @Override
  public void unShoutTheShout(UUID shoutId, UUID userId) {
    Shout shout = shoutRep.findById(shoutId)
        .orElseThrow(() -> new EntityNotFoundException("The shout with the shoutId: " + shoutId +
            " was not found"));
    ;

    User user = userRep.findById(userId)
        .orElseThrow(() -> new EntityNotFoundException("The user with the userid: " + userId +
            " was not found"));

    shout.getReShoutedBy().remove(user);

    shoutRep.save(shout);
  }

  /** {@inheritDoc} */
  @Override
  public boolean isUserLikingTheShout(UUID shoutId, UUID userId) {
    return shoutRep.isUserLikingTheShout(shoutId, userId);
  }

  /** {@inheritDoc} */
  @Override
  public boolean isUserReShoutingTheShout(UUID shoutId, UUID userId) {
    return shoutRep.isUserReShoutingTheShout(shoutId, userId);
  }

}
