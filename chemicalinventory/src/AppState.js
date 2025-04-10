// AppState.js
import { Capacitor } from '@capacitor/core';

const platform = Capacitor.getPlatform();
const isCapacitorMobile = platform === 'ios' || platform === 'android';

// Additional check for mobile web browsers
const isMobileBrowser = /Mobi|Android|iPhone/i.test(navigator.userAgent);

// Mobile if it's either a mobile app OR mobile browser
const isMobile = isCapacitorMobile || isMobileBrowser;


const AppState = {
  isMobile,
  platform,
};


// // AppState.js --- FORCED MOBILE ON ALL PLATFORMS
// const AppState = {
//   isMobile: true,
//   platform: "forced-mobile", // optional, just for clarity/debugging
// };



export default AppState;
