import { render } from "@testing-library/react";

import ModalWallet from "../ModalWallet";

test("renders <ModalWallet /> without throwing error", () => {
  // Render the App component
  const { container } = render(<ModalWallet />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});
