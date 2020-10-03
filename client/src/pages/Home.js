import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

// Material UI components
import Container from "@material-ui/core/Container";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";

// Custom components
import AudioDetails from "../components/AudioDetails";
import AudioPlayer from "../components/AudioPlayer";
import Comments from "../components/Comments";
import SingleLineContainer from "../components/SingleLineContainer";

// Pages
import Post from "../components/Post";

const useStyles = makeStyles({
  root: {
    height: "100vh",
  },
  tabs: {
    position: "fixed",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
  },
});

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Tabs
        className={classes.tabs}
        value={0}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Item One" />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
      </Tabs>
      <Post imageUrl={`${process.env.PUBLIC_URL}/ChickenWing.jpeg`} />
    </div>
  );
}
