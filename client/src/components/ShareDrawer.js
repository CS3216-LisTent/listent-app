import React, { useEffect, useState } from "react";
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
import { isMobile } from "../utils/general-utils";

// Actions
import { openSnackbar } from "../actions/snackbar-actions";

// Share buttons
import {
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const useStyles = makeStyles((theme) => ({
  root: { overflowX: "hidden", padding: theme.spacing(1) },
  iconRow: { margin: theme.spacing(1, 0) },
  center: { textAlign: "center" },
  link: { wordBreak: "break-all" },
  copyButton: { borderRadius: "100px" },
}));

export default function ShareDrawer({ isOpen, setIsOpen, postId }) {
  const link = `${window.location.origin}/post/${postId}`;
  const classes = useStyles();
  const dispatch = useDispatch();

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const copyLink = () => {
    copy(link);
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
          <Grid item className={classes.center}>
            <Typography className={classes.link} variant="body2">
              {link}
            </Typography>
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
            <FacebookShareButton url={link} onShareWindowClose={closeDrawer}>
              <FacebookIcon size={56} round />
            </FacebookShareButton>
          </Grid>
          <Grid item xs={3} className={classes.center}>
            <MessengerShareButton
              url={link}
              onShareWindowClose={closeDrawer}
              size={56}
            />
          </Grid>
          <Grid item xs={3} className={classes.center}>
            <TwitterShareButton url={link} onShareWindowClose={closeDrawer}>
              <TwitterIcon size={56} round />
            </TwitterShareButton>
          </Grid>
          <Grid item xs={3} className={classes.center}>
            <LinkedinShareButton url={link} onShareWindowClose={closeDrawer}>
              <LinkedinIcon size={56} round />
            </LinkedinShareButton>
          </Grid>
        </Grid>
        <Grid
          container
          justify="space-evenly"
          wrap="nowrap"
          className={classes.iconRow}
        >
          <Grid item xs={3} className={classes.center}>
            <WhatsappShareButton url={link} onShareWindowClose={closeDrawer}>
              <WhatsappIcon size={56} round />
            </WhatsappShareButton>
          </Grid>
          <Grid item xs={3} className={classes.center}>
            <TelegramShareButton url={link} onShareWindowClose={closeDrawer}>
              <TelegramIcon size={56} round />
            </TelegramShareButton>
          </Grid>
          <Grid item xs={3} className={classes.center}>
            <RedditShareButton url={link} onShareWindowClose={closeDrawer}>
              <RedditIcon size={56} round />
            </RedditShareButton>
          </Grid>
          <Grid item xs={3} className={classes.center}>
            <LineShareButton url={link} onShareWindowClose={closeDrawer}>
              <LineIcon size={56} round />
            </LineShareButton>
          </Grid>
        </Grid>
      </div>
    </Drawer>
  );
}

function MessengerShareButton({ url, size, onShareWindowClose }) {
  const APP_ID = "521270401588372";
  const [openWindow, setOpenWindow] = useState(null);
  useEffect(() => {
    if (openWindow) {
      const timer = setInterval(() => {
        if (openWindow && openWindow.closed) {
          clearInterval(timer);
          onShareWindowClose();
        }
      }, 500);

      return () => {
        clearInterval(timer);
      };
    }
  }, [openWindow, onShareWindowClose]);

  const messengerOnClick = (event) => {
    if (isMobile()) {
      setOpenWindow(
        window.open(
          "fb-messenger://share?link=" +
            encodeURIComponent(url) +
            "&app_id=" +
            encodeURIComponent(APP_ID)
        )
      );
    } else {
      setOpenWindow(
        window.open(
          `https://www.facebook.com/dialog/send?app_id=${encodeURIComponent(
            APP_ID
          )}&redirect_uri=${encodeURIComponent(url)}&link=${encodeURIComponent(
            url
          )}`
        )
      );
    }
  };

  return (
    <button
      onClick={messengerOnClick}
      style={{
        backgroundColor: "transparent",
        border: "none",
        font: "inherit",
        color: "inherit",
        cursor: "pointer",
      }}
    >
      <FacebookMessengerIcon size={size} round />
    </button>
  );
}
