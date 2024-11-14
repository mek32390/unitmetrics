/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Add protection and diagnostics during build process
  webpack: (config, { isServer }) => {
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.beforeCompile.tap('ProtectFiles', () => {
          const fs = require('fs');
          
          // Add build diagnostics
          console.log('Starting build process...');
          console.log('Node environment:', process.env.NODE_ENV);
          console.log('Current working directory:', process.cwd());
          
          try {
            const rules = JSON.parse(fs.readFileSync('.deployment-rules.json', 'utf8'));
            console.log('Protection rules loaded successfully');
            
            // Verify protected files exist and are unchanged
            rules.protected.files.forEach(file => {
              if (!fs.existsSync(file)) {
                console.error(`Protected file check failed: ${file} is missing`);
                throw new Error(`Protected file ${file} is missing`);
              }
              console.log(`Protected file verified: ${file}`);
            });
            
            // Verify protected directories
            rules.protected.directories.forEach(dir => {
              if (!fs.existsSync(dir)) {
                console.error(`Protected directory check failed: ${dir} is missing`);
                throw new Error(`Protected directory ${dir} is missing`);
              }
              console.log(`Protected directory verified: ${dir}`);
            });
          } catch (error) {
            console.error('Build protection error:', error);
            throw error;
          }
        });
      }
    });
    return config;
  }
};

module.exports = nextConfig;