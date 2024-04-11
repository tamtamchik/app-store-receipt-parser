import { Any, Constructed, Integer, ObjectIdentifier, OctetString, Sequence, Set, verifySchema } from 'asn1js'

import { CONTENT_ID, FIELD_TYPE_ID, FIELD_VALUE_ID } from './constants'

const receiptSchema = new Sequence({
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

const fieldSchema = new Sequence({
  value: [
    new Integer({ name: FIELD_TYPE_ID }),
    new Integer(),
    new OctetString({ name: FIELD_VALUE_ID }),
  ],
})

export function verifyReceiptSchema (receipt: string) {
  const receiptVerification = verifySchema(Buffer.from(receipt, 'base64'), receiptSchema)
  if (!receiptVerification.verified) {
    throw new Error('Receipt verification failed.')
  }

  return receiptVerification
}

export function verifyFieldSchema (sequence: Sequence) {
  const fieldVerification = verifySchema(sequence.toBER(), fieldSchema)
  if (!fieldVerification.verified) {
    // Return null if the field schema verification fails, so we can skip the field
    return null
  }

  return fieldVerification
}
