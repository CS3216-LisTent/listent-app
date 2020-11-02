import axios from "axios";
import jwt_decode from "jwt-decode";

import setAuthToken from "../utils/set-auth-token";
import { SET_USER, SET_FOLLOW } from "./types";
import { setHomeTabIndex } from "./home-tab-actions";

export const setUser = (jwtString) => {
  if (!jwtString) {
    return {
      type: SET_USER,
      payload: {},
    };
  }

  setAuthToken(jwtString);
  const decoded = jwt_decode(jwtString);
  const username = decoded["sub"].split("|")[1];

  return {
    type: SET_USER,
    payload: { ...decoded, username },
  };
};

export const setAdditionalPayloads = (username) => (dispatch) => {
  axios
    .get(`/api/v1/users/${username}`)
    .then((res) => {
      const data = res.data.data;

      // Set home tab
      if (data.number_of_following > 0) {
        // Default tab is feed
        dispatch(setHomeTabIndex(0));
      } else {
        dispatch(setHomeTabIndex(1));
      }

      // Set followers and followings as a hash table
      const followers = data.followers.reduce((acc, curr) => {
        acc[curr.username] = true;
        return acc;
      }, {});
      const followings = data.followings.reduce((acc, curr) => {
        acc[curr.username] = true;
        return acc;
      }, {});

      dispatch({
        type: SET_FOLLOW,
        payload: { followers, followings },
      });
    })
    .catch(() => {
      dispatch(setHomeTabIndex(1));
    });
};

export const addFollowings = (newFollow) => (dispatch, getState) => {
  const followings = getState().user.followings;

  dispatch({
    type: SET_FOLLOW,
    payload: { followings: { ...followings, [newFollow]: true } },
  });
};

export const removeFollowings = (unfollowed) => (dispatch, getState) => {
  let followings = getState().user.followings;
  delete followings[unfollowed];

  dispatch({
    type: SET_FOLLOW,
    payload: { followings },
  });
};

export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwt");
  sessionStorage.removeItem("jwt");

  // Remove auth header for future requests
  setAuthToken(false);

  // Set current user to empty object
  dispatch(setUser(false));
  window.location.href = "/login";
};
