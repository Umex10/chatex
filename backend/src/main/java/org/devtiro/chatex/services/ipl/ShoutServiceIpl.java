package org.devtiro.chatex.services.ipl;

import java.time.LocalDate;
import java.util.List;
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

@Service
@RequiredArgsConstructor
public class ShoutServiceIpl implements ShoutService {

  private final ShoutRep shoutRep;
  private final UserRep userRep;

  @Override
  public List<Shout> getShouts() {
    return shoutRep.findAllShoutsWithUser();
  }

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

  @Override
  public void deleteShout(UUID shoutId) {

    Shout shout = shoutRep.findById(shoutId)
        .orElseThrow(() -> new EntityNotFoundException("The shout with the shoutId: " + shoutId +
            " was not found"));
    ;

    shoutRep.delete(shout);
  }

  @Override
  public void likeTheShout(UUID shoutId) {
    Shout shout = shoutRep.findById(shoutId)
        .orElseThrow(() -> new EntityNotFoundException("The shout with the shoutId: " + shoutId +
            " was not found"));
    ;

    shoutRep.save(shout);
  }

  @Override
  public void reShoutTheShout(UUID shoutId) {
    Shout shout = shoutRep.findById(shoutId)
        .orElseThrow(() -> new EntityNotFoundException("The shout with the shoutId: " + shoutId +
            " was not found"));
    ;

    shoutRep.save(shout);
  }

}
