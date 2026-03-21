package org.devtiro.chatex.domain.dtos.responses;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MessageDto {
  
  private UUID chatId;
  private String text;
  private LocalDate createdAt;
  private boolean seen;
  private String senderUsername;
  private String receiverUsername;

}
