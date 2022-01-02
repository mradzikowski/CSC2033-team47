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
            <Paper elevation={10}>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label" htmlFor="input-email">
                    Email
                  </label>
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
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.email && touched.email && (
                    <div className="input-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="field">
                  <label className="label" htmlFor="input-password">
                    Password
                  </label>
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
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.password && touched.password && (
                    <div className="input-feedback">{errors.password}</div>
                  )}
                </div>
                <Button
                  type="submit"
                  value="Submit"
                  disabled={isSubmitting}
                  variant="contained"
                >
                  Login
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
