import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinesEllipsis from "react-lines-ellipsis";
import { Link } from "react-router-dom";

// Material UI components
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

// Custom components
import SingleLineContainer from "./SingleLineContainer";

const useStyles = makeStyles({
  root: {
    backgroundImage: ({ imageLink }) =>
      `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
        imageLink ? imageLink : ""
      })`,
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
  titleContainer: {
    textAlign: ({ titleCenter }) => (titleCenter ? "center" : undefined),
  },
  title: ({ titleCenter }) =>
    titleCenter
      ? {
          paddingTop: "calc(50% - 16px)",
        }
      : {},
});

export default function PostCard({
  title,
  description,
  imageLink,
  link,
  titleCenter,
  titleVariant,
}) {
  const classes = useStyles({ imageLink, titleCenter });

  return (
    <Card className={classes.root}>
      <CardActionArea className={classes.cardButton} component={Link} to={link}>
        <CardContent className={classes.content}>
          <div className={classes.titleContainer}>
            <SingleLineContainer
              className={classes.title}
              component={Typography}
              variant={titleVariant || "h6"}
              gutterBottom
            >
              {title}
            </SingleLineContainer>
          </div>
          <LinesEllipsis
            text={description}
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
