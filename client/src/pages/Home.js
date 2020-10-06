import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

// Material UI components
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

// Other components
import SwipeableViews from "react-swipeable-views";

// Pages
import Post from "../components/Post";

// Utils
import { setHomeTabIndex } from "../actions/home-tab-actions";
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";

import AudioPlayer from "../components/AudioPlayer";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "calc(100vh - 56px)",
  },
  tabs: {
    position: "fixed",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
    zIndex: theme.zIndex.appBar,
  },
}));

const POSTS = [
  <Post key={0} imageUrl={`${process.env.PUBLIC_URL}/ChickenWing.jpeg`} />,
  <Post key={1} imageUrl={`${process.env.PUBLIC_URL}/logo512.png`} />,
  <Post key={2} imageUrl={`${process.env.PUBLIC_URL}/ChickenWing.jpeg`} />,
];

export default function Home() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const tabIndex = useSelector((state) => state.homeTab.index);

  useEffect(() => {
    dispatch(setBottomNavigationIndex(0));
  }, [dispatch]);

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
      <SwipeableViews>
        {POSTS}
      </SwipeableViews>
    </div>
  );
}
