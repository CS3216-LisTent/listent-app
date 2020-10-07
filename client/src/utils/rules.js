function usernameCheck({ username, owner }) {
  if (!username || !owner) {
    return false;
  }
  return username === owner;
}

export default rules = {
  visitor: {
    static: ["posts:read", "discover:read", "profile:read", "comments:read"],
  },
  user: {
    static: [
      "posts:read",
      "posts:like",
      "posts:create",
      "discover:read",
      "feed:read",
      "profile:read",
      "comments:read",
      "comments:create",
    ],
    dynamic: {
      "any:update": usernameCheck,
      "any:delete": usernameCheck,
    },
  },
};
