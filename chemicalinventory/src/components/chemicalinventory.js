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
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import "../App.css";

const ChemicalInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    location: "",
    casnumber: "",
    manufacturer: "",
    weight: "",
    numcontainer: "",
    sds: "",
  });
  const [editItem, setEditItem] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem({ ...editItem, [name]: value });
  };

  const addItem = () => {
    if (newItem.name && newItem.quantity && newItem.location) {
      setInventory([...inventory, newItem]);
      setNewItem({
        name: "",
        quantity: "",
        location: "",
        casnumber: "",
        manufacturer: "",
        weight: "",
        numcontainer: "",
        sds: "",
      });
    }
  };

  const deleteItem = (index) => {
    const updatedInventory = inventory.filter((_, i) => i !== index);
    setInventory(updatedInventory);
  };

  const openEditModal = (item, index) => {
    setEditItem(item);
    setEditIndex(index);
    setIsEditing(true);
  };

  const saveEdit = () => {
    const updatedInventory = [...inventory];
    updatedInventory[editIndex] = editItem;
    setInventory(updatedInventory);
    closeEditModal();
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setEditItem(null);
    setEditIndex(null);
  };

  return (
    <div className="container">
      <h1 className="header">Chemical Inventory</h1>

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
                <TableCell key={key}>
                  <strong>{key}</strong>
                </TableCell>
              ))}
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item, index) => (
              <TableRow key={index}>
                {Object.values(item).map((value, i) => (
                  <TableCell key={i}>{value}</TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => openEditModal(item, index)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="text"
                    color="secondary"
                    onClick={() => deleteItem(index)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isEditing} onClose={closeEditModal}>
        <DialogTitle>Edit Chemical</DialogTitle>
        <DialogContent>
          {editItem &&
            Object.keys(editItem).map((key) => (
              <TextField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                name={key}
                value={editItem[key]}
                onChange={handleEditChange}
                className="input"
                fullWidth
                margin="dense"
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={saveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <p>
        <center>Created by Code 007</center>
      </p>
    </div>
  );
};

export default ChemicalInventory;
