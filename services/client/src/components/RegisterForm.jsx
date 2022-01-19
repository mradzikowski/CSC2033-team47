import React, { useState } from "react";
import PropTypes from "prop-types";
import Paper from "@mui/material/Paper";
import { Formik } from "formik";
import * as Yup from "yup";

import "./form.css";
import { Redirect } from "react-router-dom";
import { InputAdornment, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import EmailIcon from "@mui/icons-material/Email";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PasswordIcon from "@mui/icons-material/Password";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import FormHelperText from "@mui/material/FormHelperText";

const RegisterForm = (props) => {
  const [validSubmit, setValidSubmit] = useState(false);

  if (props.isAuthenticated()) {
    return <Redirect to="/" />;
  }

  if (validSubmit) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          props.handleRegisterFormSubmit(values);
          resetForm();
          setSubmitting(false);
          setValidSubmit(true);
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string()
            .required("Username is required.")
            .min(6, "Username must be greater than 5 characters."),
          email: Yup.string()
            .email("Enter a valid email.")
            .required("Email is required.")
            .min(6, "Email must be greater than 5 characters."),
          password: Yup.string()
            .required("Password is required.")
            .min(11, "Password must be greater than 10 characters."),
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
                    name="username"
                    id="username-field"
                    className={
                      errors.username && touched.username
                        ? "input error"
                        : "input"
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircleIcon />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Enter a username"
                    fullWidth
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="standard"
                  />
                  {errors.username && touched.username && (
                    <FormHelperText id="component-error-text">
                      {errors.username}
                    </FormHelperText>
                  )}
                </div>
                <div className="field">
                  <TextField
                    name="email"
                    className={
                      errors.email && touched.email ? "input error" : "input"
                    }
                    type="email"
                    placeholder="Enter an email address"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
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
                  <Button
                    type="submit"
                    value="Submit"
                    disabled={isSubmitting}
                    variant="contained"
                    style={{ margin: "5%" }}
                  >
                    Register <HowToRegIcon />
                  </Button>
                </div>
              </form>
            </Paper>
          );
        }}
      </Formik>
    </div>
  );
};

RegisterForm.propTypes = {
  handleRegisterFormSubmit: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
};

export default RegisterForm;
