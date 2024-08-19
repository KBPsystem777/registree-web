import { render } from "@testing-library/react";

import Homeowners from "../Homeowners";

test("renders <Homeowners /> without throwing error", () => {
  // Render the App component
  const { container } = render(<Homeowners />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});
