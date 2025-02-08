import React, { useState, useRef } from "react";
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { Ocr } from '@capacitor-community/image-to-text';
import { Button } from "@mui/material";
import AppState from "../AppState";

const ImageTextScanner = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [extractedText, setExtractedText] = useState("");
    const scanButtonRef = useRef(null);
  
    const handleScanItem = async () => {
      try {
        setLoading(true);
        setError(null);
        setImagePreview(null);
        setExtractedText("");
  
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
  
        // Extract and display text
        if (result.textDetections && result.textDetections.length > 0) {
          const texts = result.textDetections.map(d => d.text).join("\n");
          setExtractedText(texts);
        } else {
          setExtractedText("No text found in the image");
        }
      } catch (error) {
        console.error('Scan failed:', error);
        setError(error.message || 'Failed to scan item');
      } finally {
        setLoading(false);
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
      </div>
    );
};

export default ImageTextScanner;