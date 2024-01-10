import { IA5String, Integer, OctetString, Sequence, Set, Utf8String } from 'asn1js'

import { RECEIPT_FIELDS_MAP, ReceiptFieldsKeyNames, ReceiptFieldsKeyValues } from './mappings'
import { CONTENT_ID, FIELD_TYPE_ID, FIELD_VALUE_ID, IN_APP } from './constants'
import { verifyFieldSchema, verifyReceiptSchema } from './verifications'
import { uniqueArrayValues } from './utils'

export type ParsedReceipt = Partial<Record<ReceiptFieldsKeyNames, string>> & {
  IN_APP_ORIGINAL_TRANSACTION_IDS: string[]
  IN_APP_TRANSACTION_IDS: string[]
}

function isReceiptFieldKey (value: unknown): value is ReceiptFieldsKeyValues {
  return Boolean(value && typeof value === 'number' && RECEIPT_FIELDS_MAP.has(value as ReceiptFieldsKeyValues))
}

function isParsedReceiptContentComplete (data: ParsedReceipt): data is ParsedReceipt {
  for (const fieldKey of RECEIPT_FIELDS_MAP.values()) {
    if (!(fieldKey in data)) {
      return false
    }
  }

  return true
}

function extractFieldValue (field: OctetString): string {
  const [fieldValue] = field.valueBlock.value

  if (fieldValue instanceof IA5String || fieldValue instanceof Utf8String) {
    return fieldValue.valueBlock.value
  }

  return field.toJSON().valueBlock.valueHex
}

function appendField (parsed: ParsedReceipt, name: ReceiptFieldsKeyNames, value: string) {
  if (name === 'IN_APP_ORIGINAL_TRANSACTION_ID') {
    parsed.IN_APP_ORIGINAL_TRANSACTION_IDS.push(value)
  }

  if (name === 'IN_APP_TRANSACTION_ID') {
    parsed.IN_APP_TRANSACTION_IDS.push(value)
  }

  parsed[name] = value
}

function processField (parsed: ParsedReceipt, fieldKey: number, fieldValue: OctetString) {
  if (fieldKey === IN_APP) {
    parseOctetStringContent(parsed, fieldValue)
    return
  }

  if (!isReceiptFieldKey(fieldKey)) {
    return
  }

  const name = RECEIPT_FIELDS_MAP.get(fieldKey)!
  appendField(parsed, name, extractFieldValue(fieldValue))
}

function parseOctetStringContent (parsed: ParsedReceipt, content: OctetString) {
  const [contentSet] = content.valueBlock.value as Set[]
  const contentSetSequences = contentSet.valueBlock.value.filter(v => v instanceof Sequence) as Sequence[]

  for (const sequence of contentSetSequences) {
    const verifiedSequence = verifyFieldSchema(sequence)
    if (verifiedSequence) {
      // We are confident to use "as" assertion because Integer type is guaranteed by positive verification above
      const fieldKey = (verifiedSequence.result[FIELD_TYPE_ID] as Integer).valueBlock.valueDec
      const fieldValueOctetString = verifiedSequence.result[FIELD_VALUE_ID] as OctetString

      processField(parsed, fieldKey, fieldValueOctetString)
    }
  }
}

function postprocessParsedReceipt (parsed: ParsedReceipt) {
  parsed.IN_APP_ORIGINAL_TRANSACTION_IDS = uniqueArrayValues(parsed.IN_APP_ORIGINAL_TRANSACTION_IDS)
  parsed.IN_APP_TRANSACTION_IDS = uniqueArrayValues(parsed.IN_APP_TRANSACTION_IDS)
}

export function parseReceipt (receipt: string): ParsedReceipt {
  const rootSchemaVerification = verifyReceiptSchema(receipt)

  const content = rootSchemaVerification.result[CONTENT_ID] as OctetString
  const parsed: ParsedReceipt = {
    IN_APP_ORIGINAL_TRANSACTION_IDS: [],
    IN_APP_TRANSACTION_IDS: [],
  }

  parseOctetStringContent(parsed, content)

  // Verify if the parsed content contains all the required fields
  if (!isParsedReceiptContentComplete(parsed)) {
    const missingProps = []
    for (const fieldKey of RECEIPT_FIELDS_MAP.values()) {
      if (!(fieldKey in parsed)) {
        missingProps.push(fieldKey)
      }
    }

    throw new Error(`Missing required fields: ${missingProps.join(', ')}`)
  }

  postprocessParsedReceipt(parsed)

  return parsed as ParsedReceipt
}
