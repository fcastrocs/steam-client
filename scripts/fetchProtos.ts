/**
 * Fetch Steam Protos and Language constants
 */

import fs from 'fs';

const PROTOS_PATH = 'resources/protos';
const PROTOS_URL = 'https://raw.githubusercontent.com/SteamDatabase/Protobufs/master';

// https://github.com/SteamDatabase/SteamTracking/tree/master/Protobufs
const PROTOS = [
    'contenthubs.proto',
    'encrypted_app_ticket.proto',
    'steammessages_unified_base.steamclient.proto',
    'steammessages_base.proto',
    'enums_clientserver.proto',
    'enums.proto',
    'enums_productinfo.proto',
    'steammessages_storebrowse.steamclient.proto',
    'steammessages_store.steamclient.proto',
    'steammessages_player.steamclient.proto',
    'steammessages_market.steamclient.proto',
    'steammessages_inventory.steamclient.proto',
    'steammessages_econ.steamclient.proto',
    'steammessages_credentials.steamclient.proto',
    'steammessages_clientserver_login.proto',
    'steammessages_clientserver_2.proto',
    'steammessages_clientserver.proto',
    'steammessages_auth.steamclient.proto',
    'steammessages_clientserver_friends.proto',
    'steammessages_clientserver_appinfo.proto'
];

/**
 * Fetch Protos
 */
export default async function fetchProtos() {
    // fetch steam protos
    PROTOS.forEach(async (proto) => {
        let text = await fetch(`${PROTOS_URL}/steam/${proto}`).then((res) => res.text());

        // rename incorrectly named proto message
        if (proto === 'steammessages_clientserver_login.proto') {
            text = text.replace('CMsgClientLogonResponse', 'CMsgClientLogOnResponse');
        }

        if (!text) throw new Error(`Failed to fetch proto ${proto}`);
        fs.writeFileSync(`${PROTOS_PATH}/steam/${proto}`, text);
    });

    // fetch descriptor proto
    const text = await fetch(`${PROTOS_URL}/google/protobuf/descriptor.proto`).then((res) => res.text());
    fs.writeFileSync(`${PROTOS_PATH}/google/protobuf/descriptor.proto`, text);
}
