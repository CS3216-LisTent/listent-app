import React, { useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import useInfinite from "../utils/use-infinite";

import {
  setAudioRef,
  incPostIndex,
  decPostIndex,
  setPosts,
  setEmpty,
} from "../actions/audio-actions";

const PAGE_SIZE = 3;

export default function RootPlayer() {
  const dispatch = useDispatch();
  const { posts, index, swipeRef, src, apiPath } = useSelector(
    (state) => state.audio
  );

  const { data, size, setSize, isEmpty } = useInfinite(
    !src && apiPath,
    PAGE_SIZE
  );

  useEffect(() => {
    if (data?.[0]?.length > 0) {
      dispatch(setPosts(data.flat()));
    }
  }, [data, dispatch]);

  useEffect(() => {
    dispatch(setEmpty(isEmpty));
  }, [isEmpty, dispatch]);

  const next = useCallback(() => {
    if (index + 2 === posts.length) {
      // Load more if next is last (this is before going to next, but going to go next already, thus index + 2)
      setSize(size + 1);
    }

    if (swipeRef && swipeRef.current) {
      // Let swipe.js handle next event
      swipeRef.current.next();
    } else {
      dispatch(incPostIndex());
    }
  }, [index, dispatch, posts.length, setSize, size, swipeRef]);

  const prev = useCallback(() => {
    if (swipeRef && swipeRef.current) {
      // Let swipe.js handle next event
      swipeRef.current.prev();
    } else {
      dispatch(decPostIndex());
    }
  }, [dispatch, swipeRef]);

  const audioRef = useRef(null);
  const isRender =
    src ||
    (posts[index] !== undefined && posts[index].audio_link !== undefined);

  useEffect(() => {
    dispatch(setAudioRef(audioRef));

    const audio = audioRef.current;

    const increaseViewCount = () => {
      if (!src) {
        const postId = posts[index]._id;
        if (postId) {
          // Increase view count
          axios.post(
            `/api/v1/posts/${postId}/inc-view-count`,
            JSON.stringify({ number: 1 })
          );
        }
      }
    };

    if (isRender && audio) {
      audio.addEventListener("ended", next);
      audio.addEventListener("play", increaseViewCount);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("ended", next);
        audio.removeEventListener("play", increaseViewCount);
      }
    };
  }, [isRender, dispatch, index, posts, swipeRef, src, next, prev]);

  useEffect(() => {
    // Autoplay if is not first song
    if (index !== 0 && audioRef.current) {
      audioRef.current.play();
    }

    if (!src && isRender && "mediaSession" in navigator) {
      const { title, image_link, username } = posts[index];
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: title,
        artist: username,
        artwork: [
          {
            src: image_link,
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: image_link,
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: image_link,
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: image_link,
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: image_link,
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: image_link,
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });

      const actionHandlers = [
        ["previoustrack", prev],
        ["nexttrack", next],
      ];

      if (window.navigator.mediaSession?.setPositionState) {
        window.navigator.mediaSession.setPositionState(null);
      }

      for (const [action, handler] of actionHandlers) {
        try {
          navigator.mediaSession.setActionHandler(action, handler);
        } catch (error) {
          console.log(
            `The media session action "${action}" is not supported yet.`
          );
        }
      }
    }
  }, [index, dispatch, isRender, posts, src, swipeRef, next, prev]);

  if (!isRender) {
    return null;
  }

  return (
    <audio
      preload="metadata"
      ref={audioRef}
      src={src || posts[index].audio_link}
      // controls
    >
      Your browser does not support the
      <code>audio</code> element.
    </audio>
  );
}
