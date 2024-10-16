// src/App.js
import React, { useState } from "react";
import { 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from "@mui/material";
import './App.css';

const App = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", location: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const addItem = () => {
    if (newItem.name && newItem.quantity && newItem.location) {
      setInventory([...inventory, newItem]);
      setNewItem({ name: "", quantity: "", location: "" });
    }
  };

  return (
    <div className="container">
      <h1 className="header">Chemical Inventory</h1>

      <div className="form-container">
        <TextField
          label="Item Name"
          name="name"
          value={newItem.name}
          onChange={handleInputChange}
          className="input"
        />
        <TextField
          label="Quantity"
          name="quantity"
          value={newItem.quantity}
          onChange={handleInputChange}
          className="input"
        />
        <TextField
          label="Location"
          name="location"
          value={newItem.location}
          onChange={handleInputChange}
          className="input"
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={addItem} 
          className="button"
        >
          Add Item
        </Button>
      </div>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Item Name</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default App;