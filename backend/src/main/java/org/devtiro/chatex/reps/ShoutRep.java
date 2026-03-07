package org.devtiro.chatex.reps;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.devtiro.chatex.domain.entities.Shout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ShoutRep extends JpaRepository<Shout, UUID> {

  @Query("SELECT s from Shout s JOIN FETCH s.user WHERE s.user.username = :username ORDER BY s.createdAt DESC")
  List<Shout> findAllShoutsByUsername(@Param("username") String username);

  @Query("Select s from Shout s LEFT JOIN FETCH s.likedBy WHERE s.id = :shoutId")
  Optional<Shout> findLikedByUsersByShoutId(@Param("shoutId") UUID shoutId);

  @Query("Select s from Shout s LEFT JOIN FETCH s.reShoutedBy WHERE s.id = :shoutId")
  Optional<Shout> findReShoutedByUsersByShoutId(@Param("shoutId") UUID shoutId);

  @Query("Select COUNT(s) > 0 FROM Shout s JOIN s.likedBy u WHERE s.id = :shoutId AND u.id = :userId")
  boolean isUserLikingTheShout(
      @Param("shoutId") UUID shoutId,
      @Param("userId") UUID userId);

  @Query("Select COUNT(s) > 0 FROM Shout s JOIN s.reShoutedBy u WHERE s.id = :shoutId AND u.id = :userId")
  boolean isUserReShoutingTheShout(
      @Param("shoutId") UUID shoutId,
      @Param("userId") UUID userId);
}
