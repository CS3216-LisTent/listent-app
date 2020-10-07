import { useSelector } from "react-redux";

// Utils
import rules from "../utils/rules";

const check = (rules, role, action, data) => {
  const permissions = rules[role];
  if (!permissions) {
    // role is not present in the rules
    return false;
  }

  const staticPermissions = permissions.static;

  if (staticPermissions && staticPermissions.includes(action)) {
    // static rule includes action
    return true;
  }

  const dynamicPermissions = permissions.dynamic;

  if (dynamicPermissions) {
    const permissionCondition = dynamicPermissions[action];
    if (!permissionCondition) {
      // dynamic rule not provided for action
      return false;
    }

    return permissionCondition(data);
  }
  return false;
};

export default function Can({ data, perform, yes, no }) {
  const role = useSelector((state) => (state.user ? "user" : "visitor"));
  const username = useSelector((state) => state.user && state.user.username);

  if (check(rules, role, perform, username ? { ...data, username } : data)) {
    return yes ? yes() : null;
  } else {
    return no ? no() : null;
  }
}
