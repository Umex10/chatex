package org.devtiro.chatex.domain.dtos.responses;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.devtiro.chatex.domain.entities.Message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatDto {

  private UUID id;
  private String name;
  private String username;
  private String avatar;
  private LocalDate createdUserAt;
  private Message lastMessage;
  private List<Message> messages;

}
