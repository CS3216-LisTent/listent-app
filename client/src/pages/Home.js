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
    height: (isLoggedIn) => (isLoggedIn ? "calc(100vh - 56px)" : "100vh"),
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

export default function Home() {
  const dispatch = useDispatch();
  const tabIndex = useSelector((state) => state.homeTab.index);
  const isLoggedIn = useSelector((state) => !!state.user);
  const classes = useStyles(isLoggedIn);
  const swipeRef = useRef(null);

  const one = useRef(null);
  const two = useRef(null);
  const three = useRef(null);

  const POSTS = [
    <Post
      audioRef={one}
      next={() => swipeRef.current.next()}
      previous={() => swipeRef.current.prev()}
      imageUrl={`${process.env.PUBLIC_URL}/ChickenWing.jpeg`}
    />,
    <Post
      next={() => swipeRef.current.next()}
      previous={() => swipeRef.current.prev()}
      audioRef={two}
      imageUrl={`${process.env.PUBLIC_URL}/logo512.png`}
    />,
    <Post
      next={() => swipeRef.current.next()}
      previous={() => swipeRef.current.prev()}
      audioRef={three}
      imageUrl={`${process.env.PUBLIC_URL}/ChickenWing.jpeg`}
    />,
  ];

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
        swipeOptions={{
          continuous: false,
          callback: (index) => {
            if (index === 0) {
              two.current.pause();
              three.current.pause();
              one.current.play();
            } else if (index === 1) {
              one.current.pause();
              three.current.pause();
              two.current.play();
            } else {
              two.current.pause();
              one.current.pause();
              three.current.play();
            }
          },
        }}
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
