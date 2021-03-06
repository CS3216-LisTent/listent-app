import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

// Material UI components
import Badge from "@material-ui/core/Badge";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import NotificationsIcon from "@material-ui/icons/Notifications";

// Icons
import HomeIcon from "@material-ui/icons/Home";
import MicIcon from "@material-ui/icons/Mic";
import PersonIcon from "@material-ui/icons/Person";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    zIndex: theme.zIndex.appBar,
  },
}));

export default function BottomNavigationBar() {
  const classes = useStyles();
  const index = useSelector((state) => state.bottomNavigation.index);
  const user = useSelector((state) => state.user);
  const { searchTerm, searchTab } = useSelector((state) => state.search);
  const { hasNew } = useSelector((state) => state.notifications);
  const history = useHistory();

  return (
    <BottomNavigation
      value={index}
      onChange={(_, newValue) => {
        switch (newValue) {
          case 0:
            history.push("/");
            break;
          case 1:
            history.push(
              `/search/${searchTab === 0 ? "users" : "tags"}/${searchTerm}`
            );
            break;
          case 2:
            history.push("/new");
            break;
          case 3:
            history.push("/notifications");
            break;
          case 4:
            history.push(user ? `/${user.username}` : `/register`);
            break;
          default:
          // placeholder
        }
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="Home" icon={<HomeIcon />} />
      <BottomNavigationAction label="Search" icon={<SearchIcon />} />
      <BottomNavigationAction label="Record" icon={<MicIcon />} />
      {user && (
        <BottomNavigationAction
          label="Notifications"
          icon={
            <Badge
              color="secondary"
              variant="dot"
              overlap="circle"
              invisible={!hasNew}
            >
              <NotificationsIcon />
            </Badge>
          }
        />
      )}
      {user ? (
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
      ) : (
        <BottomNavigationAction label="Register" icon={<ExitToAppIcon />} />
      )}
    </BottomNavigation>
  );
}
