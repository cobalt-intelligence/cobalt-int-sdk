#!/usr/bin/env bash
set -e

echo "Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

echo "Upgrading dependencies (excluding stripe)..."
npx npm-check-updates -u --reject stripe

echo "Installing updated dependencies..."
npm install

echo "Running npm audit fix..."
npm audit fix || true

echo "Done."
