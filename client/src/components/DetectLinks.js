import React from "react";
import Linkify from "react-linkify";
import { useTheme } from "@material-ui/core/styles";

export default function DetectLinks({ children, isOpenSameTab }) {
  const theme = useTheme();

  return (
    <Linkify
      properties={{
        style: { color: theme.palette.primary.main },
        target: isOpenSameTab ? undefined : "_blank",
      }}
    >
      {children}
    </Linkify>
  );
}
