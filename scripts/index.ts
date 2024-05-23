/**
 * Fetch Steam Protos
 * Build Steam Language (enums and proto types)
 */

import fetchProtos from './fetchProtos';
import buildEnums from './buildEnumsAndProtoTypings';

(async () => {
    await fetchProtos();
    await buildEnums();
})();
