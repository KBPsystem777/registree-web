import { render } from "@testing-library/react";

import Wallet from "../Wallet";

test("renders <Wallet /> without throwing error", () => {
  // Render the App component
  const { container } = render(<Wallet />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});
