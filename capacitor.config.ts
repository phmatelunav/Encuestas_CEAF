import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Encuestas CEAF',
  webDir: 'dist',
  plugins: {
    Filesystem: {
      // Configuration if needed for filesystem but usually defaults are fine.
    }
  }
};

export default config;
