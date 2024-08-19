import { render } from "@testing-library/react";

import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
} from "../Accordion";

test("renders <Accordion /> without throwing error", () => {
  // Render the App component
  const { container } = render(<Accordion />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});

test("renders <AccordionItem /> without throwing error", () => {
  // Render the App component
  const { container } = render(<AccordionItem />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});

test("renders <AccordionHeader /> without throwing error", () => {
  // Render the App component
  const { container } = render(<AccordionHeader />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});

test("renders <AccordionBody /> without throwing error", () => {
  // Render the App component
  const { container } = render(<AccordionBody />);

  // Assert that no error is thrown
  expect(container).toBeDefined();
});
