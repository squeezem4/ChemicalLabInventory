import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "../csvFile.css";

// Define the order of fields for the CSV
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

const CSVFile = () => {
  const [csvData, setCSVData] = useState([]);

  //get data from db
  useEffect(() => {
    const getCSVData = async () => {
      const querySnapshot = await getDocs(collection(db, "chemicals"));
      const data = querySnapshot.docs.map((doc) => {
        const rawData = doc.data();
        // Ensure data is ordered based on fieldOrder
        const orderedData = fieldOrder.reduce((obj, key) => {
          obj[key] = rawData[key] || ""; // Fill missing fields with empty strings
          return obj;
        }, {});
        return orderedData;
      });
      setCSVData(data);
    };
    getCSVData();
  }, []);

  const handleReturn = () => {
    return window.location.href = "/chemicalinventory";
  };

  const handleClick = () => {
    if (csvData.length === 0) return;

    // Create CSV content
    const csv = [
      fieldOrder.join(","), // CSV header
      ...csvData.map((row) =>
        fieldOrder.map((key) => row[key]).join(",") // Ensure field order in each row
      ),
    ].join("\n");

    // Download the CSV
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chemical_inventory.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="csv-container">
      <h2 className="csv-header">Export Database to CSV</h2>
      <button className="csv-button" onClick={handleClick}>
        Download CSV
      </button>
      <br/><br/>
      <button className="csv-button" onClick={handleReturn}>
        Back to Inventory
      </button>
    </div>
  );
};

export default CSVFile;

