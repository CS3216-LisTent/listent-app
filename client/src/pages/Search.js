import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams, Link } from "react-router-dom";

// Material UI components
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
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
import InfiniteScroll from "../components/InfiniteScroll";

// Utils
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";
import isEmpty from "validator/lib/isEmpty";

// Actions
import { setSearchTab, setSearchTerm } from "../actions/search-actions";

const useStyles = makeStyles((theme) => ({
  root: { paddingTop: theme.spacing(6) },
  pageContainer: {
    height: `calc(100vh - ${theme.spacing(13)}px)`,
  },
  tabs: {
    marginBottom: theme.spacing(1),
  },
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
    width: "100%",
  },
  errorContainer: {
    padding: theme.spacing(1, 0),
    textAlign: "center",
  },
  resultsContainer: {
    overflowY: "scroll",
  },
}));

export default function SearchWrapper() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBottomNavigationIndex(1));
  }, [dispatch]);
  const { searchTerm, searchTab } = useSelector((state) => state.search);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { section, query } = useParams();

  useEffect(() => {
    if (isFirstLoad) {
      if (query !== undefined) {
        dispatch(setSearchTerm(query));
      } else {
        dispatch(setSearchTerm(""));
      }
      setIsFirstLoad(false);
    }

    if (section === "users") {
      dispatch(setSearchTab(0));
    } else {
      dispatch(setSearchTab(1));
    }
  }, [dispatch, query, searchTab, searchTerm, section, isFirstLoad]);

  return <Search />;
}

function Search() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const { searchTerm, searchTab } = useSelector((state) => state.search);

  const tabChange = (_, newValue) => {
    history.push(`/search/${newValue === 0 ? "users" : "tags"}/${searchTerm}`);
  };

  const updateSearchTerm = (newTerm) => {
    dispatch(setSearchTerm(newTerm));
  };

  const { query, section } = useParams();
  const onSearch = (e) => {
    e.preventDefault();
    history.push(`/search/${section}/${searchTerm}`);
  };

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Grid
        container
        direction="column"
        className={classes.pageContainer}
        wrap="nowrap"
      >
        <Grid item>
          <form onSubmit={onSearch}>
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
          </form>
          <Tabs
            className={classes.tabs}
            value={searchTab}
            onChange={tabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Users" />
            <Tab label="Tags" />
          </Tabs>
        </Grid>

        <Grid item className={classes.resultsContainer}>
          <ErrorBoundary
            fallback={
              <div className={classes.errorContainer}>
                <Typography variant="caption">
                  An error occurred. Please refresh and try again.
                </Typography>
              </div>
            }
          >
            <SuspenseLoading>
              <InfiniteScroll
                pageSize={10}
                component={List}
                apiPath={`/api/v1/users/search?q=${query || ""}&`}
                noEntriesText={
                  <Typography variant="caption">No results found</Typography>
                }
              >
                {(data) => {
                  return data.map((page) =>
                    page.map((result, i) => {
                      return (
                        <ListItemLink key={i} to={`/${result._id}`}>
                          <ListItemAvatar>
                            <Avatar src={result.picture} />
                          </ListItemAvatar>
                          <ListItemText primary={`@${result._id}`} />
                        </ListItemLink>
                      );
                    })
                  );
                }}
              </InfiniteScroll>
            </SuspenseLoading>
          </ErrorBoundary>
        </Grid>
      </Grid>
    </Container>
  );
}

function ListItemLink(props) {
  return <ListItem component={Link} button {...props} />;
}
