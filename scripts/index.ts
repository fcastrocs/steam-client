/**
 * Fetch Steam Protos
 * Build Steam Language (enums and proto types)
 */

import fs from 'fs';
import fetchProtos from './fetchProtos';
import buildEnums from './buildEnumsAndProtoTypings';

const LANGUAGE_PATH = 'resources/language/';
const PROTOS_TYPES_PATH = '@types/protos/';

(async () => {
    await fetchProtos();
    await buildEnums();
})();
