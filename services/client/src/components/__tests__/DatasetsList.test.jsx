import React from "react";
import { render, cleanup } from "@testing-library/react";

import DatasetList from "../DatasetsList";

afterEach(cleanup);

const datasets = [
  {
    dataset_id: 1,
    file_name: "test_file_name",
    title: "test_title",
    category: "test_category",
  },
  {
    dataset_id: 2,
    file_name: "test_file_name_1",
    title: "test_title_1",
    category: "test_category_1",
  },
];

const props = {
  datasets,
  isAuthenticated: () => {
    return true;
  },
};

it("renders a username", () => {
  const { getByText } = renderWithRouter(<DatasetList {...props} />);
  expect(getByText("test_file_name")).toHaveClass("dataset");
  expect(getByText("test_file_name_1")).toHaveClass("dataset");
});

it("renders", () => {
  const { asFragment } = renderWithRouter(<DatasetList {...props} />);
  expect(asFragment()).toMatchSnapshot();
});
