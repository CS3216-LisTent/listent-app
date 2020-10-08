import Button from "@material-ui/core/Button";
import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
    "&:disabled": {
      backgroundColor: theme.palette.action.disabled,
    },
    color: theme.palette.common.white,
  },
}));

export default function GreenButton({ children, ...rest }) {
  const classes = useStyles();

  return (
    <Button {...rest} className={clsx(rest.className, classes.root)}>
      {children}
    </Button>
  );
}
