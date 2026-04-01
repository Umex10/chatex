package org.devtiro.chatex.domain.entities;

import java.time.ZonedDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Entity class representing an individual chat message.
 * Contains the sender, text content, and relates to a specific Chat room.
 */
@Entity
@Table(name = "messages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Message {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @EqualsAndHashCode.Include
  private UUID id;

  @Column
  private String text;

  @Column
  private ZonedDateTime createdAt;

  @Column
  @Builder.Default
  private boolean seen = false;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_sender_id", nullable = false)
  @JsonIgnore
  private User sender;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinTable(name = "user_receiver_id")
  @JsonIgnore
  private User receiver;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "chat_id", nullable = false)
  @JsonIgnore
  private Chat chat;
}
