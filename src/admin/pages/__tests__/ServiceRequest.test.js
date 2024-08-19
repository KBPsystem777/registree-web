import { render } from "@testing-library/react";

import ServiceRequest from "../ServiceRequest";
test("renders <ServiceRequest /> without throwing error", () => {
  // Render the App component
  const { container } = render(<ServiceRequest />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});
