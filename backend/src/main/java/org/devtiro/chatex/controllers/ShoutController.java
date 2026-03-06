package org.devtiro.chatex.controllers;

import java.util.List;

import org.devtiro.chatex.domain.dtos.responses.ShoutDto;
import org.devtiro.chatex.domain.entities.Shout;
import org.devtiro.chatex.domain.mappers.ShoutMapper;
import org.devtiro.chatex.services.ShoutService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping(path = "/api/v1/shouts")
@RequiredArgsConstructor
public class ShoutController {

  private final ShoutService shoutService;
  private final ShoutMapper shoutMapper;

  @GetMapping(path = "/{username}/shouts")
  public ResponseEntity<List<ShoutDto>> getShouts(@PathVariable String username) {

    List<Shout> shouts = shoutService.getShouts();

    List<ShoutDto> shoutsDto = shoutMapper.toDtoList(shouts);

    return new ResponseEntity<>(shoutsDto, HttpStatus.OK);
  }
}
