import React, { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

// Material UI components
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

// Other components
import ReactSwipe from "react-swipe";

// Pages
import Post from "../components/Post";

// Utils
import { setHomeTabIndex } from "../actions/home-tab-actions";
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";

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
  swipeContainer: {
    height: "100%",
    "& > div": {
      height: "100%",
    },
  },
}));

const POSTS = [
  <Post imageUrl={`${process.env.PUBLIC_URL}/ChickenWing.jpeg`} />,
  <Post imageUrl={`${process.env.PUBLIC_URL}/logo512.png`} />,
  <Post imageUrl={`${process.env.PUBLIC_URL}/ChickenWing.jpeg`} />,
];

export default function Home() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const tabIndex = useSelector((state) => state.homeTab.index);
  const swipeRef = useRef(null);

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
      <ReactSwipe
        swipeOptions={{ continuous: false }}
        ref={swipeRef}
        className={classes.swipeContainer}
      >
        {POSTS.map((p, i) => (
          <div style={{ height: "100%" }} key={i}>
            {p}
          </div>
        ))}
      </ReactSwipe>
    </div>
  );
}
