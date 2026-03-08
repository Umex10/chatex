package org.devtiro.chatex.domain.dtos.requests;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for creating a new shout.
 * Contains the text content and an optional list of image URLs.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateShoutRequest {

  private String text;
  private List<String> images;
  
}
