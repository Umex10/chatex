package org.devtiro.chatex.reps;

import java.util.List;
import java.util.UUID;

import org.devtiro.chatex.domain.entities.Shout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ShoutRep extends JpaRepository<Shout, UUID> {

  @Query("SELECT s from Shout s JOIN FETCH s.user ORDER BY s.createdAt DESC")
  List<Shout> findAllShoutsWithUser();
  
}
