import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core";

// Material UI components
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

// Icons
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import HomeIcon from "@material-ui/icons/Home";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: 0,
    zIndex: theme.zIndex.modal,
    width: "fit-content",
  },
}));

export default function BackButton() {
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const history = useHistory();
  const [isShowBack, setIsShowBack] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unlisten = history.listen(() => {
      setIsShowBack(true);
    });

    return () => {
      unlisten();
    };
  }, [history]);

  return (
    <Grid container className={classes.root}>
      {isShowBack && (
        <Grid item>
          <IconButton
            onClick={() => {
              history.goBack();
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Grid>
      )}
      {!user && location.pathname !== "/" && (
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
