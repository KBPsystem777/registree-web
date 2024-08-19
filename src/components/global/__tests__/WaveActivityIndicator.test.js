import { render } from "@testing-library/react";

import WaveActivityIndicator from "../WaveActivityIndicator";

test("renders <WaveActivityIndicator /> without throwing error", () => {
  // Render the App component
  const { container } = render(<WaveActivityIndicator />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});
