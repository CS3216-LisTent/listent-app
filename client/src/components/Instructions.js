import React from "react";
import { useTheme } from "@material-ui/core/styles";
import Joyride, { STATUS } from "react-joyride";

export default function Instructions({ run }) {
  const theme = useTheme();

  const steps = [
    {
      target: "body",
      content: "Welcome to LisTent!",
      disableBeacon: true,
      placement: "center",
    },
    {
      target: "#audio-next",
      content: "Click here to go to the next post. You can swipe right too!",
    },
    {
      target: "#audio-previous",
      content: "Click here to go to the previous post. You can swipe left too!",
    },
    {
      target: "body",
      content: "That is all! Hope you enjoy the app :)",
      placement: "center",
      locale: {
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        open: "Open the dialog",
      },
    },
  ];

  const finishCallback = (data) => {
    const { status } = data;
    if (status === STATUS.FINISHED) {
      window.localStorage.setItem("hasSeenIntro", "true");
    }
  };

  return (
    <Joyride
      callback={finishCallback}
      disableCloseOnEsc
      styles={{
        options: {
          arrowColor: theme.palette.primary.main,
          backgroundColor: theme.palette.background.default,
          overlayColor: "rgba(0, 0, 0, 0.4)",
          primaryColor: theme.palette.primary.main,
          textColor: theme.palette.text.primary,
          width: 900,
          zIndex: 1000,
        },
      }}
      steps={steps}
      disableOverlayClose
      run={window.localStorage.getItem("hasSeenIntro") !== "true" && run}
      continuous={true}
    />
  );
}
