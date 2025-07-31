import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.expensetracker', 
  appName: 'Expense Tracker',
  webDir: 'www',  
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,  
      launchAutoHide: true,      
      backgroundColor: '#ffffff',  
      androidSplashResourceName: 'splash',  
      iosSplashResourceName: 'Default',  
      showSpinner: false,  
    },
  },
};

export default config;
