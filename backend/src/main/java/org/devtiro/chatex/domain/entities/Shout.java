package org.devtiro.chatex.domain.entities;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shouts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Shout {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column
  private LocalDate createdAt;

  @Column
  private String text;

  @Column
  private List<String> images;

  @ManyToMany
  @JoinTable(name = "shout_likes", joinColumns = @JoinColumn(name = "shout_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
  @Builder.Default
  private Set<User> likedBy = new HashSet<>();

  @ManyToMany
  @JoinTable(name = "shout_reShouts", joinColumns = @JoinColumn(name = "shout_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
  @Builder.Default
  private Set<User> reShoutedBy = new HashSet<>();
}
