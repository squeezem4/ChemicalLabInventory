import { Capacitor } from '@capacitor/core';

const platform = Capacitor.getPlatform();
const isMobile = platform === 'ios' || platform === 'android';

// App state variables; Easier access for info that's needed across multiple components
const AppState = {
  isMobile,        
  platform,        // ('ios', 'android', 'web')
  
  // More state variables can be added if we need/want to
};

export default AppState;