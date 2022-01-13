import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";

import "./form.css";
import { Redirect } from "react-router-dom";
import { InputAdornment, TextField } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import FormHelperText from "@mui/material/FormHelperText";

const LoginForm = (props) => {
  if (props.isAuthenticated()) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          props.handleLoginFormSubmit(values);
          resetForm();
          setSubmitting(false);
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Enter a valid email.")
            .required("Email is required."),
          password: Yup.string().required("Password is required."),
        })}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
          } = props;
          return (
            <Paper elevation={10} className="formContainer">
              <img
                src={`${process.env.PUBLIC_URL}/Logo.png`}
                style={{ margin: "5%", width: "70%", height: "70%" }}
              />
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <TextField
                    name="email"
                    className={
                      errors.email && touched.email ? "input error" : "input"
                    }
                    type="email"
                    placeholder="Enter an email address"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="standard"
                  />
                  {errors.email && touched.email && (
                    <FormHelperText id="component-error-text">
                      {errors.email}
                    </FormHelperText>
                  )}
                </div>
                <div className="field">
                  {/*<label className="label" htmlFor="input-password">*/}
                  {/*  Password*/}
                  {/*</label>*/}
                  <TextField
                    name="password"
                    id="input-password"
                    className={
                      errors.password && touched.password
                        ? "input error"
                        : "input"
                    }
                    type="password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PasswordIcon />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Enter a password"
                    fullWidth
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="standard"
                  />
                  {errors.password && touched.password && (
                    <FormHelperText id="component-error-text">
                      {errors.password}
                    </FormHelperText>
                  )}
                </div>
                <Button
                  type="submit"
                  value="Submit"
                  disabled={isSubmitting}
                  variant="contained"
                  style={{ margin: "5%" }}
                >
                  Login
                  <LoginIcon />
                </Button>
              </form>
            </Paper>
          );
        }}
      </Formik>
    </div>
  );
};

LoginForm.propTypes = {
  handleLoginFormSubmit: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
};

export default LoginForm;
