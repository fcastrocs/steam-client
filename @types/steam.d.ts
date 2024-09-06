/* eslint-disable import/prefer-default-export */
/**
 * Manages high-level Steam operations
 */
import { Auth } from './services/Auth.js';
import { Credentials } from './services/Credentials.js';
import { Player } from './services/Player.js';
import { Econ } from './services/Econ.js';
import { Store } from './services/Store.js';
import { Connection } from './connections/Connection.js';
import { RememberedMachine } from './all-types.js';

export abstract class Steam extends Connection {
    readonly service: {
        auth: Auth;
        credentials: Credentials;
        player: Player;
        econ: Econ;
        store: Store;
    };

    rememberedMachine: RememberedMachine;
}
