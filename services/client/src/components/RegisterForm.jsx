import React, {useState, setState} from "react";
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

const RegisterForm = (props) => {

  const [validSubmit, setValidSubmit] = useState(false)

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
            <Paper elevation={10}>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <TextField
                    name="username"
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
                  />
                  {errors.username && touched.username && (
                    <div className="input-feedback">{errors.username}</div>
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
                  />
                  {errors.email && touched.email && (
                    <div className="input-feedback">{errors.email}</div>
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
                  Register <HowToRegIcon />
                </Button>
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
