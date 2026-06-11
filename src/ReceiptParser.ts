import * as ASN1 from 'asn1js'

import {
  CONTENT_ID,
  FIELD_TYPE_ID,
  FIELD_VALUE_ID,
  IN_APP,
  RECEIPT_FIELDS_MAP,
  ReceiptFieldsKeyNames, ReceiptFieldsKeyValues,
} from './constants'

import { ReceiptVerifier } from './ReceiptVerifier'

export type Environment = 'Production' | 'ProductionSandbox' | (string & {})

export type InAppReceipt = Partial<Record<ReceiptFieldsKeyNames, string>>

export type ParsedReceipt = Partial<Record<ReceiptFieldsKeyNames, string>> & {
  ENVIRONMENT: Environment
  IN_APP_RECEIPTS: InAppReceipt[]
  IN_APP_ORIGINAL_TRANSACTION_IDS: string[]
  IN_APP_TRANSACTION_IDS: string[]
}

class ReceiptParser {
  private readonly parsed: ParsedReceipt
  private readonly receiptVerifier: ReceiptVerifier

  constructor() {
    this.receiptVerifier = new ReceiptVerifier()
    this.parsed = this.createInitialParsedReceipt()
  }

  public parseReceipt(receipt: string): ParsedReceipt {
    if (receipt.trim() === '') {
      throw new Error('Receipt must be a non-empty string.')
    }

    const rootSchemaVerification = this.receiptVerifier.verifyReceiptSchema(receipt)
    const content = rootSchemaVerification.result[CONTENT_ID] as ASN1.OctetString

    this.parseReceiptContent(content)
    this.validateParsedFields()
    this.deduplicateArrayFields()

    return this.parsed
  }

  private createInitialParsedReceipt(): ParsedReceipt {
    return {
      ENVIRONMENT: 'Production',
      IN_APP_RECEIPTS: [],
      IN_APP_ORIGINAL_TRANSACTION_IDS: [],
      IN_APP_TRANSACTION_IDS: [],
    }
  }

  private parseReceiptContent(content: ASN1.OctetString, inAppReceipt?: InAppReceipt): void {
    const sequences = this.extractSequencesFromContent(content)
    sequences.forEach(sequence => this.processSequence(sequence, inAppReceipt))
  }

  private extractSequencesFromContent(content: ASN1.OctetString): ASN1.Sequence[] {
    const [contentSet] = content.valueBlock.value as ASN1.Set[]
    return contentSet.valueBlock.value
      .filter(v => v instanceof ASN1.Sequence) as ASN1.Sequence[]
  }

  private processSequence(sequence: ASN1.Sequence, inAppReceipt?: InAppReceipt): void {
    const verifiedSequence = this.receiptVerifier.verifyFieldSchema(sequence)
    if (verifiedSequence) {
      this.handleVerifiedSequence(verifiedSequence, inAppReceipt)
    }
  }

  private handleVerifiedSequence(
    verifiedSequence: ASN1.CompareSchemaSuccess,
    inAppReceipt?: InAppReceipt,
  ): void {
    const fieldKey = (verifiedSequence.result[FIELD_TYPE_ID] as ASN1.Integer).valueBlock.valueDec
    const fieldValue = verifiedSequence.result[FIELD_VALUE_ID] as ASN1.OctetString

    const handler = this.getFieldHandler(fieldKey, inAppReceipt)
    handler(fieldValue)
  }

  private getFieldHandler(
    fieldKey: number,
    inAppReceipt?: InAppReceipt,
  ): (fieldValue: ASN1.OctetString) => void {
    if (fieldKey === IN_APP) {
      return (fieldValue: ASN1.OctetString) => {
        const parsedInAppReceipt: InAppReceipt = {}
        this.parseReceiptContent(fieldValue, parsedInAppReceipt)
        this.parsed.IN_APP_RECEIPTS.push(parsedInAppReceipt)
      }
    }
    if (this.isValidReceiptFieldKey(fieldKey)) {
      const name = RECEIPT_FIELDS_MAP.get(fieldKey)!
      return (fieldValue: ASN1.OctetString) => {
        this.addFieldToReceipt(name, this.extractStringValue(fieldValue), inAppReceipt)
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

  private addFieldToReceipt(name: ReceiptFieldsKeyNames, value: string, inAppReceipt?: InAppReceipt): void {
    this.addToArrayFieldIfApplicable(name, value)
    this.parsed[name] = value
    if (inAppReceipt) {
      inAppReceipt[name] = value
    }
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
    // In-app fields are optional: a valid receipt may contain no in-app purchases.
    const missingFields = Array.from(RECEIPT_FIELDS_MAP.values())
      .filter(fieldKey => !fieldKey.startsWith('IN_APP_'))
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
