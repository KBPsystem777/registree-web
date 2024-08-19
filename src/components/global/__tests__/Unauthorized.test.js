import { render } from "@testing-library/react";

import Unauthorized from "../Unauthorized";
test("renders <Unauthorized /> without throwing error", () => {
  // Render the App component
  const { container } = render(<Unauthorized />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});
