package org.devtiro.chatex.controllers;

import java.util.List;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.CreateShoutRequest;
import org.devtiro.chatex.domain.dtos.responses.ShoutDto;
import org.devtiro.chatex.domain.entities.Shout;
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

  @GetMapping(path = "/{username}")
  public ResponseEntity<List<ShoutDto>> getShouts(@PathVariable String username) {

    List<Shout> shouts = shoutService.getShouts();

    List<ShoutDto> shoutsDto = shoutMapper.toDtoList(shouts);

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

  @DeleteMapping("/{shoutId}")
  public ResponseEntity<Void> deleteShout(@PathVariable UUID shoutId) {

    shoutService.deleteShout(shoutId);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

  @PostMapping("/{shoutId}/like")
  public ResponseEntity<Void> likeShout(@PathVariable UUID shoutId) {

    shoutService.likeTheShout(shoutId);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

  @PostMapping("/{shoutId}/reShout")
  public ResponseEntity<Void> reShoutTheShout(@PathVariable UUID shoutId) {

    shoutService.reShoutTheShout(shoutId);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }
}
