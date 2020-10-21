import React, { useEffect, useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

// Material UI components
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputBase from "@material-ui/core/InputBase";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import SearchIcon from "@material-ui/icons/Search";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";

// Icons
import ClearIcon from "@material-ui/icons/Clear";

// Custom components
import ErrorBoundary from "../components/ErrorBoundary";
import SuspenseLoading from "../components/SuspenseLoading";

// Other components
import ReactSwipe from "react-swipe";

// Pages
import Post from "../components/Post";

// Utils
import useInfinite from "../utils/use-infinite";
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";
import { setHomeTabIndex } from "../actions/home-tab-actions";
import isEmpty from "validator/lib/isEmpty";

// Actions
import {
  setSearchTab,
  setSearchTerm,
  setSearchedTags,
  setSearchedUsers,
} from "../actions/search-actions";

const useStyles = makeStyles((theme) => ({
  root: { paddingTop: theme.spacing(6) },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  clearIcon: {
    margin: theme.spacing(0, 2),
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function SearchWrapper() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBottomNavigationIndex(1));
  }, [dispatch]);

  return (
    <ErrorBoundary
      fallback={
        <Typography variant="caption">
          An error occurred, please try again!
        </Typography>
      }
    >
      <SuspenseLoading>
        <Search />
      </SuspenseLoading>
    </ErrorBoundary>
  );
}

function Search() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { searchTerm, searchedTags, searchedUsers, searchTab } = useSelector(
    (state) => state.search
  );

  const tabChange = (_, newValue) => {
    dispatch(setSearchTab(newValue));
  };

  const updateSearchTerm = (newTerm) => {
    dispatch(setSearchTerm(newTerm));
  };

  return (
    <Container maxWidth="sm" className={classes.root}>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          value={searchTerm}
          onChange={(e) => {
            updateSearchTerm(e.target.value);
          }}
          endAdornment={
            !isEmpty(searchTerm, { ignore_whitespace: true }) ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    updateSearchTerm("");
                  }}
                  className={classes.clearIcon}
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : undefined
          }
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
        />
      </div>
      <Tabs
        value={searchTab}
        onChange={tabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Users" />
        <Tab label="Tags" />
      </Tabs>
      <List>
        <ListItemLink>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText primary="@nelson" />
        </ListItemLink>
        <ListItemLink>
          <ListItemAvatar>
            <Avatar src={`${process.env.PUBLIC_URL}/ChickenWing.jpeg`} />
          </ListItemAvatar>
          <ListItemText primary="@nelson" />
        </ListItemLink>
        <ListItemLink>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText primary="@nelson" />
        </ListItemLink>
      </List>
    </Container>
  );
}

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}
