import { render } from "@testing-library/react";

import WalletConnect from "../WalletConnect";

test("renders <WalletConnect /> without throwing error", () => {
  // Render the App component
  const { container } = render(<WalletConnect />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});
