import React from "react";
import { Link } from "react-router-dom";

// Material UI components
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";

// Custom components
import FollowButton from "../components/FollowButton";

export default function UserListItem({ user }) {
  return (
    <ListItemLink to={`/${user._id}`}>
      <ListItemAvatar>
        <Avatar src={user.picture} />
      </ListItemAvatar>
      <ListItemText primary={`@${user._id}`} />
      <ListItemSecondaryAction>
        <FollowButton size="small" username={user._id} />
      </ListItemSecondaryAction>
    </ListItemLink>
  );
}

function ListItemLink(props) {
  return <ListItem component={Link} button {...props} />;
}
