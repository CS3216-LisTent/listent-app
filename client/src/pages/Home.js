import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

// Material UI components
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

// Pages
import Post from "../components/Post";

// Utils
import { setHomeTabIndex } from "../actions/home-tab-actions";
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";

const useStyles = makeStyles({
  root: {
    height: "calc(100vh - 56px)",
  },
  tabs: {
    position: "fixed",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
  },
});

export default function Home() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const tabIndex = useSelector((store) => store.homeTab.index);

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
      <Post imageUrl={`${process.env.PUBLIC_URL}/ChickenWing.jpeg`} />
    </div>
  );
}
