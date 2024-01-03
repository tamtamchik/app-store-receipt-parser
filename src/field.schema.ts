import { Integer, OctetString, Sequence } from 'asn1js'

import { FIELD_TYPE_ID, FIELD_VALUE_ID } from './constants'

export const fieldSchema: Sequence = new Sequence({
  value: [
    new Integer({ name: FIELD_TYPE_ID }),
    new Integer(),
    new OctetString({ name: FIELD_VALUE_ID })
  ],
})
