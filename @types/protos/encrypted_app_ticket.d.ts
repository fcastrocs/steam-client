/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Auto-generated file
 * Thu May 23 2024 22:57:11 GMT-0400 (Eastern Daylight Time)
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
