import { render } from "@testing-library/react";

import AlertMessage from "../AlertMessage";

test("renders <AlertMessage /> without throwing error", () => {
  // Render the App component
  const { container } = render(<AlertMessage />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});
