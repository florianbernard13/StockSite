#!/bin/bash
set -e

# Copier node_modules depuis le cache vers /app
echo "Synchronizing node_modules from cache..."
cp -r /usr/src/cache/node_modules/. /app/node_modules/

# Lancer les services
echo "Starting Flask and Vite..."
npm run dev & flask run --host=0.0.0.0 --reload --debugger