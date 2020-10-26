import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";

// Material UI components
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

// Icons

// Custom components
import ImageUpload from "../components/ImageUpload";
import LoadingButton from "../components/LoadingButton";

// Actions
import { openSnackbar } from "../actions/snackbar-actions";
import { logoutUser } from "../actions/auth-actions";
import { setBack } from "../actions/back-actions";

// Utils
import { editPasswordErrors } from "../utils/validators";

const CHAR_LIMIT = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(6),
  },
  center: {
    textAlign: "center",
  },
}));

export default function EditProfile({
  description,
  profilePicture,
  endEdit,
  mutate,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [imageBlob, setImageBlob] = useState(null);
  const [newDesc, setNewDesc] = useState(description || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditPassword, setIsEditPassword] = useState(false);

  const submit = async () => {
    setIsLoading(true);
    const form = new window.FormData();
    form.append("description", newDesc);
    if (imageBlob) {
      form.append("picture", imageBlob);
    }
    await axios.put("/api/v1/users", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(openSnackbar("Profile updated!", "success"));
    mutate();
    endEdit();
  };

  useEffect(() => {
    dispatch(setBack(endEdit));

    return () => {
      dispatch(setBack());
    };
  }, [dispatch, endEdit]);

  return (
    <>
      <Grid className={classes.root} container direction="column" spacing={1}>
        {isEditPassword ? (
          <EditPassword
            endEdit={() => setIsEditPassword(false)}
            endProfileEdit={endEdit}
          />
        ) : (
          <>
            <Grid
              container
              item
              xs={12}
              justify="space-between"
              wrap="nowrap"
              alignContent="center"
            >
              <Grid item>
                <Typography variant="h5">Edit profile</Typography>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => setIsEditPassword(true)}
                  color="primary"
                  variant="contained"
                >
                  Edit password
                </Button>
              </Grid>
            </Grid>
            <Grid item className={classes.center}>
              <ImageUpload
                initialImage={profilePicture}
                setImageBlob={setImageBlob}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                helperText={`${newDesc.length} / ${CHAR_LIMIT} characters`}
                label="Description"
                multiline
                name="description"
                rows={4}
                variant="filled"
                onChange={(e) => {
                  if (e.target.value.length <= 200) {
                    setNewDesc(e.target.value);
                  }
                }}
                value={newDesc}
              />
            </Grid>
            <Grid item>
              <LoadingButton
                onClick={submit}
                fullWidth
                color="primary"
                variant="contained"
                isLoading={isLoading}
              >
                Submit
              </LoadingButton>
            </Grid>
            <Grid item>
              <Button
                onClick={endEdit}
                fullWidth
                color="secondary"
                variant="contained"
              >
                Cancel
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}

function EditPassword({ endEdit, endProfileEdit }) {
  const dispatch = useDispatch();
  const [fields, setFields] = useState({
    current_password: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e) => {
    setErrors({});
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    dispatch(setBack(endEdit));

    return () => {
      dispatch(setBack(endProfileEdit));
    };
  }, [dispatch, endEdit, endProfileEdit]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { current_password, password, password2 } = fields;
    const err = editPasswordErrors(current_password, password, password2);

    if (err) {
      setFields({ current_password: "", password: "", password2: "" });
      setErrors(err);
      setIsLoading(false);
      return;
    }

    try {
      await axios.put(
        "/api/v1/auth/change-password",
        JSON.stringify({ current_password, new_password: password })
      );
      dispatch(
        openSnackbar(
          "Password changed successfully! Please login again.",
          "success"
        )
      );
      dispatch(logoutUser());
    } catch (e) {
      const res = e.response.data;
      setFields({ current_password: "", password: "", password2: "" });

      if (res.message.includes("Wrong email or password")) {
        setErrors({
          current_password: "Current password is invalid",
        });
      }

      if (res.message.includes("is too weak")) {
        setErrors({
          password:
            "Password should be at least 8 characters long, include lower case, uppercase, and numbers.",
          password2:
            "Password should be at least 8 characters long, include lower case, uppercase, and numbers.",
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h5">Edit password</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          error={errors.current_password !== undefined}
          fullWidth
          helperText={errors.current_password}
          label="Current password"
          name="current_password"
          onChange={onChange}
          required
          type="password"
          value={fields.current_password}
          variant="filled"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          error={errors.password !== undefined}
          fullWidth
          helperText={errors.password}
          label="New password"
          name="password"
          onChange={onChange}
          required
          type="password"
          value={fields.password}
          variant="filled"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          error={errors.password2 !== undefined}
          fullWidth
          helperText={errors.password2}
          label="Confirm new password"
          name="password2"
          onChange={onChange}
          required
          type="password"
          value={fields.password2}
          variant="filled"
        />
      </Grid>
      <Grid item>
        <LoadingButton
          onClick={onSubmit}
          fullWidth
          color="primary"
          variant="contained"
          isLoading={isLoading}
        >
          Submit
        </LoadingButton>
      </Grid>
      <Grid item>
        <Button
          onClick={endEdit}
          fullWidth
          color="secondary"
          variant="contained"
        >
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
}
