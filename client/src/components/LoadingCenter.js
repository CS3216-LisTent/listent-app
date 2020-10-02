import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    left: "calc(50% - 20px)",
    top: "calc(50% - 20px)",
    zIndex: theme.zIndex.mobileStepper,
  },
}));
export default function LoadingCenter(props) {
  const classes = useStyles();

  return <CircularProgress {...props} className={classes.root} />;
}
