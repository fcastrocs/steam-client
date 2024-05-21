/**
 * Fetch Steam Protos
 * Build Steam Language (enums and proto types)
 */

import fs from 'fs';
import fetchProtos from './fetchProtos';
import buildEnums from './buildEnumsAndProtoTypings';

const LANGUAGE_PATH = './src/resources/language/';
const PROTOS_TYPES_PATH = '@types/protos/';

(async () => {
    await fetchProtos();
    await buildEnums();
    declareEnumTypes();
})();

function declareEnumTypes() {
    const filenames = fs.readdirSync(LANGUAGE_PATH);

    filenames.forEach((filename) => {
        let file = fs.readFileSync(LANGUAGE_PATH + filename).toString();
        file = file.replace(/export enum/g, 'declare const');
        file = file.replace(/ {/g, ' = {');
        file = file.replace(/}/g, '} as const;');
        // file = file.replace(/ = /g, " = ");
        fs.writeFileSync(
            `${PROTOS_TYPES_PATH}enums/${filename.replace('.ts', '.d.ts')}`,
            file
        );
    });
}
