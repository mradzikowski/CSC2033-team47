import React from "react";
import { render, cleanup } from "@testing-library/react";

import LoginForm from "../LoginForm";

afterEach(cleanup);

const props = {
  handleLoginFormSubmit: () => {
    return true;
  },
  isAuthenticated: () => {
    return false;
  },
};

it("renders with default props", () => {
  const { getByLabelText, getByText } = renderWithRouter(
    <LoginForm {...props} />
  );

  const buttonInput = getByText("Login");
  expect(buttonInput).toHaveValue("Submit");
});

it("renders", () => {
  const { asFragment } = renderWithRouter(<LoginForm {...props} />);
  expect(asFragment()).toMatchSnapshot();
});
