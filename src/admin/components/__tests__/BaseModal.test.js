import { render } from "@testing-library/react";

import { BaseModal } from "../BaseModal";

test("renders <BaseModal /> without throwing error", () => {
  // Render the App component
  const { container } = render(<BaseModal />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});
