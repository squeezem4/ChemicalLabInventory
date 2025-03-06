import image from "../FirstLogo.png";
import React, { useState, useEffect } from "react";
import ImageTextScanner from './mobile';  
import AppState from "../AppState";

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
import { db } from "../firebaseConfig.js";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import "../App.css";

// Structure the order of the fields for firebase
const fieldOrder = [
  "name",
  "quantity",
  "location",
  "casnumber",
  "manufacturer",
  "weight",
  "numcontainer",
  "sds",
];

const ChemicalInventory = () => {
  const auth = getAuth();

  // Define default item structure
  const defaultItem = fieldOrder.reduce((obj, key) => {
    obj[key] = "";
    return obj;
  }, {});

  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState(defaultItem);
  const [editItem, setEditItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);  // New state for showing the form in mobile

  // Listener for Firestore updates such as adding and editing chemical fields
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "chemicals"), (snapshot) => {
      const items = snapshot.docs.map((doc) => {
        const data = doc.data();
        const orderedData = fieldOrder.reduce((obj, key) => {
          obj[key] = data[key] || "";
          return obj;
        }, {});
        return { id: doc.id, ...orderedData };
      });
      setInventory(items);
    });

    return () => unsubscribe();
  }, []);

  // Handles input change for the new item form by updating the state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Handles input change for the edit item form by updating the state
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem({ ...editItem, [name]: value });
  };

  // Adds a new document to the chemicals collection if all fields are filled out
  const addItem = async () => {
    const sanitizedItem = fieldOrder.reduce((obj, key) => {
      obj[key] = newItem[key] || ""; // Ensure all fields are included
      return obj;
    }, {});

    if (sanitizedItem.name && sanitizedItem.quantity && sanitizedItem.location) {
      try {
        await addDoc(collection(db, "chemicals"), sanitizedItem);
        setNewItem(defaultItem);
        setIsAddItemOpen(false);  // Close the modal after adding
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  // Deletes a document by its ID in the chemicals collection
  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "chemicals", id)); // Delete document by ID
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // Opens the edit modal and populates the form with the entry's data
  const openEditModal = (item) => {
    setEditItem(item);
    setIsEditing(true);
  };

  // Updates a document in the chemicals collection with the data from the edit form
  const saveEdit = async () => {
    const sanitizedEditItem = fieldOrder.reduce((obj, key) => {
      obj[key] = editItem[key] || "";
      return obj;
    }, {});

    try {
      const itemRef = doc(db, "chemicals", editItem.id);
      await updateDoc(itemRef, sanitizedEditItem);
      closeEditModal();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // Closes the edit modal
  const closeEditModal = () => {
    setIsEditing(false);
    setEditItem(null);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  // Toggle the Add Item form visibility in mobile view
  const toggleAddItemForm = () => {
    setIsAddItemOpen(!isAddItemOpen);
  };

  // Handle scan completion and trigger modal to add item
  const handleScanComplete = (scannedData) => {
    setNewItem({
      ...newItem,
      name: scannedData.name,
      casnumber: scannedData.casnumber, 
    });
    setIsAddItemOpen(true);  // Open the modal after setting the scanned data
  };

  return (
    <div className="container">
      <center><img src={image} alt="First Logo" style={{ width: 350, height: 200 }} /></center>
      <h1 className="header">FIRST Chemical Inventory</h1>

      <div className="form-container">
        {/* Conditionally render fields based on isAddItemOpen in mobile view */}
        {(!AppState.isMobile || isAddItemOpen) && fieldOrder.map((key) => (
          <TextField
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            name={key}
            value={newItem[key]}  // Pre-fill the values here
            onChange={handleInputChange}
            className="input"
            required={true}
          />
        ))}

        {/* Show Add Item button that toggles the visibility of input fields */}
        {AppState.isMobile && (
          <Button variant="contained" onClick={toggleAddItemForm} className="button">
            {isAddItemOpen ? "Hide Form" : "Add Item"}
          </Button>
        )}

        {/* Keep the Add Item button for desktop view */}
        {!AppState.isMobile && (
          <Button variant="contained" onClick={addItem} className="button">
            Add Item
          </Button>
        )}

        <ImageTextScanner
          setNewItem={setNewItem}        // Pass the setNewItem function
          addItem={addItem}              // Pass the addItem function
          onScanComplete={handleScanComplete}
          setIsAddItemOpen={setIsAddItemOpen}
        />

        <Button
          variant="contained"
          href="/export-csv"
          className="button"
        >
          Export
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          className="button"
        >
          Logout
        </Button>
      </div>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              {fieldOrder.map((key) => (
                <TableCell key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>
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
                {fieldOrder.map((key) => (
                  <TableCell key={key}>{item[key]}</TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => openEditModal(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="text"
                    color="secondary"
                    onClick={() => deleteItem(item.id)}
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
            fieldOrder.map((key) => (
              <TextField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                name={key}
                value={editItem[key] || ""}
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


      <Dialog open={isAddItemOpen} onClose={() => setIsAddItemOpen(false)}>
        <DialogTitle>Add New Chemical</DialogTitle>
        <DialogContent>
          {fieldOrder.map((key) => (
            <TextField
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              name={key}
              value={newItem[key]}  // Pre-fill the values here
              onChange={handleInputChange}
              className="input"
              required={key === "name" || key === "casnumber"}  // Make name and CAS required
              fullWidth
              margin="dense"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddItemOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={addItem} color="primary">
            Add Item
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
