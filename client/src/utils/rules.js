function usernameCheck({ username, owner }) {
  if (!username || !owner) {
    return false;
  }
  return username === owner;
}

const rules = {
  visitor: {
    static: ["posts:read", "discover:read", "profile:read", "comments:read"],
  },
  user: {
    static: [
      "bottom-navigation:read",
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
      "user:update": usernameCheck,
      "user:view_follow_button": ({ username, profile }) => {
        if (!username || !profile) {
          return false;
        }
        return username !== profile;
      },
      "user:follow": ({ canFollow }) => canFollow,
    },
  },
};

export default rules;
