import React from "react";
import { render, cleanup } from "@testing-library/react";

import UsersList from "../UsersList";

afterEach(cleanup);

const users = [
  {
    email: "mateusz@gmail.com",
    user_id: 1,
    username: "mateusz",
  },
  {
    email: "toby@gmail.com",
    user_id: 2,
    username: "toby",
  },
];

it("renders a username", () => {
  const { getByText } = render(<UsersList users={users} />);
  expect(getByText("mateusz")).toHaveClass("username");
  expect(getByText("toby")).toHaveClass("username");
});

it("renders", () => {
  const { asFragment } = render(<UsersList users={users} />);
  expect(asFragment()).toMatchSnapshot();
});
