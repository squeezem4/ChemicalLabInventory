import React, { useState, useRef } from "react";
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { Ocr } from '@capacitor-community/image-to-text';
import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import AppState from "../AppState";

const ImageTextScanner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [casNumber, setCasNumber] = useState(null);
  const [nameOptions, setNameOptions] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const scanButtonRef = useRef(null);

  const handleScanItem = async () => {
    try {
      setLoading(true);
      setError(null);
      setImagePreview(null);
      setExtractedText("");
      setCasNumber(null);
      setNameOptions([]);
      setSelectedName("");
      setEditingName(false);

      // Request camera permissions and take photo
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        direction: CameraDirection.Rear
      });

      // Show preview of taken image
      setImagePreview(photo.webPath);

      // Perform OCR on the image
      const result = await Ocr.detectText({
        filename: photo.path
      });

      // Extract text if OCR detects it
      if (result.textDetections && result.textDetections.length > 0) {
        const formattedText = result.textDetections.map(d => d.text).join("\n");

        // Find the CAS number using regex
        const casLine = formattedText.split("\n").find(line => /\b\d{2,7}-\d{2}-\d{1}\b/.test(line));
        const casMatch = casLine ? casLine.match(/\b\d{2,7}-\d{2}-\d{1}\b/) : null;
        const casNumber = casMatch ? casMatch[0] : null;

        // If CAS number is found, fetch the names from the PubChem API
        if (casNumber) {
          setCasNumber(casNumber);
          const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/xref/RN/${casNumber}/property/Title/JSON`);
          const data = await response.json();

          // Check if multiple names are returned and update state
          if (data.PropertyTable && data.PropertyTable.Properties) {
            const names = data.PropertyTable.Properties.map(property => property.Title);
            setNameOptions(names);
            setSelectedName(names[0]); // Set default to the first name
          } else {
            setExtractedText(`CAS Number: ${casNumber} - No name found`);
          }
        } else {
          setExtractedText("No CAS number found in the image.");
        }

        setExtractedText(formattedText);
      } else {
        setExtractedText("No text found in the image.");
      }
    } catch (error) {
      console.error('Scan failed:', error);
      setError(error.message || 'Failed to scan item');
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (event) => {
    setSelectedName(event.target.value);
  };

  const handleNameEdit = (event) => {
    setEditingName(true);
    setSelectedName(event.target.value);
  };

  const handleSaveEditedName = () => {
    setEditingName(false);
    // You can further process the edited name or save it
  };

  // Handle adding the item (with CAS number and selected name)
  const handleAddItem = () => {
    if (casNumber && selectedName) {
      // Add the item to your app's state or database
      console.log("Adding item:", { casNumber, selectedName });

      // For demonstration, we just log the item. Replace this with your own logic
      alert(`Item added with CAS Number: ${casNumber} and Name: ${selectedName}`);
    } else {
      alert("Please scan an item and select or edit a name first.");
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        className="button"
        onClick={handleScanItem}
        disabled={loading}
        ref={scanButtonRef}
      >
        Scan Item
      </Button>

      {error && (
        <div>
          ⚠️ Error: {error}
        </div>
      )}

      {extractedText && (
        <div>
          <h3>Extracted Text:</h3>
          <pre>{extractedText}</pre>
        </div>
      )}

      {casNumber && nameOptions.length > 0 && (
        <div>
          <h4>CAS Number: {casNumber}</h4>

          {editingName ? (
            <div>
              <TextField
                value={selectedName}
                onChange={handleNameEdit}
                label="Edit Name"
                variant="outlined"
                fullWidth
              />
              <Button onClick={handleSaveEditedName} variant="contained" color="primary">
                Save
              </Button>
            </div>
          ) : (
            <FormControl fullWidth>
              <InputLabel>Select Name</InputLabel>
              <Select
                value={selectedName}
                onChange={handleNameChange}
                label="Select Name"
              >
                {nameOptions.map((name, index) => (
                  <MenuItem key={index} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              <Button
                onClick={() => setEditingName(true)}
                variant="outlined"
                color="primary"
                style={{ marginTop: '10px' }}
              >
                Edit Name
              </Button>
            </FormControl>
          )}

          {/* Add Item Button */}
          <Button
            onClick={handleAddItem}
            variant="contained"
            color="secondary"
            style={{ marginTop: '20px' }}
          >
            Add Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageTextScanner;
