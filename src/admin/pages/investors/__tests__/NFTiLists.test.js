import { render } from "@testing-library/react";

import NFTiLists from "../NFTiLists";

test("renders <NFTiLists /> without throwing error", () => {
  // Render the App component
  const { container } = render(<NFTiLists />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});
