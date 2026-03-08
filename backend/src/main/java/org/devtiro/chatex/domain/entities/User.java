package org.devtiro.chatex.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Entity class representing a user in the system.
 * Stores user account information including credentials and contact details.
 */
@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true, updatable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String phone;

    @Column(name = "`key`", nullable = false)
    private String key;

    @Column(name = "createdAt", updatable = false)
    private LocalDate createdAt;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "banner")
    private String banner;

    @Column(name = "bio")
    private String bio;

    @Column(name = "location")
    private String location;

    @Column(name = "website")
    private String website;

    /**
     * The list of shouts (posts) authored by this user.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Shout> shouts = new ArrayList<>();

    /**
     * The set of users this user is following (owner side of the M:N
     * self-reference).
     */
    @ManyToMany
    @JoinTable(name = "user_follows", 
    joinColumns = @JoinColumn(name = "follower_id"), 
    inverseJoinColumns = @JoinColumn(name = "following_id"))
    @Builder.Default
    private Set<User> following = new HashSet<>();

    /**
     * The set of users that are following this user (inverse/mirror side of the M:N
     * self-reference).
     */
    @Builder.Default
    @ManyToMany(mappedBy = "following")
    private Set<User> followers = new HashSet<>();

    /**
     * The set of shouts this user has liked (inverse side of the shout-likes M:N relationship).
     */
    @Builder.Default
    @ManyToMany(mappedBy = "likedBy")
    private Set<Shout> likedShouts = new HashSet<>();

    /**
     * The set of shouts this user has re-shouted (inverse side of the shout-reShouts M:N relationship).
     */
    @Builder.Default
    @ManyToMany(mappedBy = "reShoutedBy")
    private Set<Shout> reShoutedShouts = new HashSet<>();

}
