import React from "react";
import { render, cleanup } from "@testing-library/react";

import RegisterForm from "../RegisterForm";

afterEach(cleanup);

describe("renders", () => {
  const props = {
    handleRegisterFormSubmit: () => {
      return true;
    },
    isAuthenticated: () => {
      return false;
    },
  };

  it("default props", () => {
    const { getByLabelText, getByText } = renderWithRouter(
      <RegisterForm {...props} />
    );

    const buttonInput = getByText("Register");
    expect(buttonInput).toHaveValue("Submit");
  });

  it("a snapshot properly", () => {
    const { asFragment } = renderWithRouter(<RegisterForm {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
