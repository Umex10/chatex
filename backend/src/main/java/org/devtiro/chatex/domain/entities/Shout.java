package org.devtiro.chatex.domain.entities;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.enums.ShoutVariant;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entity class representing a shout (post) in the system.
 * Stores the text content, optional images, and engagement data such as likes
 * and re-shouts.
 */
@Entity
@Table(name = "shouts")
@Data
@Builder(toBuilder = true) // Gives us the ability to create a new Instance with some existing info
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Shout {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @EqualsAndHashCode.Include
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column
  private ZonedDateTime createdAt;

  @Column
  private String text;

  @ElementCollection
  @CollectionTable(name = "shout_images", joinColumns = @JoinColumn(name = "shout_id"))
  @Column(name = "image_url")
  @Builder.Default
  private List<String> images = new ArrayList<>();

  @ManyToMany
  @JoinTable(name = "shout_likes", joinColumns = @JoinColumn(name = "shout_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
  @Builder.Default
  private Set<User> likedBy = new HashSet<>();

  @ManyToMany
  @JoinTable(name = "shout_reShouts", joinColumns = @JoinColumn(name = "shout_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
  @Builder.Default
  private Set<User> reShoutedBy = new HashSet<>();

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "comment_shout_id")
  private Shout commentedShout;

  @OneToMany(mappedBy = "commentedShout", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @Builder.Default
  private List<Shout> comments = new ArrayList<>();

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "quoted_shout_id")
  private Shout quotedShout;

  @OneToMany(mappedBy = "quotedShout", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @Builder.Default
  private List<Shout> quotedBy = new ArrayList<>();

  @Enumerated(EnumType.STRING)
  private ShoutVariant variant;

}
