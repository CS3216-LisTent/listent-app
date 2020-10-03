import React from "react";
import { makeStyles } from "@material-ui/core/styles";

// Material UI components
import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Custom components
import SingleLineContainer from "./SingleLineContainer";

const useStyles = makeStyles({});

export default function AudioDetails({ isMinimized }) {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid container item xs={12} spacing={1} wrap="nowrap">
        <Grid item xs={2}>
          <Avatar
            alt="username"
            src={`${process.env.PUBLIC_URL}/ChickenWing.jpeg`}
          />
        </Grid>
        <Grid container item xs={10}>
          <SingleLineContainer component={Grid} item xs={12}>
            <Typography className={classes.username} variant="caption">
              @therealradityarikatherealradityarikatherealradityarikatherealradityarikatherealradityarikatherealradityarikatherealradityarikatherealradityarikatherealradityarikatherealradityarikatherealradityarikatherealradityarikatherealradityarikatherealradityarika
            </Typography>
          </SingleLineContainer>
          <Grid item xs={12}>
            <Typography variant="caption">2h ago</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Collapse in={!isMinimized} timeout={1000}>
        <Grid item>
          <Typography variant="caption">
            Have u ever had your heart broken and started to recall all the bad
            memory everytime it started to drizzle?? #story #rain #humor #sadboy
            #brokenheart #moveon
          </Typography>
        </Grid>
      </Collapse>
    </Grid>
  );
}
