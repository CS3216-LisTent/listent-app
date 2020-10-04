import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinesEllipsis from "react-lines-ellipsis";

// Material UI components
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

// Custom components
import SingleLineContainer from "./SingleLineContainer";

const useStyles = makeStyles({
  root: {
    backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${process.env.PUBLIC_URL}/ChickenWing.jpeg)`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    height: 0,
    paddingTop: "100%",
    position: "relative",
  },
  cardButton: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
  },
  content: {
    position: "absolute",
    top: 0,
    width: "100%",
  },
});

export default function PostCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea className={classes.cardButton}>
        <CardContent className={classes.content}>
          <SingleLineContainer component={Typography} variant="h6" gutterBottom>
            Pouring Rain Long Title
          </SingleLineContainer>
          <LinesEllipsis
            text="Have u ever had your heart broken and started to recall all the bad memory everytime it started to drizzle?? #story #rain #humor #sadboy #brokenheart #moveon"
            maxLine="3"
            ellipsis="..."
            trimRight
            basedOn="letters"
            component={Typography}
            variant="body2"
            color="textSecondary"
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
