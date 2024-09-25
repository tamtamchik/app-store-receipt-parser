import * as ASN1 from 'asn1js'

import { RECEIPT_FIELDS_MAP, ReceiptFieldsKeyNames, ReceiptFieldsKeyValues } from './mappings'
import { CONTENT_ID, FIELD_TYPE_ID, FIELD_VALUE_ID, IN_APP } from './constants'
import { verifyFieldSchema, verifyReceiptSchema } from './verifications'

export type Environment = 'Production' | 'ProductionSandbox' | string

export type ParsedReceipt = Partial<Record<ReceiptFieldsKeyNames, string>> & {
  ENVIRONMENT: Environment
  IN_APP_ORIGINAL_TRANSACTION_IDS: string[]
  IN_APP_TRANSACTION_IDS: string[]
}

class ReceiptParser {
  private readonly parsed: ParsedReceipt

  constructor() {
    this.parsed = this.createInitialParsedReceipt()
  }

  public parseReceipt(receipt: string): ParsedReceipt {
    const rootSchemaVerification = verifyReceiptSchema(receipt)
    const content = rootSchemaVerification.result[CONTENT_ID] as ASN1.OctetString

    this.parseReceiptContent(content)
    this.validateParsedFields()
    this.deduplicateArrayFields()

    return this.parsed
  }

  private createInitialParsedReceipt(): ParsedReceipt {
    return {
      ENVIRONMENT: 'Production',
      IN_APP_ORIGINAL_TRANSACTION_IDS: [],
      IN_APP_TRANSACTION_IDS: [],
    }
  }

  private parseReceiptContent(content: ASN1.OctetString): void {
    const sequences = this.extractSequencesFromContent(content)
    sequences.forEach(this.processSequence.bind(this))
  }

  private extractSequencesFromContent(content: ASN1.OctetString): ASN1.Sequence[] {
    const [contentSet] = content.valueBlock.value as ASN1.Set[]
    return contentSet.valueBlock.value
      .filter(v => v instanceof ASN1.Sequence) as ASN1.Sequence[]
  }

  private processSequence(sequence: ASN1.Sequence): void {
    const verifiedSequence = verifyFieldSchema(sequence)
    if (verifiedSequence) {
      this.handleVerifiedSequence(verifiedSequence)
    }
  }

  private handleVerifiedSequence(verifiedSequence: ASN1.CompareSchemaSuccess): void {
    const fieldKey = (verifiedSequence.result[FIELD_TYPE_ID] as ASN1.Integer).valueBlock.valueDec
    const fieldValue = verifiedSequence.result[FIELD_VALUE_ID] as ASN1.OctetString

    const handler = this.getFieldHandler(fieldKey)
    handler(fieldValue)
  }

  private getFieldHandler(fieldKey: number): (fieldValue: ASN1.OctetString) => void {
    if (fieldKey === IN_APP) {
      return this.parseReceiptContent.bind(this)
    }
    if (this.isValidReceiptFieldKey(fieldKey)) {
      const name = RECEIPT_FIELDS_MAP.get(fieldKey)!
      return (fieldValue: ASN1.OctetString) => {
        this.addFieldToReceipt(name, this.extractStringValue(fieldValue))
      }
    }
    return () => {}
  }

  private isValidReceiptFieldKey(value: unknown): value is ReceiptFieldsKeyValues {
    return typeof value === 'number' && RECEIPT_FIELDS_MAP.has(value as ReceiptFieldsKeyValues)
  }

  private extractStringValue(field: ASN1.OctetString): string {
    const [fieldValue] = field.valueBlock.value

    if (fieldValue instanceof ASN1.IA5String || fieldValue instanceof ASN1.Utf8String) {
      return fieldValue.valueBlock.value
    }

    return field.toJSON().valueBlock.valueHex
  }

  private addFieldToReceipt(name: ReceiptFieldsKeyNames, value: string): void {
    this.addToArrayFieldIfApplicable(name, value)
    this.parsed[name] = value
  }

  private addToArrayFieldIfApplicable(name: ReceiptFieldsKeyNames, value: string): void {
    const arrayFields: Record<string, keyof ParsedReceipt> = {
      'IN_APP_ORIGINAL_TRANSACTION_ID': 'IN_APP_ORIGINAL_TRANSACTION_IDS',
      'IN_APP_TRANSACTION_ID': 'IN_APP_TRANSACTION_IDS',
    }

    const arrayFieldName = arrayFields[name]
    if (arrayFieldName) {
      (this.parsed[arrayFieldName] as string[]).push(value)
    }
  }

  private validateParsedFields(): void {
    const missingFields = Array.from(RECEIPT_FIELDS_MAP.values())
      .filter(fieldKey => !(fieldKey in this.parsed))

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }
  }

  private deduplicateArrayFields(): void {
    this.parsed.IN_APP_ORIGINAL_TRANSACTION_IDS = this.removeDuplicates(this.parsed.IN_APP_ORIGINAL_TRANSACTION_IDS)
    this.parsed.IN_APP_TRANSACTION_IDS = this.removeDuplicates(this.parsed.IN_APP_TRANSACTION_IDS)
  }

  private removeDuplicates(array: string[]): string[] {
    return [...new Set(array)]
  }
}

export function parseReceipt(receipt: string): ParsedReceipt {
  return new ReceiptParser().parseReceipt(receipt)
}
