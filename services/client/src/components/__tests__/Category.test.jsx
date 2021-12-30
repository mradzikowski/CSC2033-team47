import React from "react";
import { render, cleanup } from "@testing-library/react";

import CategoryList from "../CategoryList";

afterEach(cleanup);

const categories = [
  {
    category_name: "sustainability",
  },
  {
    category_name: "carbon-emission",
  },
];

it("renders a category", () => {
  const { getByText } = render(<CategoryList categories={categories} />);
  expect(getByText("sustainability")).toHaveClass("category_name");
  expect(getByText("carbon-emission")).toHaveClass("category_name");
});
