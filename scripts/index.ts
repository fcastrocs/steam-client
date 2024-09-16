/**
 * Fetch Steam Protos
 * Build Steam Language (enums and proto types)
 */

import fetchProtos from './fetchProtos';
import genSteamLanguage from './genSteamLanguage';
import bundleTsTypes from './bundleTsTypes';

(async () => {
    await fetchProtos();
    await genSteamLanguage();
    bundleTsTypes();
})();
