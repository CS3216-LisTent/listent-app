import clsx from "clsx";
import { createElement } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

export default function SingleLineContainer({
  component,
  className,
  children,
  ...rest
}) {
  const classes = useStyles();

  return createElement(
    component ? component : "div",
    { className: clsx(classes.root, className), ...rest },
    children
  );
}
