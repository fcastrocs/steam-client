/**
 * This Script bundles all .d.ts files into a single all-types.d.ts file that is then exported by index.d.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function bundleTsTypes() {
    const typesDir = path.resolve(__dirname, '../@types');
    const allTypesFile = path.join(typesDir, 'all-types.d.ts');

    // Delete all-types.d.ts
    if (fs.existsSync(allTypesFile)) {
        fs.unlinkSync(allTypesFile);
    }

    // Generate the all-types.d.ts file
    processTypeFiles(typesDir, allTypesFile);
    console.log('all-types.d.ts generated successfully.');
}

function processTypeFiles(dir, indexFile) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const relativePath = './' + path.relative(path.dirname(indexFile), fullPath).replace(/\\/g, '/');
        const importPath = relativePath.replace('.d.ts', '') + '.js'; // Append .js

        if (fs.statSync(fullPath).isDirectory()) {
            processTypeFiles(fullPath, indexFile);
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
