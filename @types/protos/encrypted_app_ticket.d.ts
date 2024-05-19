/**
 * Auto-generated file
 * Fri Feb 02 2024 20:32:00 GMT-0500 (Eastern Standard Time)
 */

import Long from 'long';
import { ValueOf } from 'type-fest';

export type EncryptedAppTicket = {
    ticketVersionNo?: number;
    crcEncryptedticket?: number;
    cbEncrypteduserdata?: number;
    cbEncryptedAppownershipticket?: number;
    encryptedTicket?: Buffer;
};
