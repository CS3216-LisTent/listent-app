import React, { useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import {
  setAudioRef,
  incPostIndex,
  decPostIndex,
} from "../actions/audio-actions";

export default function RootPlayer() {
  const dispatch = useDispatch();
  const { posts, index, swipeRef, src } = useSelector((state) => state.audio);
  const audioRef = useRef(null);
  const isRender =
    src ||
    (posts[index] !== undefined && posts[index].audio_link !== undefined);

  useEffect(() => {
    dispatch(setAudioRef(audioRef));

    const audio = audioRef.current;

    const endedEvent = () => {
      if (swipeRef.current) {
        // Let swipe.js handle next event
        swipeRef.current.next();
      } else {
        dispatch(incPostIndex());
      }
    };

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
      audio.addEventListener("ended", endedEvent);
      audio.addEventListener("play", increaseViewCount);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("ended", endedEvent);
        audio.removeEventListener("play", increaseViewCount);
      }
    };
  }, [isRender, dispatch, index, posts, swipeRef]);

  useEffect(() => {
    // Autoplay if is not first song
    if (index !== 0) {
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
        [
          "previoustrack",
          () => {
            dispatch(decPostIndex());
          },
        ],
        [
          "nexttrack",
          () => {
            dispatch(incPostIndex());
          },
        ],
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
  }, [index, dispatch, isRender, posts]);

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
