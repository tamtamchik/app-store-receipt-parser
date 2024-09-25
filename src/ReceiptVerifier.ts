import { Any, Constructed, Integer, ObjectIdentifier, OctetString, Sequence, Set, verifySchema } from 'asn1js'

import { CONTENT_ID, FIELD_TYPE_ID, FIELD_VALUE_ID } from './constants'

export class ReceiptVerifier {
  private readonly receiptSchema: Sequence
  private readonly fieldSchema: Sequence

  constructor() {
    this.receiptSchema = new Sequence({
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

    this.fieldSchema = new Sequence({
      value: [
        new Integer({ name: FIELD_TYPE_ID }),
        new Integer(),
        new OctetString({ name: FIELD_VALUE_ID }),
      ],
    })
  }

  public verifyReceiptSchema(receipt: string) {
    const receiptVerification = verifySchema(Buffer.from(receipt, 'base64'), this.receiptSchema)
    if (!receiptVerification.verified) {
      throw new Error('Receipt verification failed.')
    }

    return receiptVerification
  }

  public verifyFieldSchema(sequence: Sequence) {
    const fieldVerification = verifySchema(sequence.toBER(), this.fieldSchema)
    if (!fieldVerification.verified) {
      // Return null if the field schema verification fails, so we can skip the field
      return null
    }

    return fieldVerification
  }
}
