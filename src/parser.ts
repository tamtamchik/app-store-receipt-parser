import * as ASN1 from 'asn1js'

import { RECEIPT_FIELDS_MAP, ReceiptFieldsKeyNames, ReceiptFieldsKeyValues } from './mappings'
import { CONTENT_ID, FIELD_TYPE_ID, FIELD_VALUE_ID, IN_APP } from './constants'
import { verifyFieldSchema, verifyReceiptSchema } from './verifications'

export type Environment = 'Production' | 'ProductionSandbox' | string

const uniqueArrayValues = (array: string[]) => Array.from(new Set(array))

export type ParsedReceipt = Partial<Record<ReceiptFieldsKeyNames, string>> & {
  ENVIRONMENT: Environment
  IN_APP_ORIGINAL_TRANSACTION_IDS: string[]
  IN_APP_TRANSACTION_IDS: string[]
}

function isReceiptFieldKey (value: unknown): value is ReceiptFieldsKeyValues {
  return Boolean(typeof value === 'number' && RECEIPT_FIELDS_MAP.has(value as ReceiptFieldsKeyValues))
}

function isParsedReceiptContentComplete (data: ParsedReceipt): data is ParsedReceipt {
  for (const fieldKey of RECEIPT_FIELDS_MAP.values()) {
    if (!(fieldKey in data)) {
      return false
    }
  }

  return true
}

function extractFieldValue (field: ASN1.OctetString): string {
  const [fieldValue] = field.valueBlock.value

  if (fieldValue instanceof ASN1.IA5String || fieldValue instanceof ASN1.Utf8String) {
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

function processField (parsed: ParsedReceipt, fieldKey: number, fieldValue: ASN1.OctetString) {
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

function parseOctetStringContent (parsed: ParsedReceipt, content: ASN1.OctetString) {
  const [contentSet] = content.valueBlock.value as ASN1.Set[]
  const contentSetSequences = contentSet.valueBlock.value
    .filter(v => v instanceof ASN1.Sequence) as ASN1.Sequence[]

  for (const sequence of contentSetSequences) {
    const verifiedSequence = verifyFieldSchema(sequence)
    if (verifiedSequence) {
      // We are confident to use "as" assertion because Integer type is guaranteed by positive verification above
      const fieldKey = (verifiedSequence.result[FIELD_TYPE_ID] as ASN1.Integer).valueBlock.valueDec
      const fieldValueOctetString = verifiedSequence.result[FIELD_VALUE_ID] as ASN1.OctetString

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

  const content = rootSchemaVerification.result[CONTENT_ID] as ASN1.OctetString
  const parsed: ParsedReceipt = {
    ENVIRONMENT: 'Production',
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
