/**
 * Fetch Steam Protos
 * Build Steam Language (enums and proto types)
 */

import fetchProtos from './fetchProtos';
import buildEnums from './buildEnumsAndProtoTypings';
import bundleTsTypes from './bundleTsTypes';

(async () => {
    await fetchProtos();
    await buildEnums();
    bundleTsTypes();
})();
