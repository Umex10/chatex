package org.devtiro.chatex.domain.dtos.responses;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object summarizing a chat connection.
 * Includes participant details, unread counts, and the most recent message snippet.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatDto {

  private UUID id;
  private String name;
  private String username;
  private String avatar;
  private ZonedDateTime createdUserAt;
  private MessageDto lastMessage;
  private List<MessageDto> messages;
  private long unseenMessages;
}
