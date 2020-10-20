import React from "react";

// Material UI components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// Redux
import { useSelector } from "react-redux";

export default function Alert() {
  const {
    isOpen,
    title,
    description,
    rightText,
    rightCallback,
    leftText,
    leftCallback,
  } = useSelector((state) => state.alert);

  return (
    <Dialog open={isOpen}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {leftText && (
          <Button onClick={leftCallback} color="primary">
            {leftText}
          </Button>
        )}
        <Button color="primary" autoFocus onClick={rightCallback}>
          {rightText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
