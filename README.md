# Chemical Lab Inventory

This is a full-stack application for managing a chemical inventory. The application is built using React, Firebase, and Capacitor. This is a capstone project for our client, Tomas Marangoni, in partial fulfillment of the Computer Science BS degree for the University of Maine. Our client is a graduate chemistry professor that conducts research and experiments using a wide variety of chemicals. Our team was asked to develop a method to scan chemical labels to automate adding them into a chemical inventory. This would automatically fill out relevant information about sensitive chemicals and save operating times of our client, his peers, and his research students. Our client works in the University of Maine’s Frontier Institute for Research in Sensor Technologies (FIRST), which we aim to supplement with the final release of this project.

## Features

- User authentication using Firebase
- Chemical inventory management
- Image recognition OCR Technology
- CSV file export
- Responsive design for mobile and desktop devices

## Installation



## Configuration

The application uses environment variables for configuration. The following variables are required:

- `REACT_APP_FIREBASE_API_KEY`: the Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN`: the Firebase authentication domain
- `REACT_APP_FIREBASE_PROJECT_ID`: the Firebase project ID

## Development

The application uses React, Firebase, and Capacitor. The code is organized into the following directories:

- `src`: the React application code
- `android`: the Android native project
- `ios`: the iOS native project
- `public`: the public assets

The application uses the following dependencies:

- `firebase`: the Firebase JavaScript SDK
- `@capacitor/core`: the Capacitor core library
- `@capacitor/android`: the Capacitor Android library
- `@capacitor/ios`: the Capacitor iOS library
- `@capacitor-community/image-to-text`: the Capacitor image recognition library
- `react-router-dom`: the React Router library
- `react-scripts`: the React development server

## Deployment

The application can be deployed to a web server or to a mobile device. The following scripts are available:

- `npm run build`: builds the application for production
- `npm run deploy`: deploys the application to a web server
