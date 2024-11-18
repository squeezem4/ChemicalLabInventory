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
import "../App.css";
import 'semantic-ui-css/semantic.min.css';
import { Container, Dropdown, Input } from 'semantic-ui-react';



const ChemicalInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ 
    name: "", quantity: "", location: "", casnumber: "", 
    manufacturer: "", weight: "", numcontainer: "", sds: "" 
  });


  const [selectedItem, setSelectedItem] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const addItem = () => {
    if (newItem.name && newItem.quantity && newItem.location) {
      setInventory([...inventory, newItem]);
      setNewItem({ 
        name: "", quantity: "", location: "", casnumber: "", 
        manufacturer: "", weight: "", numcontainer: "", sds: "" 
      });
    }
  };

  const deleteItem = (index) => {
    const updatedInventory = inventory.filter((_, i) => i !== index);
    setInventory(updatedInventory);
  };

  const handleSelect = (e, { value }) => {
    const selected = inventory.find(item => item.casnumber === value);
    setSelectedItem(selected);
  };

  return (
    <div className="container">
      <h1 className="header">Chemical Inventory</h1>
      <Container style={{ marginTop: '20px' }}>
      <Dropdown
  placeholder="Search By CAS Number"
  fluid
  selection
  options={inventory.map(item => ({
    key: item.casnumber,
    value: item.casnumber,
    text: item.name
  }))}
  onChange={handleSelect}
  value={selectedItem ? selectedItem.casnumber : ''}
  search
/>

    </Container>

      <div className="form-container">
        {Object.keys(newItem).map((key) => (
          <TextField
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            name={key}
            value={newItem[key]}
            onChange={handleInputChange}
            className="input"
          />
        ))}
        <Button variant="contained" onClick={addItem} className="button">
          Add Item
        </Button>
      </div>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(newItem).map((key) => (
                <TableCell key={key}><strong>{key}</strong></TableCell>
              ))}
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item, index) => (
              <TableRow key={index}>
                {Object.values(item).map((value, i) => (
                  <TableCell key={i}>{value}</TableCell>
                ))}
                <TableCell>
                  <button onClick={() => deleteItem(index)}>Delete</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <p><center>Created by Code 007</center></p>
    </div>
  );
};

export default ChemicalInventory;
