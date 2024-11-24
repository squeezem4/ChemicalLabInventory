import { render, screen } from '@testing-library/react';
import App from './App';

test("initially load login page", () => {
  expect(sum(1, 2)).toBe(3)
})
// describe(App, () => {
//   it()
// })

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
