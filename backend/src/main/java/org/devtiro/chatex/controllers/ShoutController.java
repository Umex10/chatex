package org.devtiro.chatex.controllers;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.CreateShoutRequest;
import org.devtiro.chatex.domain.dtos.responses.FollowDto;
import org.devtiro.chatex.domain.dtos.responses.ShoutDto;
import org.devtiro.chatex.domain.entities.Shout;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.mappers.FollowMapper;
import org.devtiro.chatex.domain.mappers.ShoutMapper;
import org.devtiro.chatex.services.ShoutService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping(path = "/api/v1/shout")
@RequiredArgsConstructor
public class ShoutController {

  private final ShoutService shoutService;
  private final ShoutMapper shoutMapper;
  private final FollowMapper followMapper;

  @GetMapping(path = "/{username}")
  public ResponseEntity<List<ShoutDto>> getShouts(@PathVariable String username,
      @RequestAttribute UUID userId) {

    List<Shout> shouts = shoutService.getShouts(username);

    List<ShoutDto> shoutsDto = shoutMapper.toDtoList(shouts);

    shoutsDto.forEach(dto -> dto.setUserLikingTheShout(
        shoutService.isUserLikingTheShout(dto.getId(), userId)));

    shoutsDto.forEach(dto -> dto.setUserReShoutingTheShout(
        shoutService.isUserReShoutingTheShout(dto.getId(), userId)));

    return new ResponseEntity<>(shoutsDto, HttpStatus.OK);
  }

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

  @GetMapping(path = "/{shoutId}/likedBy")
  public ResponseEntity<List<FollowDto>> getLikedBy(@PathVariable UUID shoutId) {

    Set<User> likedBy = shoutService.getLikedBy(shoutId);

    List<FollowDto> likedByDto = followMapper.toDtoList(likedBy);

    return new ResponseEntity<>(likedByDto, HttpStatus.OK);
  }

  @GetMapping(path = "/{shoutId}/reShoutedBy")
  public ResponseEntity<List<FollowDto>> getReShoutedBy(@PathVariable UUID shoutId) {

    Set<User> reShoutedBy = shoutService.getReShoutedBy(shoutId);

    List<FollowDto> reShoutedByDto = followMapper.toDtoList(reShoutedBy);

    return new ResponseEntity<>(reShoutedByDto, HttpStatus.OK);
  }

  @DeleteMapping(path = "/{shoutId}")
  public ResponseEntity<Void> deleteShout(@PathVariable UUID shoutId) {

    shoutService.deleteShout(shoutId);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

  @PostMapping(path = "/{shoutId}/like")
  public ResponseEntity<Void> likeShout(@PathVariable UUID shoutId,
      @RequestAttribute UUID userId) {

    shoutService.likeTheShout(shoutId, userId);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

  @PostMapping(path = "/{shoutId}/dislike")
  public ResponseEntity<Void> dislikeShout(@PathVariable UUID shoutId,
      @RequestAttribute UUID userId) {

    shoutService.dislikeTheShout(shoutId, userId);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

  @PostMapping(path = "/{shoutId}/reShout")
  public ResponseEntity<Void> reShoutTheShout(@PathVariable UUID shoutId,
      @RequestAttribute UUID userId) {

    shoutService.reShoutTheShout(shoutId, userId);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

  @PostMapping(path = "/{shoutId}/unShout")
  public ResponseEntity<Void> unShoutTheShout(@PathVariable UUID shoutId,
      @RequestAttribute UUID userId) {

    shoutService.unShoutTheShout(shoutId, userId);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }
}
