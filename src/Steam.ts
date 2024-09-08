/* eslint-disable no-bitwise */
/**
 * Low-level Steam functionality
 */

import { randomBytes } from 'crypto';
import Credentials from './services/Credentials.js';
import Player from './services/Player.js';
import Econ from './services/Econ.js';
import Store from './services/Store.js';
import Auth from './services/Auth.js';
import type { RememberedMachine } from '../@types/index.js';
import Connection from './connections/Connection.js';

export default abstract class Steam extends Connection {
    readonly auth: Auth;

    readonly credentials: Credentials;

    readonly player: Player;

    readonly econ: Econ;

    readonly store: Store;

    rememberedMachine: RememberedMachine;

    constructor() {
        super();

        this.auth = new Auth(this);
        this.credentials = new Credentials(this);
        this.player = new Player(this);
        this.econ = new Econ(this);
        this.store = new Store(this);

        this.rememberedMachine = {
            id: createMachineId(),
            name: createMachineName()
        };
    }
}

function createMachineName() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const name =
        chars[(Math.random() * 26) | 0] +
        chars[(Math.random() * 26) | 0] +
        chars[(Math.random() * 26) | 0] +
        chars[(Math.random() * 26) | 0] +
        chars[(Math.random() * 26) | 0];
    return `DESKTOP-${name}-IDLE`;
}

function createMachineId() {
    const hexBB3 = randomBytes(20).toString('hex');
    const hexFF2 = randomBytes(20).toString('hex');
    const hex3B3 = randomBytes(20).toString('hex');

    return Buffer.from(
        `004D6573736167654F626A656374000142423300${hexBB3}000146463200${hexFF2}000133423300${hex3B3}000808`,
        'hex'
    );
}
