/** Shape of a user entry used in the placeholder / dummy data list. */
interface TwitterUser {
  avatar: string;
  name: string;
  username: string;
  bio: string;
  isPrivate?: boolean; // Optionales Feld für das Schloss-Icon
}

/** Static placeholder users used to populate UI during development before real data is available. */
export const twitterUsers: TwitterUser[] = [
  {
    avatar: "user-avatar_yr4qhg",
    name: "Cantarzo",
    username: "@Cantarzo__",
    bio: "Addicted to Desintegration by The Cure"
  },
  {
    avatar: "user-avatar_yr4qhg",
    name: "Susanna .Abbott",
    username: "@cruz_vane...",
    bio: "diaria de 100€ a 400€ diaria de 100€ a 400€diaria de 100€ a 400€"
  },
  {
    avatar: "user-avatar_yr4qhg",
    name: "Santy",
    username: "@EL_FIGUE",
    bio: "",
    isPrivate: true
  }
];