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
  const [newItem, setNewItem] = useState({ name: "", quantity: "", location: "" , casnumber: "", manufacturer: "", weight: "", numcontainer: "", sds: ""});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const addItem = () => {
    if (newItem.name && newItem.quantity && newItem.location) {
      setInventory([...inventory, newItem]);
      setNewItem({ name: "", quantity: "", location: "" , casnumber: "", manufacturer: "", weight: "", numcontainer: "", sds: ""});
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
          label="CASNumber"
          name="casnumber"
          value={newItem.casnumber}
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
        <TextField
          label="Manufacturer"
          name="manufacturer"
          value={newItem.manufacturer}
          onChange={handleInputChange}
          className="input"
        />
        <TextField
          label="Weight"
          name="weight"
          value={newItem.weight}
          onChange={handleInputChange}
          className="input"
        />
        <TextField
          label="Number of Containers"
          name="numcontainer"
          value={newItem.numcontainer}
          onChange={handleInputChange}
          className="input"
        />
        <TextField
          label="SDS Website"
          name="sds"
          value={newItem.sds}
          onChange={handleInputChange}
          className="input"
        />
        <Button 
          variant="contained" 
          color="black" 
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
              <TableCell><strong>CAS Number</strong></TableCell>
              <TableCell><strong>Manufacturer</strong></TableCell>
              <TableCell><strong>Weight</strong></TableCell>
              <TableCell><strong>Number of Containers</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>SDS</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.casnumber}</TableCell>
                <TableCell>{item.manufacturer}</TableCell>
                <TableCell>{item.weight}</TableCell>
                <TableCell>{item.numcontainer}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.sds}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <p><center>Created by Code 007</center></p>
    </div>
  );
};

export default App;