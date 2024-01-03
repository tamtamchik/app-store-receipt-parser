export type ReceiptFieldsKeys =
  | 2
  | 3
  | 4
  | 5
  | 12
  | 18
  | 19
  | 1701
  | 1702
  | 1703
  | 1704
  | 1705
  | 1706
  | 1708
  | 1711
  | 1712

export type ReceiptFieldsValues =
  | 'BUNDLE_ID'
  | 'APP_VERSION'
  | 'OPAQUE_VALUE'
  | 'SHA1_HASH'
  | 'RECEIPT_CREATION_DATE'
  | 'ORIGINAL_PURCHASE_DATE'
  | 'ORIGINAL_APP_VERSION'
  | 'IN_APP_QUANTITY'
  | 'IN_APP_PRODUCT_ID'
  | 'IN_APP_TRANSACTION_ID'
  | 'IN_APP_PURCHASE_DATE'
  | 'IN_APP_ORIGINAL_TRANSACTION_ID'
  | 'IN_APP_ORIGINAL_PURCHASE_DATE'
  | 'IN_APP_EXPIRES_DATE'
  | 'IN_APP_WEB_ORDER_LINE_ITEM_ID'
  | 'IN_APP_CANCELLATION_DATE'

/**
 * Receipt fields
 * @see https://developer.apple.com/library/archive/releasenotes/General/ValidateAppStoreReceipt/Chapters/ReceiptFields.html
 */
export const RECEIPT_FIELDS_MAP: ReadonlyMap<ReceiptFieldsKeys, ReceiptFieldsValues> = new Map([
  [2, 'BUNDLE_ID'],
  [3, 'APP_VERSION'],
  [4, 'OPAQUE_VALUE'],
  [5, 'SHA1_HASH'],
  [12, 'RECEIPT_CREATION_DATE'],
  [18, 'ORIGINAL_PURCHASE_DATE'],
  [19, 'ORIGINAL_APP_VERSION'],
  [1701, 'IN_APP_QUANTITY'],
  [1702, 'IN_APP_PRODUCT_ID'],
  [1703, 'IN_APP_TRANSACTION_ID'],
  [1704, 'IN_APP_PURCHASE_DATE'],
  [1705, 'IN_APP_ORIGINAL_TRANSACTION_ID'],
  [1706, 'IN_APP_ORIGINAL_PURCHASE_DATE'],
  [1708, 'IN_APP_EXPIRES_DATE'],
  [1711, 'IN_APP_WEB_ORDER_LINE_ITEM_ID'],
  [1712, 'IN_APP_CANCELLATION_DATE'],
])

