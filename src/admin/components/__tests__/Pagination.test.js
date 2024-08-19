import { render } from "@testing-library/react";

import Pagination from "../Pagination";
test("renders <Pagination /> without throwing error", () => {
  // Render the App component
  const { container } = render(<Pagination />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});
