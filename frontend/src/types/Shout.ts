

export interface ShoutCommentInfo {
  commentedShoutId: string;
  commentedShoutUsername: string;
}

export interface ShoutQuote {
  quotedShoutId: string;
  name: string;
  username: string;
  avatar: string;
  text: string;
  createdAt: string;
  images: string[];
}

/** A single shout entry with nested metrics and references. */
export interface Shout {
  id: string;
  name: string;
  username: string;
  avatar: string;
  text: string;
  images: string[];
  createdAt: string;
  variant: 'DEFAULT' | 'COMMENT';
  
  likesCount: number;
  reShoutsCount: number,
  commentsCount: number,

  commentDto?: ShoutCommentInfo;
  quoteDto?: ShoutQuote;

  userLikingTheShout: boolean;
  userReShoutingTheShout: boolean;
}