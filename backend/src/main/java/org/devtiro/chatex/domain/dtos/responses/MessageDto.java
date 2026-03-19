package org.devtiro.chatex.domain.dtos.responses;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MessageDto {
  
  private String text;
  private LocalDate createdAt;
  private boolean read;
  private String senderUsername;
  private String receiverUsername;

}
