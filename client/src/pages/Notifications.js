import React, { useEffect, useState } from "react";
import axios from "axios";
import clsx from "clsx";
import isEmpty from "validator/lib/isEmpty";
import { makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Prompt } from "react-router-dom";

// Material UI components
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

// Icons
import DeleteIcon from "@material-ui/icons/Delete";

// Custom components
import AudioRecorder from "../components/AudioRecorder";
import Can from "../components/Can";
import GreenButton from "../components/GreenButton";

// Custom components
import StandAloneAudioPlayer from "../components/StandAloneAudioPlayer";
import LoadingBackdrop from "../components/LoadingBackdrop";

// Actions
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";
import { openSnackbar } from "../actions/snackbar-actions";
import { openAlert } from "../actions/alert-actions";

// Utils
import { newPostErrors } from "../utils/validators";
const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(6),
  },
}));

export default function Notifications() {
  const classes = useStyles();
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setBottomNavigationIndex(3));
  }, [dispatch]);

  return (
    <Container className={classes.root} maxWidth="sm">
      <Typography variant="h5">Notifications</Typography>
    </Container>
  );
}
