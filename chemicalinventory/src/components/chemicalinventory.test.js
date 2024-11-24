import { render, screen } from '@testing-library/react';
import React, {useState} from 'react';
import PropTypes, { object } from "prop-types";
import ChemicalInventory from './chemicalinventory';

const HelloWorld = () => <h1>HelloWorld</h1>
test("it should render items", () => {
  const items = ["item 1", "item 2", "item 3"];
  render(<ItemList items = {items} />);
  screen.debug();
  screen.getByText(/item 1/i);
})

test("it should be able to handle an empty list", () => {
  const items = [];
  render(<ItemList items = {items} />);
  screen.debug();
  screen.getByText(/no items/i);
})

test("it should render if given no items", () => {
  render(<ItemList/>);
  screen.debug();
  screen.getByText(/no items/i);
})

test("it should render an error", () => {
  const error = new Error ("There was an error");
  render(<ItemList error = {error}/>);
  screen.debug();
  screen.getByText(/no items/i);
})

test("it should show loading", () => {
  const isLoading = true;
  render(<ItemList isLoading = {isLoading}/>);
  screen.debug();
  screen.getByText(/Loading/i);
})

const ItemList = ({items = [], isLoading = false, error}) => {
  console.log({items});
  if(isLoading){
    return <div>Loading</div>
  }
  // const[items, setItems] = useState(["item 1", "item 2", "item 3"]);
  return (
    <div>
      <div>
        {error && <div>{error.message}</div>}
      </div>
      <div>
        {items.length === 0 && <div>no items</div>}
      </div>
      <ul>
        {items.map((item, index) => <li key = {index}> {item} </li>)}
      </ul>
    </div>
  )
}

ItemList.propTypes = {
  items: PropTypes.arrayOf (PropTypes.string)
}