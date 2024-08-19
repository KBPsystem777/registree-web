import { render } from "@testing-library/react";

import Properties from "../Properties";

test("renders <Properties /> without throwing error", () => {
  // Render the App component
  const { container } = render(<Properties />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});
