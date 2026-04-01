package org.devtiro.chatex.domain.dtos.requests;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object representing an incoming chat message request.
 * Contains the payload used to send a direct message via WebSockets.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageRequest {
  private String text;
  private String receiverUsername;
  private UUID chatId;
}