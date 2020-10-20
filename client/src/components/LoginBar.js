import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

// Material UI components
import BottomNavigation from "@material-ui/core/BottomNavigation";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    zIndex: theme.zIndex.appBar,
  },
  button: {
    margin: theme.spacing(1),
    width: theme.spacing(13),
    borderRadius: "100px",
  },
  homeButton: {
    position: "fixed",
    top: theme.spacing(1),
    left: theme.spacing(1),
  },
  caption: {
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: theme.spacing(1),
  },
}));

export default function BottomNavigationBar() {
  const classes = useStyles();

  return (
    <BottomNavigation className={classes.root}>
      <Typography variant="caption" className={classes.caption}>
        Join LisTent today to enjoy and share more audio content!
      </Typography>
      <Button
        component={Link}
        to="/login"
        className={classes.button}
        variant="contained"
        color="primary"
      >
        Login
      </Button>
      <Button
        component={Link}
        to="/register"
        className={classes.button}
        variant="contained"
        color="secondary"
      >
        Register
      </Button>
    </BottomNavigation>
  );
}
