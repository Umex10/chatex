package org.devtiro.chatex.services.ipl;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.CreateShoutRequest;
import org.devtiro.chatex.domain.entities.Shout;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.enums.ShoutVariant;
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
    return findShoutOrThrow(shoutId);
  }

  /** {@inheritDoc} */
  @Override
  public List<Shout> getShouts(String username, ShoutVariant variant) {
    return shoutRep.findAllShoutsByUsernameAndVariant(username, variant);
  }

  @Override
  public List<String> getAllImages(String username) {
    return shoutRep.findAllImagesByUsername(username);
  }

  /** {@inheritDoc} */
  @Override
  public Shout createShout(UUID userId, CreateShoutRequest createShoutRequest) {
    User user = findUserOrThrow(userId);

    Shout shout = Shout.builder()
        .user(user)
        .text(createShoutRequest.getText())
        .images(createShoutRequest.getImages())
        .createdAt(LocalDate.now())
        .build();

    shout.setVariant(ShoutVariant.DEFAULT);

    return shoutRep.save(shout);
  }

  @Override
  public Shout createComment(UUID userId, UUID mainShoutId, CreateShoutRequest createShoutRequest) {

    User user = findUserOrThrow(userId);

    Shout comment = Shout.builder()
        .user(user)
        .text(createShoutRequest.getText())
        .images(createShoutRequest.getImages())
        .createdAt(LocalDate.now())
        .build();

    Shout commentedShout = getShout(mainShoutId);
    comment.setCommentedShout(commentedShout);
    commentedShout.getComments().add(comment);

    comment.setVariant(ShoutVariant.COMMENT);

    return shoutRep.save(comment);
  }

  @Override
  public void unComment(UUID shoutId) {
    Shout comment = findShoutOrThrow(shoutId);
    shoutRep.delete(comment);
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

    Shout shout = findShoutOrThrow(shoutId);

    shoutRep.delete(shout);
  }

  @Override
  public Set<Shout> likedShouts(String username) {
      User user = userRep.findByUsername(username)
        .orElseThrow(() -> new EntityNotFoundException("User with username " + username + " not found"));

        return user.getLikedShouts();
  }

  /** {@inheritDoc} */
  @Override
  public void likeTheShout(UUID shoutId, UUID userId) {
    Shout shout = findShoutOrThrow(shoutId);

    User user = findUserOrThrow(userId);

    shout.getLikedBy().add(user);
    shoutRep.save(shout);

    user.getLikedShouts().add(shout);
    userRep.save(user);
  }

  /** {@inheritDoc} */
  @Override
  public void dislikeTheShout(UUID shoutId, UUID userId) {
    Shout shout = findShoutOrThrow(shoutId);

   User user = findUserOrThrow(userId);

    shout.getLikedBy().remove(user);

    shoutRep.save(shout);
    user.getLikedShouts().remove(shout);
    userRep.save(user);
  }

  /** {@inheritDoc} */
  @Override
  public void reShoutTheShout(UUID shoutId, UUID userId) {
    Shout shout = findShoutOrThrow(shoutId);

    User user = findUserOrThrow(userId);

    shout.getReShoutedBy().add(user);
    shoutRep.save(shout);

    user.getReShoutedShouts().add(shout);
    userRep.save(user);
  }

  /** {@inheritDoc} */
  @Override
  public void unShoutTheShout(UUID shoutId, UUID userId) {
    Shout shout = findShoutOrThrow(shoutId);

   User user = findUserOrThrow(userId);

    shout.getReShoutedBy().remove(user);
    shoutRep.save(shout);

    user.getReShoutedShouts().remove(shout);
    userRep.save(user);
  }

  @Override
  public void quoteTheShout(UUID shoutId, UUID userId, CreateShoutRequest createShoutRequest) {
    Shout shout = findShoutOrThrow(shoutId);

    User user = findUserOrThrow(userId);

    Shout quote = Shout.builder()
        .user(user)
        .text(createShoutRequest.getText())
        .images(createShoutRequest.getImages())
        .quotedShout(shout)
        .variant(ShoutVariant.DEFAULT)
        .createdAt(LocalDate.now())
        .build();

    shoutRep.save(quote);

    shout.getQuotedBy().add(quote);

    shoutRep.save(shout);

    user.getShouts().add(quote);

    userRep.save(user);
  }

  @Override
  public void unQuoteTheShout(UUID shoutId, UUID userId) {
    Shout quote = findShoutOrThrow(shoutId);
    Shout quotedShout = quote.getQuotedShout();

    User user = findUserOrThrow(userId);

    quotedShout.getQuotedBy().remove(quote);

    user.getShouts().remove(quote);

    shoutRep.delete(quote);
  }

  @Override
  public List<Shout> getQuotedBy(UUID shoutId) {
    Shout shout = findShoutOrThrow(shoutId);

    return shout.getQuotedBy();
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

  private User findUserOrThrow(UUID userId) {
    return userRep.findById(userId)
        .orElseThrow(() -> new EntityNotFoundException("User with id " + userId + " not found"));
  }

  private Shout findShoutOrThrow(UUID shoutId) {
    return shoutRep.findById(shoutId)
        .orElseThrow(() -> new EntityNotFoundException("Shout with id " + shoutId + " not found"));
  }

}
