package org.devtiro.chatex.services.ipl;

import java.util.List;

import org.devtiro.chatex.domain.entities.Shout;
import org.devtiro.chatex.reps.ShoutRep;
import org.devtiro.chatex.services.ShoutService;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShoutServiceIpl implements ShoutService {

  private final ShoutRep shoutRep;

  @Override
  public List<Shout> getShouts() {
    return shoutRep.findAllShoutsWithUser();
  }

  
  
}
