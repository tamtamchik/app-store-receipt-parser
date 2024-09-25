/** Identifier for in-app receipt fields (starting with 17*) */
export const IN_APP: number = 17

/** Identifies pkcs7 content information encoded as Octet string  */
export const CONTENT_ID = 'pkcs7_content'

/** Identifies field type id information */
export const FIELD_TYPE_ID: string = 'FieldType'

/** Identifies field value information encoded as Octet string */
export const FIELD_VALUE_ID: string = 'FieldTypeOctetString'

export type ReceiptFieldsKeyValues =
  | 0     // Environment
  | 2     // Bundle ID
  | 3     // App version
  | 4     // Opaque value
  | 5     // SHA-1 hash
  | 12    // Receipt creation date
  | 18    // Original purchase date
  | 19    // Original app version
  | 1701  // In-app quantity
  | 1702  // In-app product ID
  | 1703  // In-app transaction ID
  | 1704  // In-app purchase date
  | 1705  // In-app original transaction ID
  | 1706  // In-app original purchase date
  | 1708  // In-app expires date
  | 1711  // In-app web order line item ID
  | 1712  // In-app cancellation date

export type ReceiptFieldsKeyNames =
  | 'ENVIRONMENT'
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
export const RECEIPT_FIELDS_MAP: ReadonlyMap<ReceiptFieldsKeyValues, ReceiptFieldsKeyNames> = new Map([
  [0, 'ENVIRONMENT'],
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
