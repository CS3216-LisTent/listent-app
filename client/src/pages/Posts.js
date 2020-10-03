import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

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

// Utils
import { setHomeTabIndex } from "../actions/home-tab-actions";

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

export default function Posts() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const tabIndex = useSelector((store) => store.homeTab.index);

  const handleChange = (_, newValue) => {
    dispatch(setHomeTabIndex(newValue));
  };

  return (
    <div className={classes.root}>
      <Tabs
        onChange={handleChange}
        className={classes.tabs}
        value={tabIndex}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Feed" />
        <Tab label="Discover" />
      </Tabs>
      <Post imageUrl={`${process.env.PUBLIC_URL}/ChickenWing.jpeg`} />
    </div>
  );
}
