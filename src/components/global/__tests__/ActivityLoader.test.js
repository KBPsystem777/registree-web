import { render } from "@testing-library/react";

import ActivityLoader from "../ActivityLoader";

test("renders <ActivityLoader /> without throwing error", () => {
  // Render the App component
  const { container } = render(<ActivityLoader />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});
