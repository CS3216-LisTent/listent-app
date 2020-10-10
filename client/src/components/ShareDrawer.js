import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";

// Material UI components
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Icons
import FileCopyIcon from "@material-ui/icons/FileCopy";

// Other utils
import copy from "copy-to-clipboard";

// Custom components
import SingleLineContainer from "./SingleLineContainer";

// Actions
import { openSnackbar } from "../actions/snackbar-actions";

// Share buttons
import {
  FacebookIcon,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TumblrIcon,
  TumblrShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const useStyles = makeStyles((theme) => ({
  root: { overflowX: "hidden", padding: theme.spacing(1) },
  iconRow: { margin: theme.spacing(1, 0) },
  center: { textAlign: "center", width: "100%" },
  copyButton: { borderRadius: "100px" },
}));

export default function ShareDrawer({ isOpen, setIsOpen }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const copyLink = () => {
    copy(window.location.href);
    dispatch(openSnackbar("Link successfully copied!", "success"));
    closeDrawer();
  };

  return (
    <Drawer anchor={"bottom"} open={isOpen} onClose={closeDrawer}>
      <div className={classes.root}>
        <Grid container direction="column" spacing={1}>
          <Grid className={classes.center} item>
            <Typography variant="h6">Share</Typography>
          </Grid>
          <Grid className={classes.center} item>
            <SingleLineContainer
              component={Grid}
              className={classes.center}
              item
            >
              <Typography variant="body">{window.location.href}</Typography>
            </SingleLineContainer>
          </Grid>
          <Grid className={classes.center} item>
            <Button
              startIcon={<FileCopyIcon />}
              className={classes.copyButton}
              variant="outlined"
              onClick={copyLink}
            >
              Copy
            </Button>
          </Grid>
        </Grid>
        <Grid
          container
          justify="space-evenly"
          wrap="nowrap"
          className={classes.iconRow}
        >
          <Grid item xs={3} className={classes.center}>
            <FacebookShareButton
              url={window.location.href}
              onShareWindowClose={closeDrawer}
            >
              <FacebookIcon size={56} round />
            </FacebookShareButton>
          </Grid>
          <Grid item xs={3} className={classes.center}>
            <TwitterShareButton
              url={window.location.href}
              onShareWindowClose={closeDrawer}
            >
              <TwitterIcon size={56} round />
            </TwitterShareButton>
          </Grid>
          <Grid item xs={3} className={classes.center}>
            <WhatsappShareButton
              url={window.location.href}
              onShareWindowClose={closeDrawer}
            >
              <WhatsappIcon size={56} round />
            </WhatsappShareButton>
          </Grid>
          <Grid item xs={3} className={classes.center}>
            <TelegramShareButton
              url={window.location.href}
              onShareWindowClose={closeDrawer}
            >
              <TelegramIcon size={56} round />
            </TelegramShareButton>
          </Grid>
        </Grid>
        <Grid
          container
          justify="space-evenly"
          wrap="nowrap"
          className={classes.iconRow}
        >
          <Grid item xs={3} className={classes.center}>
            <RedditShareButton
              url={window.location.href}
              onShareWindowClose={closeDrawer}
            >
              <RedditIcon size={56} round />
            </RedditShareButton>
          </Grid>
          <Grid item xs={3} className={classes.center}>
            <TumblrShareButton
              url={window.location.href}
              onShareWindowClose={closeDrawer}
            >
              <TumblrIcon size={56} round />
            </TumblrShareButton>
          </Grid>
          <Grid item xs={3} className={classes.center}>
            <LineShareButton
              url={window.location.href}
              onShareWindowClose={closeDrawer}
            >
              <LineIcon size={56} round />
            </LineShareButton>
          </Grid>
          <Grid item xs={3} className={classes.center}>
            <LinkedinShareButton
              url={window.location.href}
              onShareWindowClose={closeDrawer}
            >
              <LinkedinIcon size={56} round />
            </LinkedinShareButton>
          </Grid>
        </Grid>
      </div>
    </Drawer>
  );
}
