import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateIndex(dir, indexFile) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const relativePath = './' + path.relative(path.dirname(indexFile), fullPath).replace(/\\/g, '/');
        const importPath = relativePath.replace('.d.ts', '') + '.js'; // Append .js

        if (fs.statSync(fullPath).isDirectory()) {
            generateIndex(fullPath, indexFile);
        } else if (file.endsWith('.d.ts') && file !== 'index.d.ts') {
            const fileContent = fs.readFileSync(fullPath, 'utf-8');
            let exportStatement = '';

            // Check for named exports
            const hasNamedExports = /export\s+(?!default)/m.test(fileContent);

            if (hasNamedExports) {
                exportStatement += `export * from '${importPath}';\n`;
            }

            fs.appendFileSync(indexFile, exportStatement);
        }
    });
}

const typesDir = path.resolve(__dirname, '../@types');
const indexFile = path.join(typesDir, 'all-types.d.ts');

// Clear the existing index.d.ts file
fs.writeFileSync(indexFile, '');

// Generate the index.d.ts file
generateIndex(typesDir, indexFile);
console.log('all-types.d.ts generated successfully.');
