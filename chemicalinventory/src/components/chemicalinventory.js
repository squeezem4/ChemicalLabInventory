import React, { useState, useEffect, useCallback } from "react";
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

// Mock Firestore with a 2-second delay
const mockFirestore = (() => {
  let data = [];
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return {
    async addDoc(collection, doc) {
      await delay(2000);
      const id = data.length;
      const newDoc = { id, ...doc };
      data.push(newDoc);
      return newDoc;
    },
    async deleteDoc(collection, id) {
      await delay(2000);
      data = data.filter((doc) => doc.id !== id);
      return true;
    },
    async getDocs(collection) {
      await delay(2000);
      return [...data];
    },
    async updateDoc(collection, id, updatedDoc) {
      await delay(2000);
      data = data.map((doc) => (doc.id === id ? { ...doc, ...updatedDoc } : doc));
      return { id, ...updatedDoc };
    },
  };
})();

// Custom hook for interacting with mock Firestore
const useMockFirestore = (collection) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const docs = await mockFirestore.getDocs(collection);
    setData(docs);
    setLoading(false);
  }, [collection]);

  const addItem = async (item) => {
    setLoading(true);
    const newDoc = await mockFirestore.addDoc(collection, item);
    setData((prev) => [...prev, newDoc]);
    setLoading(false);
  };

  const deleteItem = async (id) => {
    setLoading(true);
    await mockFirestore.deleteDoc(collection, id);
    setData((prev) => prev.filter((doc) => doc.id !== id));
    setLoading(false);
  };

  const updateItem = async (id, updatedItem) => {
    setLoading(true);
    const updatedDoc = await mockFirestore.updateDoc(collection, id, updatedItem);
    setData((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...updatedDoc } : doc))
    );
    setLoading(false);
  };

  return {
    data,
    loading,
    fetchData,
    addItem,
    deleteItem,
    updateItem,
  };
};

// Main Component
const ChemicalInventory = () => {
  const { data: inventory, loading, fetchData, addItem, deleteItem, updateItem } =
    useMockFirestore("inventory");

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

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e, setItem) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity && newItem.location) {
      addItem(newItem);
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

  const handleDeleteItem = (id) => {
    deleteItem(id);
  };

  const handleEditItem = (item, index) => {
    setEditItem(item);
    setEditIndex(index);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateItem(editIndex, editItem);
    handleCloseEditModal();
  };

  const handleCloseEditModal = () => {
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
            onChange={(e) => handleInputChange(e, setNewItem)}
            className="input"
            fullWidth
            margin="dense"
          />
        ))}
        <Button
          variant="contained"
          onClick={handleAddItem}
          className="button"
          disabled={loading}
        >
          Add Item
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
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
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  {Object.values(item).map((value, i) => (
                    <TableCell key={i}>{value}</TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleEditItem(item, item.id)}
                      disabled={loading}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="text"
                      color="secondary"
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={isEditing} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Chemical</DialogTitle>
        <DialogContent>
          {editItem &&
            Object.keys(editItem).map((key) => (
              <TextField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                name={key}
                value={editItem[key]}
                onChange={(e) => handleInputChange(e, setEditItem)}
                className="input"
                fullWidth
                margin="dense"
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary" disabled={loading}>
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
