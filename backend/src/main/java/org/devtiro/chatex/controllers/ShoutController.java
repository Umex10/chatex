package org.devtiro.chatex.controllers;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
import org.devtiro.chatex.domain.dtos.requests.CreateShoutRequest;
import org.devtiro.chatex.domain.dtos.responses.FollowDto;
import org.devtiro.chatex.domain.dtos.responses.ShoutDto;
import org.devtiro.chatex.domain.entities.Shout;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.enums.ShoutVariant;
import org.devtiro.chatex.domain.mappers.ShoutMapper;
import org.devtiro.chatex.services.FollowService;
import org.devtiro.chatex.services.ShoutService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller handling shout (post) operations.
 * Provides endpoints for creating, retrieving, deleting shouts and managing
 * user engagement actions such as likes, re-shouts, and quotes.
 */
@RestController
@RequestMapping(path = "/api/v1/shout")
@RequiredArgsConstructor
public class ShoutController {

    private final ShoutService shoutService;
    private final FollowService followService;
    private final ShoutMapper shoutMapper;

    // ==========================================
    // QUERIES (GET)
    // ==========================================

    /**
     * Retrieves all shouts for the given username with engagement flags for the
     * requesting user.
     *
     * @param username the target username whose shouts are being requested
     * @param userId   the ID of the requesting user
     * @return ResponseEntity containing a list of ShoutDto entries
     */
    @GetMapping(path = "/{username}")
    public ResponseEntity<List<ShoutDto>> getShouts(@PathVariable String username,
            @RequestAttribute UUID userId) {
        List<Shout> shouts = shoutService.getShouts(username, ShoutVariant.DEFAULT);
        List<ShoutDto> shoutsDto = shoutMapper.toDtoList(shouts);

        shoutsDto.forEach(dto -> {
            dto.setUserLikingTheShout(shoutService.isUserLikingTheShout(dto.getId(), userId));
            dto.setUserReShoutingTheShout(shoutService.isUserReShoutingTheShout(dto.getId(), userId));
        });

        return new ResponseEntity<>(shoutsDto, HttpStatus.OK);
    }

     /**
     * Retrieves all shouts for the given username with engagement flags for the
     * requesting user.
     *
     * @param username the target username whose shouts are being requested
     * @param userId   the ID of the requesting user
     * @return ResponseEntity containing a list of ShoutDto entries
     */
    @GetMapping(path = "/recentShouts")
    public ResponseEntity<List<ShoutDto>> getRecentShouts(@RequestAttribute UUID userId) {
        List<Shout> shouts = shoutService.getRecentShouts(userId, ShoutVariant.DEFAULT);
        List<ShoutDto> shoutsDto = shoutMapper.toDtoList(shouts);

        shoutsDto.forEach(dto -> {
            dto.setUserLikingTheShout(shoutService.isUserLikingTheShout(dto.getId(), userId));
            dto.setUserReShoutingTheShout(shoutService.isUserReShoutingTheShout(dto.getId(), userId));
        });

        return new ResponseEntity<>(shoutsDto, HttpStatus.OK);
    }

         /**
     * Retrieves all shouts for the given username with engagement flags for the
     * requesting user.
     *
     * @param username the target username whose shouts are being requested
     * @param userId   the ID of the requesting user
     * @return ResponseEntity containing a list of ShoutDto entries
     */
    @GetMapping(path = "/recentFollowingShouts")
    public ResponseEntity<List<ShoutDto>> getRecentFollowingShouts(@RequestAttribute UUID userId) {
        List<Shout> shouts = shoutService.getRecentFollowingShouts(userId, ShoutVariant.DEFAULT);
        List<ShoutDto> shoutsDto = shoutMapper.toDtoList(shouts);

        shoutsDto.forEach(dto -> {
            dto.setUserLikingTheShout(shoutService.isUserLikingTheShout(dto.getId(), userId));
            dto.setUserReShoutingTheShout(shoutService.isUserReShoutingTheShout(dto.getId(), userId));
        });

        return new ResponseEntity<>(shoutsDto, HttpStatus.OK);
    }

    /**
     * Retrieves a single shout by its ID with engagement flags for the requesting
     * user.
     *
     * @param shoutId the ID of the shout to fetch
     * @param userId  the ID of the requesting user
     * @return ResponseEntity containing the requested ShoutDto
     */
    @GetMapping(path = "/{username}/{shoutId}")
    public ResponseEntity<ShoutDto> getShout(@PathVariable UUID shoutId,
            @RequestAttribute UUID userId) {
        Shout shout = shoutService.getShout(shoutId);
        ShoutDto shoutsDto = shoutMapper.toDto(shout);

        shoutsDto.setUserLikingTheShout(shoutService.isUserLikingTheShout(shoutId, userId));
        shoutsDto.setUserReShoutingTheShout(shoutService.isUserReShoutingTheShout(shoutId, userId));

        return new ResponseEntity<>(shoutsDto, HttpStatus.OK);
    }

    /**
     * Retrieves all image URLs associated with shouts from a specific user.
     *
     * @param username the target username
     * @return ResponseEntity containing a list of image URLs
     */
    @GetMapping(path = "/{username}/images")
    public ResponseEntity<List<String>> getAllImages(@PathVariable String username) {
        List<String> images = shoutService.getAllImages(username);
        return new ResponseEntity<>(images, HttpStatus.OK);
    }

    /**
     * Retrieves all comments made by a specific user.
     *
     * @param username the target username whose comments are being fetched
     * @param userId   the ID of the requesting user
     * @return ResponseEntity containing a list of User's comment ShoutDto entries
     */
    @GetMapping(path = "/{username}/userComment")
    public ResponseEntity<List<ShoutDto>> getUserComments(@PathVariable String username,
            @RequestAttribute UUID userId) {
        List<Shout> shouts = shoutService.getShouts(username, ShoutVariant.COMMENT);
        List<ShoutDto> shoutsDto = shoutMapper.toDtoList(shouts);

        shoutsDto.forEach(dto -> {
            dto.setUserLikingTheShout(shoutService.isUserLikingTheShout(dto.getId(), userId));
            dto.setUserReShoutingTheShout(shoutService.isUserReShoutingTheShout(dto.getId(), userId));
        });

        return new ResponseEntity<>(shoutsDto, HttpStatus.OK);
    }

    /**
     * Retrieves all users who liked a specific shout, enriched with follow-status
     * badges.
     *
     * @param shoutId the ID of the evaluated shout
     * @param userId  the ID of the requesting user
     * @return ResponseEntity containing a list of FollowDto representing users who
     *         liked the shout
     */
    @GetMapping(path = "/{shoutId}/likedBy")
    public ResponseEntity<List<FollowDto>> getLikedBy(@PathVariable UUID shoutId,
            @RequestAttribute("userId") UUID userId) {
        Set<User> likedBy = shoutService.getLikedBy(shoutId);
        List<FollowDto> likedByDto = followService.handleFollowBadges(userId, likedBy);

        return new ResponseEntity<>(likedByDto, HttpStatus.OK);
    }

    /**
     * Retrieves all users who re-shouted a specific shout, enriched with
     * follow-status badges.
     *
     * @param shoutId the ID of the evaluated shout
     * @param userId  the ID of the requesting user
     * @return ResponseEntity containing a list of FollowDto representing users who
     *         re-shouted
     */
    @GetMapping(path = "/{shoutId}/reShoutedBy")
    public ResponseEntity<List<FollowDto>> getReShoutedBy(@PathVariable UUID shoutId,
            @RequestAttribute("userId") UUID userId) {
        Set<User> reShoutedBy = shoutService.getReShoutedBy(shoutId);
        List<FollowDto> reShoutedByDto = followService.handleFollowBadges(userId, reShoutedBy);

        return new ResponseEntity<>(reShoutedByDto, HttpStatus.OK);
    }

    /**
     * Retrieves all quoted shouts for a specific shout ID.
     *
     * @param shoutId the ID of the shout to check for quotes
     * @param userId  the ID of the requesting user
     * @return ResponseEntity containing a list of quoted ShoutDto entries
     */
    @GetMapping(path = "/{shoutId}/quote")
    public ResponseEntity<List<ShoutDto>> getQuotedBy(@PathVariable UUID shoutId,
            @RequestAttribute UUID userId) {
        List<Shout> quotes = shoutService.getQuotedBy(shoutId);
        List<ShoutDto> quotsDto = shoutMapper.toDtoList(quotes);

        quotsDto.forEach(dto -> {
            dto.setUserLikingTheShout(shoutService.isUserLikingTheShout(dto.getId(), userId));
            dto.setUserReShoutingTheShout(shoutService.isUserReShoutingTheShout(dto.getId(), userId));
        });

        return new ResponseEntity<>(quotsDto, HttpStatus.OK);
    }

    /**
     * Retrieves all comments (replies) attached to a specific shout ID.
     *
     * @param shoutId the ID of the base shout
     * @param userId  the ID of the requesting user
     * @return ResponseEntity containing a list of comment ShoutDto entries
     */
    @GetMapping(path = "/{shoutId}/comment")
    public ResponseEntity<List<ShoutDto>> getComments(@PathVariable UUID shoutId,
            @RequestAttribute UUID userId) {
        Shout shout = shoutService.getShout(shoutId);
        List<Shout> comments = shout.getComments();
        List<ShoutDto> shoutsDto = shoutMapper.toDtoList(comments);

        shoutsDto.forEach(dto -> {
            dto.setUserLikingTheShout(shoutService.isUserLikingTheShout(dto.getId(), userId));
            dto.setUserReShoutingTheShout(shoutService.isUserReShoutingTheShout(dto.getId(), userId));
        });

        return new ResponseEntity<>(shoutsDto, HttpStatus.OK);
    }

    // ==========================================
    // MUTATIONS (POST/DELETE)
    // ==========================================

    /**
     * Creates a new main shout on behalf of the authenticated user.
     *
     * @param userId             the ID of the authenticated user creating the shout
     * @param createShoutRequest the payload with shout details (text, images, etc.)
     * @return ResponseEntity containing the newly created ShoutDto with HTTP 201
     *         status
     */
    @PostMapping
    public ResponseEntity<ShoutDto> createShout(@RequestAttribute UUID userId,
            @RequestBody CreateShoutRequest createShoutRequest) {
        Shout shout = shoutService.createShout(userId, createShoutRequest);
        ShoutDto shoutDto = shoutMapper.toDto(shout);

        shoutDto.setName(shout.getUser().getName());
        shoutDto.setUsername(shout.getUser().getUsername());
        shoutDto.setAvatar(shout.getUser().getAvatar());

        return new ResponseEntity<>(shoutDto, HttpStatus.CREATED);
    }

    /**
     * Replies with a comment to an existing shout.
     *
     * @param shoutId            the ID of the shout to comment on
     * @param createShoutRequest the comment's payload (text, images)
     * @param userId             the ID of the authenticated user
     * @return ResponseEntity containing the created comment's ShoutDto
     */
    @PostMapping(path = "/{shoutId}/comment")
    public ResponseEntity<ShoutDto> commentOnShout(@PathVariable UUID shoutId,
            @RequestBody CreateShoutRequest createShoutRequest,
            @RequestAttribute UUID userId) {
        Shout comment = shoutService.createComment(userId, shoutId, createShoutRequest);
        ShoutDto commentDto = shoutMapper.toDto(comment);

        commentDto.setName(comment.getUser().getName());
        commentDto.setUsername(comment.getUser().getUsername());
        commentDto.setAvatar(comment.getUser().getAvatar());

        return new ResponseEntity<>(commentDto, HttpStatus.CREATED);
    }

    /**
     * Deletes the shout identified by the given ID.
     *
     * @param shoutId the ID of the shout to delete
     * @return ResponseEntity with HTTP 200 OK and an empty body
     */
    @DeleteMapping(path = "/{shoutId}")
    public ResponseEntity<Void> deleteShout(@PathVariable UUID shoutId) {
        shoutService.deleteShout(shoutId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{username}/likedShouts")
    public ResponseEntity<List<ShoutDto>> likedShouts(@PathVariable String username,
            @RequestAttribute UUID userId) {

        Set<Shout> likedShouts = shoutService.likedShouts(username);
        List<ShoutDto> likedShoutsDto = shoutMapper.toDtoList(likedShouts);

        likedShoutsDto.forEach(dto -> {
            dto.setUserLikingTheShout(shoutService.isUserLikingTheShout(dto.getId(), userId));
            dto.setUserReShoutingTheShout(shoutService.isUserReShoutingTheShout(dto.getId(), userId));
        });

        return new ResponseEntity<>(likedShoutsDto, HttpStatus.OK);
    }

    /**
     * Adds a like from the authenticated user to the given shout.
     *
     * @param shoutId the ID of the shout to like
     * @param userId  the ID of the authenticated user
     * @return ResponseEntity with HTTP 200 OK and an empty body
     */
    @PostMapping(path = "/{shoutId}/like")
    public ResponseEntity<Void> likeShout(@PathVariable UUID shoutId,
            @RequestAttribute UUID userId) {
        shoutService.likeTheShout(shoutId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Removes a like previously placed by the authenticated user on the given
     * shout.
     *
     * @param shoutId the ID of the shout to remove the like from
     * @param userId  the ID of the authenticated user
     * @return ResponseEntity with HTTP 200 OK and an empty body
     */
    @PostMapping(path = "/{shoutId}/dislike")
    public ResponseEntity<Void> dislikeShout(@PathVariable UUID shoutId,
            @RequestAttribute UUID userId) {
        shoutService.dislikeTheShout(shoutId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Re-shouts the given shout on behalf of the authenticated user.
     *
     * @param shoutId the ID of the shout to re-shout
     * @param userId  the ID of the authenticated user
     * @return ResponseEntity with HTTP 200 OK and an empty body
     */
    @PostMapping(path = "/{shoutId}/reShout")
    public ResponseEntity<Void> reShoutTheShout(@PathVariable UUID shoutId,
            @RequestAttribute UUID userId) {
        shoutService.reShoutTheShout(shoutId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Removes a previously created re-shout from the authenticated user.
     *
     * @param shoutId the ID of the originally re-shouted shout
     * @param userId  the ID of the authenticated user
     * @return ResponseEntity with HTTP 200 OK and an empty body
     */
    @PostMapping(path = "/{shoutId}/unShout")
    public ResponseEntity<Void> unShoutTheShout(@PathVariable UUID shoutId,
            @RequestAttribute UUID userId) {
        shoutService.unShoutTheShout(shoutId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Quotes an existing shout by creating a new one linked to it.
     *
     * @param shoutId            the ID of the original shout being quoted
     * @param userId             the ID of the authenticated quoting user
     * @param createShoutRequest the quote payload wrapper
     * @return ResponseEntity with HTTP 200 OK and an empty body
     */
    @PostMapping(path = "/{shoutId}/quote")
    public ResponseEntity<Void> quoteTheShout(@PathVariable UUID shoutId,
            @RequestAttribute UUID userId,
            @RequestBody CreateShoutRequest createShoutRequest) {
        shoutService.quoteTheShout(shoutId, userId, createShoutRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Removes an existing quote on a shout.
     *
     * @param shoutId the ID of the quoted shout relationship
     * @param userId  the ID of the authenticated quoting user
     * @return ResponseEntity with HTTP 200 OK and an empty body
     */
    @PostMapping(path = "/{shoutId}/unQuote")
    public ResponseEntity<Void> unQuoteTheShout(@PathVariable UUID shoutId,
            @RequestAttribute UUID userId) {
        shoutService.unQuoteTheShout(shoutId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
