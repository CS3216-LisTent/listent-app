import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.success.main,
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
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
