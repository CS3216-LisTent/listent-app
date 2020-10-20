import React from "react";
import Linkify from "react-linkify";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  linkColor: { color: theme.palette.primary.main },
}));

export default function DetectLinks({ className, children, isOpenSameTab }) {
  const classes = useStyles();

  const componentDecorator = (href, text, key) => {
    return (
      <a
        className={clsx(classes.linkColor, className)}
        href={href}
        key={key}
        target={isOpenSameTab ? undefined : "_blank"}
        rel={isOpenSameTab ? undefined : "noopener noreferrer"}
      >
        {text}
      </a>
    );
  };

  return <Linkify componentDecorator={componentDecorator}>{children}</Linkify>;
}
