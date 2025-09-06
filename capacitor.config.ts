import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.33e3643a827c4314a401c771688f0997',
  appName: 'metal-health-inspector',
  webDir: 'dist',
  server: {
    url: 'https://33e3643a-827c-4314-a401-c771688f0997.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Geolocation: {
      permissions: {
        location: 'always'
      }
    }
  }
};

export default config;