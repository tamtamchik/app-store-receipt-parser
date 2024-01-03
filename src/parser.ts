import * as ASN1JS from 'asn1js'

import { RECEIPT_FIELDS_MAP, ReceiptFieldsKeys, ReceiptFieldsValues } from './mappings'
import { CONTENT_ID, FIELD_TYPE_ID, FIELD_VALUE_ID, IN_APP } from './constants'

import { rootSchema } from './root.schema'
import { fieldSchema } from './field.schema'

export type ParsedReceipt = Record<ReceiptFieldsValues, string> & {
  IN_APP_ORIGINAL_TRANSACTION_IDS: string[]
  IN_APP_TRANSACTION_IDS: string[]
}

function isReceiptFieldKey (value: unknown): value is ReceiptFieldsKeys {
  return Boolean(value && typeof value === 'number' && RECEIPT_FIELDS_MAP.has(value as ReceiptFieldsKeys))
}

function isParsedReceiptContentComplete (data: Partial<ParsedReceipt>): data is ParsedReceipt {
  for (const fieldKey of RECEIPT_FIELDS_MAP.values()) {
    if (!(fieldKey in data)) {
      return false
    }
  }
  return true
}

function extractValue (field: ASN1JS.OctetString): string {
  const [fieldValue] = field.valueBlock.value

  if (fieldValue instanceof ASN1JS.IA5String || fieldValue instanceof ASN1JS.Utf8String) {
    return fieldValue.valueBlock.value
  }

  return field.toJSON().valueBlock.valueHex
}

function processField (parsedContent: Partial<ParsedReceipt>, fieldKey: number, fieldValue: ASN1JS.OctetString) {
  if (fieldKey === IN_APP) {
    parseOctetStringContent(parsedContent, fieldValue)
    return
  }

  if (!isReceiptFieldKey(fieldKey)) {
    return
  }

  const parsedReceiptContentFieldKey = RECEIPT_FIELDS_MAP.get(fieldKey)!
  const value = extractValue(fieldValue)

  parsedContent[parsedReceiptContentFieldKey] = value

  if (parsedReceiptContentFieldKey === 'IN_APP_ORIGINAL_TRANSACTION_ID') {
    parsedContent.IN_APP_ORIGINAL_TRANSACTION_IDS = Array.from(
      new Set([...parsedContent.IN_APP_ORIGINAL_TRANSACTION_IDS || [], value])
    )
  }

  if (parsedReceiptContentFieldKey === 'IN_APP_TRANSACTION_ID') {
    parsedContent.IN_APP_TRANSACTION_IDS = Array.from(
      new Set([...parsedContent.IN_APP_TRANSACTION_IDS || [], value])
    )
  }
}

function parseOctetStringContent (parsedContent: Partial<ParsedReceipt>, content: ASN1JS.OctetString) {
  const [contentSet] = content.valueBlock.value as ASN1JS.Set[]
  const contentSetSequences = contentSet.valueBlock.value
    .filter(v => v instanceof ASN1JS.Sequence) as ASN1JS.Sequence[]

  for (const sequence of contentSetSequences) {
    const verifiedSequence = ASN1JS.verifySchema(sequence.toBER(), fieldSchema)
    // The schema does not follow content field schema structure, so we cannot extract the field type and value
    if (!verifiedSequence.verified) {
      continue
    }

    // We are confident to use "as" assertion because Integer type is guaranteed by positive verification above
    const fieldKey = (verifiedSequence.result[FIELD_TYPE_ID] as ASN1JS.Integer).valueBlock.valueDec
    const fieldValueOctetString = verifiedSequence.result[FIELD_VALUE_ID] as ASN1JS.OctetString

    processField(parsedContent, fieldKey, fieldValueOctetString)
  }
}

export function parseReceipt (receipt: string): ParsedReceipt {
  const rootSchemaVerification = ASN1JS.verifySchema(Buffer.from(receipt, 'base64'), rootSchema)
  if (!rootSchemaVerification.verified) {
    throw new Error('Root schema verification failed')
  }

  const parsedContent: Partial<ParsedReceipt> = {}
  const content = rootSchemaVerification.result[CONTENT_ID] as ASN1JS.OctetString

  parseOctetStringContent(parsedContent, content)

  // Verify if the parsed content contains all the required fields
  if (!isParsedReceiptContentComplete(parsedContent)) {
    const missingProps = []
    for (const fieldKey of RECEIPT_FIELDS_MAP.values()) {
      if (!(fieldKey in parsedContent)) {
        missingProps.push(fieldKey)
      }
    }

    throw new Error(`Missing required fields: ${missingProps.join(', ')}`)
  }

  return parsedContent as ParsedReceipt
}
