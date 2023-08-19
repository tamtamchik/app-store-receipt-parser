import { fromBER } from 'asn1js'

interface Block {
  blockName: string
  valueBlock: {
    valueHex?: string
    value?: Block[] | string
  }
}

export interface TransactionIds {
  transactionIds: string[]
  originalTransactionIds: string[]
}

/**
 * Parses a receipt string and extracts the transaction IDs from it.
 * Warning! This class does not validate the receipt string, only extracts them.
 */
export class ReceiptParser {
  constructor (private readonly receiptString: string) {}

  static getTransactionIdsFromBlock (block: Block): TransactionIds | null {
    const { valueBlock } = block

    if (!valueBlock || !Array.isArray(valueBlock.value)) {
      return null
    }

    if (valueBlock.value.length === 3) {
      const result = this.extractTransactionIds(valueBlock.value)
      if (result) return result
    }

    const result: TransactionIds = { transactionIds: [], originalTransactionIds: [] }

    for (const innerBlock of valueBlock.value) {
      const innerIds = this.getTransactionIdsFromBlock(innerBlock)
      if (innerIds) {
        result.transactionIds.push(...innerIds.transactionIds)
        result.originalTransactionIds.push(...innerIds.originalTransactionIds)
      }
    }

    // Deduplicate the IDs
    result.transactionIds = [...new Set(result.transactionIds)]
    result.originalTransactionIds = [...new Set(result.originalTransactionIds)]

    return result
  }

  static getTransactionIdsFromReceiptString (receiptString: string): TransactionIds | null {
    const { result } = fromBER(Buffer.from(receiptString, 'base64'))
    return this.getTransactionIdsFromBlock(result.toJSON() as Block)
  }

  /**
   * The transaction ID is encoded as an INTEGER with the value 0x06a7
   */
  private static isTransactionIdBlock (block: Block): boolean {
    return block.blockName === 'INTEGER' && block.valueBlock.valueHex === '06a7'
  }

  /**
   * The original transaction ID is encoded as an INTEGER with the value 0x06a9
   */
  private static isOriginalTransactionIdBlock (block: Block): boolean {
    return block.blockName === 'INTEGER' && block.valueBlock.valueHex === '06a9'
  }

  private static extractIdFromBlock (block: Block): string | null {
    if (!Array.isArray(block.valueBlock.value)) {
      return null
    }
    // The transaction ID is encoded as an OCTET STRING containing a UTF8String
    if (block.blockName === 'OCTET STRING' && block.valueBlock.value[0].blockName === 'UTF8String') {
      return block.valueBlock.value[0].valueBlock.value as string
    }
    return null
  }

  private static extractTransactionIds (blocks: Block[]): TransactionIds | null {
    const [firstBlock, , lastBlock] = blocks
    const result: TransactionIds = { transactionIds: [], originalTransactionIds: [] }

    if (this.isTransactionIdBlock(firstBlock)) {
      const id = this.extractIdFromBlock(lastBlock)
      if (id) result.transactionIds.push(id)
    } else if (this.isOriginalTransactionIdBlock(firstBlock)) {
      const id = this.extractIdFromBlock(lastBlock)
      if (id) result.originalTransactionIds.push(id)
    } else {
      return null
    }

    return result
  }

  getTransactionIds (): TransactionIds | null {
    return ReceiptParser.getTransactionIdsFromReceiptString(this.receiptString)
  }
}
