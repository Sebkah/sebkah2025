#!/usr/bin/env node
/* eslint-env node */
/* eslint-disable no-undef */

const fs = require('fs');
const path = require('path');

// Path to the generated types file
const typesFilePath = path.resolve(__dirname, '../../../apps/web/sanity/types/api.types.ts');

console.log('Running post-typegen processing...');

try {
    // Check if the file exists
    if (!fs.existsSync(typesFilePath)) {
        console.log('Types file not found, skipping post-processing');
        process.exit(0);
    }

    // Read the generated file
    const content = fs.readFileSync(typesFilePath, 'utf8');

    // Replace @sanity/client with next-sanity
    const updatedContent = content.replace(/@sanity\/client/g, 'next-sanity');

    // Only write if there were changes
    if (content !== updatedContent) {
        fs.writeFileSync(typesFilePath, updatedContent, 'utf8');
        console.log('✅ Replaced @sanity/client with next-sanity in generated types');
    } else {
        console.log('ℹ️ No @sanity/client imports found to replace');
    }

    console.log('Post-typegen processing completed');
} catch (error) {
    console.error('Error during post-typegen processing:', error);
    process.exit(1);
}
