import React from "react";
import { render, cleanup } from "@testing-library/react";

import DatasetList from "../DatasetsList";

afterEach(cleanup);

const datasets = [
  {
    file_name: "test_file_name",
    title: "test_title",
    category: "test_category",
  },
  {
    file_name: "test_file_name_1",
    title: "test_title_1",
    category: "test_category_1",
  },
];

it("renders a username", () => {
  const { getByText } = render(<DatasetList datasets={datasets} />);
  expect(getByText("test_file_name")).toHaveClass("dataset");
  expect(getByText("test_file_name_1")).toHaveClass("dataset");
});

it("renders", () => {
  const { asFragment } = render(<DatasetList datasets={datasets} />);
  expect(asFragment()).toMatchSnapshot();
});
