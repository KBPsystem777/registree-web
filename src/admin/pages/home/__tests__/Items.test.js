import { render } from "@testing-library/react";

import Items from "../Items";
test("renders <Items /> without throwing error", () => {
  // Render the App component
  const { container } = render(<Items />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});
