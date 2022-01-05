import React from "react";
import { cleanup, waitFor } from "@testing-library/react";

import NavBar from "../NavBar";

afterEach(cleanup);

describe("when unauthenticated", () => {
  it("renders the default props", async () => {
    const props = {
      title: "Hello, World!",
      logoutUser: () => {
        return true;
      },
      isAuthenticated: jest.fn().mockImplementation(() => false),
    };

    const { findByTestId } = renderWithRouter(<NavBar {...props} />);
    await waitFor(() => {
      expect(props.isAuthenticated).toHaveBeenCalledTimes(1);
    });
    expect((await findByTestId("nav-register")).innerHTML).toBe("REGISTER");
    expect((await findByTestId("nav-login")).innerHTML).toBe("LOG IN");
  });

  it("renders", () => {
    const props = {
      logoutUser: () => {
        return true;
      },
      isAuthenticated: jest.fn().mockImplementation(() => false),
    };
    const { asFragment } = renderWithRouter(<NavBar {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("when authenticated", () => {
  it("renders the default props", async () => {
    const props = {
      logoutUser: () => {
        return true;
      },
      isAuthenticated: jest.fn().mockImplementation(() => true),
    };
    const { findByTestId } = renderWithRouter(<NavBar {...props} />);
    await waitFor(() => {
      expect(props.isAuthenticated).toHaveBeenCalledTimes(1);
    });
    expect((await findByTestId("nav-status")).innerHTML).toBe("ACCOUNT");
    expect((await findByTestId("nav-logout")).innerHTML).toBe("LOG OUT");
  });

  it("renders", () => {
    const props = {
      title: "Hello, World!",
      logoutUser: () => {
        return true;
      },
      isAuthenticated: jest.fn().mockImplementation(() => true),
    };
    const { asFragment } = renderWithRouter(<NavBar {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
