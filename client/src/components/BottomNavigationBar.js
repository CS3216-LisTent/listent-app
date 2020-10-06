import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

// Material UI components
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

// Icons
import HomeIcon from "@material-ui/icons/Home";
import MicIcon from "@material-ui/icons/Mic";
import PersonIcon from "@material-ui/icons/Person";

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
            history.push("/new");
            break;
          case 2:
            history.push("/profile");
            break;
          default:
          // placeholder
        }
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="Home" icon={<HomeIcon />} />
      <BottomNavigationAction label="Record" icon={<MicIcon />} />
      <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
    </BottomNavigation>
  );
}
