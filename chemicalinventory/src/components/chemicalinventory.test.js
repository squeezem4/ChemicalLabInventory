//After writing a passing test, prevent false positives by modifying behavior to induce failure
//screen.debug() before/after changes to ensure proper function

//Try getByRole instead of getByText?
//When to use describe?

import React, {useState} from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import PropTypes, { object } from "prop-types";
import ChemicalInventory from './chemicalinventory';
import { db } from "../firebaseConfig.js";
import { collection, addDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import "@testing-library/jest-dom";

//Mocks Firebase to ensure the actual database isn't modified
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  onSnapshot: jest.fn()
}));

//Mock chemicals
const mockData = [
  { id: "1", name: "Sodium Chloride", quantity: "2", location: "Shelf. Block 1", casnumber: "test 7647-14-5", manufacturer: "Morton", weight: "250g" },
  { id: "2", name: "Sugar", quantity: "1", location: "Shelf. Block 2", casnumber: "sugar cas", manufacturer: "sugar cane", weight: "2 tons" }
];

//
beforeEach(() => {
  onSnapshot.mockImplementation((colRef, callback) => {
    callback({ docs: mockData.map((doc) => ({ id: doc.id, data: () => doc })) });
    return jest.fn();
  });
});

test("render the chemicalinventory component", () => {
  render(<ChemicalInventory />);
  // screen.debug();
  expect(screen.getByText("Chemical Inventory")).toBeInTheDocument();
});

test("display all inventory items", async () => {
  render(<ChemicalInventory />);
  expect(await screen.findByText("Sodium Chloride")).toBeInTheDocument();
  expect(await screen.findByText("Sugar")).toBeInTheDocument();
});

test("adds new chemical", async () => {
  addDoc.mockResolvedValueOnce({ id: "3"});
  render(<ChemicalInventory />);

  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Hydrogen Peroxide" } });
  fireEvent.change(screen.getByLabelText("Quantity"), { target: { value: "1" } });
  fireEvent.change(screen.getByLabelText("Location"), { target: { value: "Shelf. Block 3" } });
  fireEvent.change(screen.getByLabelText("Casnumber"), { target: { value: "h2o2-cas" } });
  fireEvent.change(screen.getByLabelText("Manufacturer"), { target: { value: "walmart" } });
  fireEvent.change(screen.getByLabelText("Weight"), { target: { value: "6 oz" } });
  fireEvent.click(screen.getByText("Add Item"));

  await waitFor(() => expect (addDoc).toHaveBeenCalled());
  // expect(await screen.findByText("Hydrogen Peroxide"))
});

test("deletes an item from inventory", async () => {
  deleteDoc.mockResolvedValueOnce();
  render(<ChemicalInventory />);

  //Find chemical "sugar", traverse DOM to find its table row, and delete it
  const row = screen.getByText("Sugar").closest("tr")
  const deleteButton = within(row).getByText("Delete");
  fireEvent.click(deleteButton);
  // await waitFor(() => expect(screen.queryByText("Sugar")).toBeNull());
})


// const HelloWorld = () => <h1>HelloWorld</h1>
// test("it should render items", () => {
//   const items = ["item 1", "item 2", "item 3"];
//   render(<ItemList items = {items} />);
//   screen.debug();
//   screen.getByText(/item 1/i);
// })

// test("it should be able to handle an empty list", () => {
//   const items = [];
//   render(<ItemList items = {items} />);
//   screen.debug();
//   screen.getByText(/no items/i);
// })

// test("it should render if given no items", () => {
//   render(<ItemList/>);
//   screen.debug();
//   screen.getByText(/no items/i);
// })

// test("it should render an error", () => {
//   const error = new Error ("There was an error");
//   render(<ItemList error = {error}/>);
//   screen.debug();
//   screen.getByText(/no items/i);
// })

// test("it should show loading", () => {
//   const isLoading = true;
//   render(<ItemList isLoading = {isLoading}/>);
//   screen.debug();
//   screen.getByText(/Loading/i);
// })

// const ItemList = ({items = [], isLoading = false, error}) => {
//   console.log({items});
//   if(isLoading){
//     return <div>Loading</div>
//   }
//   // const[items, setItems] = useState(["item 1", "item 2", "item 3"]);
//   return (
//     <div>
//       <div>
//         {error && <div>{error.message}</div>}
//       </div>
//       <div>
//         {items.length === 0 && <div>no items</div>}
//       </div>
//       <ul>
//         {items.map((item, index) => <li key = {index}> {item} </li>)}
//       </ul>
//     </div>
//   )
// }

// ItemList.propTypes = {
//   items: PropTypes.arrayOf (PropTypes.string)
// }