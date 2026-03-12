package org.devtiro.chatex.controllers;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.CreateShoutRequest;
import org.devtiro.chatex.domain.dtos.responses.FollowDto;
import org.devtiro.chatex.domain.dtos.responses.ShoutDto;
import org.devtiro.chatex.domain.entities.Shout;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.enums.ShoutVariant;
import org.devtiro.chatex.domain.mappers.ShoutMapper;
import org.devtiro.chatex.services.FollowService;
import org.devtiro.chatex.services.ShoutService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

/**
 * REST controller handling shout (post) operations.
 * Provides endpoints for creating, retrieving, deleting shouts and managing
 * user engagement actions such as likes and re-shouts.
 */
@RestController
@RequestMapping(path = "/api/v1/shout")
@RequiredArgsConstructor
public class ShoutController {

  private final ShoutService shoutService;
  private final FollowService followService;
  private final ShoutMapper shoutMapper;

  /**
   * Retrieves all shouts for the given username with engagement flags for the
   * requesting user.
   *
   * @return ResponseEntity containing a list of ShoutDto entries
   */
  @GetMapping(path = "/{username}")
  public ResponseEntity<List<ShoutDto>> getShouts(@PathVariable String username,
      @RequestAttribute UUID userId) {

    List<Shout> shouts = shoutService.getShouts(username, ShoutVariant.DEFAULT);

    List<ShoutDto> shoutsDto = shoutMapper.toDtoList(shouts);

    shoutsDto.forEach(dto -> {
      dto.setUserLikingTheShout(
          shoutService.isUserLikingTheShout(dto.getId(), userId));
      dto.setUserReShoutingTheShout(
          shoutService.isUserReShoutingTheShout(dto.getId(), userId));
    });

    return new ResponseEntity<>(shoutsDto, HttpStatus.OK);
  }

  /**
   * Retrieves a single shout by its ID with engagement flags for the requesting
   * user.
   *
   * @return ResponseEntity containing the ShoutDto
   */
  @GetMapping(path = "/{username}/{shoutId}")
  public ResponseEntity<ShoutDto> getShout(@PathVariable UUID shoutId,
      @RequestAttribute UUID userId) {

    Shout shout = shoutService.getShout(shoutId);

    ShoutDto shoutsDto = shoutMapper.toDto(shout);

    shoutsDto.setUserLikingTheShout(
        shoutService.isUserLikingTheShout(shoutId, userId));

    shoutsDto.setUserReShoutingTheShout(
        shoutService.isUserReShoutingTheShout(shoutId, userId));

    return new ResponseEntity<>(shoutsDto, HttpStatus.OK);
  }

  @GetMapping(path = "/{username}/images")
  public ResponseEntity<List<String>> getAllImages(@PathVariable String username) {

    List<String> images = shoutService.getAllImages(username);

    return new ResponseEntity<>(images, HttpStatus.OK);
  }

  /**
   * Creates a new shout on behalf of the authenticated user.
   *
   * @return ResponseEntity containing the created ShoutDto with HTTP 201 status
   */
  @PostMapping()
  public ResponseEntity<ShoutDto> createShout(@RequestAttribute UUID userId,
      @RequestBody CreateShoutRequest createShoutRequest) {

    Shout shout = shoutService.createShout(userId, createShoutRequest);

    ShoutDto shoutDto = shoutMapper.toDto(shout);

    shoutDto.setName(shout.getUser().getName());
    shoutDto.setUsername(shout.getUser().getUsername());
    shoutDto.setAvatar(shout.getUser().getAvatar());

    return new ResponseEntity<>(shoutDto, HttpStatus.CREATED);

  }

  /**
   * Retrieves all users who liked the given shout, enriched with follow-status
   * badges.
   *
   * @return ResponseEntity containing a list of FollowDto entries
   */
  @GetMapping(path = "/{shoutId}/likedBy")
  public ResponseEntity<List<FollowDto>> getLikedBy(@PathVariable UUID shoutId,
      @RequestAttribute("userId") UUID userId) {

    Set<User> likedBy = shoutService.getLikedBy(shoutId);

    List<FollowDto> likedByDto = followService.handleFollowBadges(userId, likedBy);

    return new ResponseEntity<>(likedByDto, HttpStatus.OK);
  }

  /**
   * Retrieves all users who re-shouted the given shout, enriched with
   * follow-status badges.
   *
   * @return ResponseEntity containing a list of FollowDto entries
   */
  @GetMapping(path = "/{shoutId}/reShoutedBy")
  public ResponseEntity<List<FollowDto>> getReShoutedBy(@PathVariable UUID shoutId,
      @RequestAttribute("userId") UUID userId) {

    Set<User> reShoutedBy = shoutService.getReShoutedBy(shoutId);

    List<FollowDto> reShoutedByDto = followService.handleFollowBadges(userId, reShoutedBy);

    return new ResponseEntity<>(reShoutedByDto, HttpStatus.OK);
  }

  /**
   * Deletes the shout identified by the given ID.
   *
   * @return ResponseEntity with HTTP 200 OK and an empty body
   */
  @DeleteMapping(path = "/{shoutId}")
  public ResponseEntity<Void> deleteShout(@PathVariable UUID shoutId) {

    shoutService.deleteShout(shoutId);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

  /**
   * Adds a like from the authenticated user to the given shout.
   *
   * @return ResponseEntity with HTTP 200 OK and an empty body
   */
  @PostMapping(path = "/{shoutId}/like")
  public ResponseEntity<Void> likeShout(@PathVariable UUID shoutId,
      @RequestAttribute UUID userId) {

    shoutService.likeTheShout(shoutId, userId);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

  /**
   * Removes a like from the authenticated user on the given shout.
   *
   * @return ResponseEntity with HTTP 200 OK and an empty body
   */
  @PostMapping(path = "/{shoutId}/dislike")
  public ResponseEntity<Void> dislikeShout(@PathVariable UUID shoutId,
      @RequestAttribute UUID userId) {

    shoutService.dislikeTheShout(shoutId, userId);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

  /**
   * Adds a re-shout from the authenticated user to the given shout.
   *
   * @return ResponseEntity with HTTP 200 OK and an empty body
   */
  @PostMapping(path = "/{shoutId}/reShout")
  public ResponseEntity<Void> reShoutTheShout(@PathVariable UUID shoutId,
      @RequestAttribute UUID userId) {

    shoutService.reShoutTheShout(shoutId, userId);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

  /**
   * Removes a re-shout from the authenticated user on the given shout.
   *
   * @return ResponseEntity with HTTP 200 OK and an empty body
   */
  @PostMapping(path = "/{shoutId}/unShout")
  public ResponseEntity<Void> unShoutTheShout(@PathVariable UUID shoutId,
      @RequestAttribute UUID userId) {

    shoutService.unShoutTheShout(shoutId, userId);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

  @PostMapping(path = "/{shoutId}/quote")
  public ResponseEntity<Void> quoteTheShout(@PathVariable UUID shoutId,
      @RequestAttribute UUID userId, @RequestBody String text) {

    shoutService.quoteTheShout(shoutId, userId, text);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

    @PostMapping(path = "/{shoutId}/unQuote")
  public ResponseEntity<Void> unQuoteTheShout(@PathVariable UUID shoutId,
      @RequestAttribute UUID userId) {

    shoutService.unQuoteTheShout(shoutId, userId);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

  @GetMapping(path = "/{shoutId}/comment")
  public ResponseEntity<List<ShoutDto>> getComments(@PathVariable UUID shoutId,
      @RequestAttribute UUID userId) {

    Shout shout = shoutService.getShout(shoutId);

    List<Shout> comments = shout.getComments();

    List<ShoutDto> shoutsDto = shoutMapper.toDtoList(comments);

    shoutsDto.forEach(dto -> dto.setUserLikingTheShout(
        shoutService.isUserLikingTheShout(dto.getId(), userId)));

    shoutsDto.forEach(dto -> dto.setUserReShoutingTheShout(
        shoutService.isUserReShoutingTheShout(dto.getId(), userId)));

    return new ResponseEntity<>(shoutsDto, HttpStatus.OK);
  }

  @GetMapping(path = "/{username}/userComment")
  public ResponseEntity<List<ShoutDto>> getUserComments(@PathVariable String username,
      @RequestAttribute UUID userId) {

    List<Shout> shouts = shoutService.getShouts(username, ShoutVariant.COMMENT);

    List<ShoutDto> shoutsDto = shoutMapper.toDtoList(shouts);

    shoutsDto.forEach(dto -> {
      dto.setUserLikingTheShout(
          shoutService.isUserLikingTheShout(dto.getId(), userId));
      dto.setUserReShoutingTheShout(
          shoutService.isUserReShoutingTheShout(dto.getId(), userId));
    });

    return new ResponseEntity<>(shoutsDto, HttpStatus.OK);
  }

  @PostMapping(path = "/{shoutId}/comment")
  public ResponseEntity<ShoutDto> commentOnShout(@PathVariable UUID shoutId,
      @RequestBody CreateShoutRequest createShoutRequest,
      @RequestAttribute UUID userId) {

    Shout comment = shoutService.createComment(userId, shoutId, createShoutRequest);

    ShoutDto commentDto = shoutMapper.toDto(comment);

    commentDto.setName(comment.getUser().getName());
    commentDto.setUsername(comment.getUser().getUsername());
    commentDto.setAvatar(comment.getUser().getAvatar());

    return new ResponseEntity<>(commentDto, HttpStatus.CREATED);
  }
}
