package org.devtiro.chatex.reps;

import org.devtiro.chatex.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRep extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    boolean existsUserByUsername(String username);

    boolean existsUserByEmail(String email);

    boolean existsUserByPhone(String phone);
}
