#!/bin/bash

# Build TypeScript files
echo "Building TypeScript files..."
npx tsc

# Copy non-TypeScript files to dist
echo "Copying static files..."

# Copy auth folder
if [ -d "auth" ]; then
    cp -r auth dist/
fi

# Copy public folder
if [ -d "public" ]; then
    cp -r public dist/
fi

# Copy templates folder
if [ -d "templates" ]; then
    cp -r templates dist/
fi

# Copy scripts folder
if [ -d "scripts" ]; then
    cp -r scripts dist/
fi

# Copy package.json for production dependencies
cp package.json dist/

echo "Build completed successfully!"
echo "You can now start the server with: node dist/index.js"
echo "Or use PM2: pm2 start dist/index.js --name api"
