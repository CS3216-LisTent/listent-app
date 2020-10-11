import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

// Material UI components
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import EditIcon from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  image: {
    height: theme.spacing(15),
    width: theme.spacing(15),
    boxShadow: theme.shadows[1],
  },
  editPictureButton: {
    boxShadow: theme.shadows[24],
    backgroundColor: theme.palette.secondary.main + "!important",
  },
  editPictureInput: {
    display: "none",
  },
}));

export default function ImageUpload({ initialImage, setImageBlob }) {
  const [image, setCurrImage] = useState(initialImage);

  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12}>
        <Badge
          overlap="circle"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          badgeContent={
            <>
              <input
                accept="image/*"
                className={classes.editPictureInput}
                id="icon-button-file"
                type="file"
                onChange={(e) => {
                  if (e.target.files.length === 1) {
                    setImageBlob(e.target.files[0]);
                    setCurrImage(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
              <label htmlFor="icon-button-file">
                <IconButton
                  className={classes.editPictureButton}
                  component="span"
                >
                  <EditIcon />
                </IconButton>
              </label>
            </>
          }
        >
          <Avatar className={classes.image} src={image} />
        </Badge>
      </Grid>
      <Grid xs={12} item>
        <Typography variant="caption">
          Image uploaded should not exceed 10MB
        </Typography>
      </Grid>
    </Grid>
  );
}
