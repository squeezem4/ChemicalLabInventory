import React, { useState, useRef } from "react";
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { Ocr } from '@capacitor-community/image-to-text';
import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const ImageTextScanner = ({ setNewItem, addItem, onScanComplete, setIsAddItemOpen }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [casNumber, setCasNumber] = useState(null);
  const [nameOptions, setNameOptions] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [manualCas, setManualCas] = useState(""); // State for manual CAS input
  const [isManualInput, setIsManualInput] = useState(false); // Flag to show manual input
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
      setIsManualInput(false); // Reset manual input flag

      // Request camera permissions and take photo
      const photo = await Camera.getPhoto({
        quality: 100,
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

        // Look for "CAS" prefix first
        let casMatch = formattedText.match(/(?:CAS\s*(?:RN)?:?\s*)?(\b\d{2,7}-\d{2}-\d{1}\b)/i);
        
        // If no CAS prefix, find a number matching the CAS format
        if (!casMatch) {
            casMatch = formattedText.match(/\b\d{2,7}-\d{2}-\d{1}\b/);
        }

        const extractedCasNumber = casMatch ? casMatch[1] : null;  // Extract only the CAS number part

        console.log("Extracted CAS Number:", extractedCasNumber);

        // If CAS number is found, fetch the names from the PubChem API
        if (extractedCasNumber) {
          setCasNumber(extractedCasNumber);
          const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/xref/RN/${extractedCasNumber}/property/Title/JSON`);
          const data = await response.json();

          // Check if multiple names are returned and update state
          if (data.PropertyTable && data.PropertyTable.Properties) {
            const names = data.PropertyTable.Properties.map(property => property.Title);
            setNameOptions(names);
            setSelectedName(names[0]); // Set default to the first name
          } else {
            // If no names are returned from the API, trigger manual input
            setExtractedText(`CAS Number: ${extractedCasNumber} - No name found. Please enter manually.`);
            setIsManualInput(true); // Show manual input
          }
        } else {
          setExtractedText("No CAS number found in the image.");
          setIsManualInput(true);  // Trigger manual input if no CAS is detected
        }

        setExtractedText(formattedText);
      } else {
        setExtractedText("No text found in the image.");
        setIsManualInput(true);  // Trigger manual input if no text is found
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

  const handleManualCasChange = (event) => {
    setManualCas(event.target.value); // Update manual CAS input
  };

  const handleManualSubmit = async () => {
    // Validate the CAS number format
    if (/^\d{2,7}-\d{2}-\d{1}$/.test(manualCas)) {
      setCasNumber(manualCas); // Set the manual CAS number

      // Now perform the same API search just like the OCR function
      const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/xref/RN/${manualCas}/property/Title/JSON`);
      const data = await response.json();

      // Check if multiple names are returned and update state
      if (data.PropertyTable && data.PropertyTable.Properties) {
        const names = data.PropertyTable.Properties.map(property => property.Title);
        setNameOptions(names);
        setSelectedName(names[0]); // Set default to the first name
        setIsManualInput(false); // Hide manual input
      } else {
        setExtractedText(`CAS Number: ${manualCas} - No name found.`);
        setIsManualInput(true); // Show manual input again if no names found
      }
    } else {
      alert("Invalid CAS number format. Please enter a valid number.");
    }
  };

  // Handle adding the item (with CAS number and selected name)
  const handleAddItem = () => {
    console.log("Adding item:", { casNumber, selectedName }); // Debugging

    if (casNumber && selectedName) {
      const item = { casnumber: casNumber, name: selectedName };
  
      // Call the setNewItem from parent to add the item
      setNewItem(item);  // This sets the scanned item in the parent component's state
  
      // Now call the addItem function from the parent to add the item to the inventory
      //addItem();

      setIsAddItemOpen(true);
  
      // Show confirmation or alert
      //alert(`Item added with CAS Number: ${casNumber} and Name: ${selectedName}`);
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

    
      {imagePreview && (
        <div>
          <h3>Image Preview:</h3>
          <img src={imagePreview} alt="Scan Preview" style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }} />
        </div>
      )}


      {extractedText && (
        <div>
          <h3>Extracted Text:</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",  // Allow the text to wrap to the next line
              wordWrap: "break-word",  // Ensure long words wrap
              maxWidth: "100%",         // Prevent overflow
              overflowWrap: "break-word", // Prevent breaking of the page layout
            }}
          >
            {extractedText}
          </pre>
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

      {/* Manual CAS Input Field */}
      {isManualInput && (
        <div>
          <TextField
            value={manualCas}
            onChange={handleManualCasChange}
            label="Enter CAS Number"
            variant="outlined"
            fullWidth
          />
          <Button
            onClick={handleManualSubmit}
            variant="contained"
            color="secondary"
            style={{ marginTop: '10px' }}
          >
            Submit CAS Number
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageTextScanner;
