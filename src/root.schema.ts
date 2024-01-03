import { Any, Constructed, Integer, ObjectIdentifier, OctetString, Sequence, Set } from 'asn1js'

import { CONTENT_ID } from './constants'

/**
 * Root schema of an app store receipt
 * In order to modify root schema, inspect desired receipt using @see https://lapo.it/asn1js/
 */
export const rootSchema: Sequence = new Sequence({
  value: [
    new ObjectIdentifier(),
    new Constructed({
      idBlock: { tagClass: 3, tagNumber: 0 },
      value: [
        new Sequence({
          value: [
            new Integer(),
            new Set({
              value: [
                new Sequence({
                  value: [new ObjectIdentifier(), new Any()],
                }),
              ],
            }),
            new Sequence({
              value: [
                new ObjectIdentifier(),
                new Constructed({
                  idBlock: { tagClass: 3, tagNumber: 0 },
                  value: [new OctetString({ name: CONTENT_ID })],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
