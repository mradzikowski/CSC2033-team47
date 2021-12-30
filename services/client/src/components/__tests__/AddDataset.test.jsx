import React from "react";
import { render, cleanup } from "@testing-library/react";

import AddDataset from "../AddDataset";

afterEach(cleanup);

const props = {
  handleChange: () => {
    return true;
  },
  handleClick: () => {
    return true;
  },
};

it("renders with default props", () => {
  const { getByLabelText, getByText } = render(<AddDataset {...props} />);

  const titleInput = getByLabelText("Title");
  expect(titleInput).not.toHaveValue();

  const categoryInput = getByLabelText("Category");
  expect(categoryInput).not.toHaveValue();

  const buttonInput = getByText("Upload");
  expect(buttonInput).toBeVisible();
});

it("renders", () => {
  const { asFragment } = render(<AddDataset {...props} />);
  expect(asFragment()).toMatchSnapshot();
});
