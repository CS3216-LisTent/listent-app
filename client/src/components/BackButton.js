import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";

// Material UI components
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

// Icons
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import HomeIcon from "@material-ui/icons/Home";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    top: 0,
    zIndex: theme.zIndex.modal,
  },
}));

export default function BackButton() {
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const history = useHistory();

  return (
    <Grid container className={classes.root}>
      <Grid item>
        <IconButton
          onClick={() => {
            history.goBack();
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Grid>
      {!user && (
        <Grid item>
          <IconButton
            onClick={() => {
              history.push("/");
            }}
          >
            <HomeIcon />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
}
