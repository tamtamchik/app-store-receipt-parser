import { describe, it } from 'node:test'
import assert from 'node:assert'
import { parseReceipt } from '../src'
import fixtures from './fixtures.json'

const { invalidReceipt, validReceipt, validReceipt2 } = fixtures

describe('parseReceipt', () => {
  it('should be defined', () => {
    assert.ok(parseReceipt)
  })

  it('should throw error for invalid receipt', () => {
    assert.throws(() => parseReceipt(invalidReceipt), { message: 'Receipt verification failed.' })
  })

  it('should throw error for empty receipt', () => {
    assert.throws(() => parseReceipt(''), { message: 'Receipt must be a non-empty string.' })
  })

  it('should parse transactions correctly for validReceipt', () => {
    const receipt = parseReceipt(validReceipt)

    assert.ok(receipt)

    assert.deepStrictEqual(receipt.ENVIRONMENT, 'ProductionSandbox')
    assert.deepStrictEqual(receipt.APP_VERSION, '1')
    assert.deepStrictEqual(receipt.ORIGINAL_APP_VERSION, '1.0')
    assert.deepStrictEqual(receipt.OPAQUE_VALUE, 'c4dd4054b0b61a07beb585f6a842e048')
    assert.deepStrictEqual(receipt.SHA1_HASH, '2e0a115beac1c57023a5bd37349955a9ad99db4d')
    assert.deepStrictEqual(receipt.BUNDLE_ID, 'com.mbaasy.ios.demo')
    assert.deepStrictEqual(receipt.RECEIPT_CREATION_DATE, '2015-08-13T07:50:46Z')
    assert.deepStrictEqual(receipt.ORIGINAL_PURCHASE_DATE, '2013-08-01T07:00:00Z')
    assert.deepStrictEqual(receipt.IN_APP_PURCHASE_DATE, '2015-08-10T07:14:32Z')
    assert.deepStrictEqual(receipt.IN_APP_ORIGINAL_PURCHASE_DATE, '2015-08-10T07:12:34Z')
    assert.deepStrictEqual(receipt.IN_APP_EXPIRES_DATE, '2015-08-10T07:19:32Z')
    assert.deepStrictEqual(receipt.IN_APP_CANCELLATION_DATE, '')
    assert.deepStrictEqual(receipt.IN_APP_QUANTITY, '020101')
    assert.deepStrictEqual(receipt.IN_APP_WEB_ORDER_LINE_ITEM_ID, '0207038d7ea69472c9')
    assert.deepStrictEqual(receipt.IN_APP_PRODUCT_ID, 'monthly')

    assert.deepStrictEqual(receipt.IN_APP_TRANSACTION_ID, '1000000166967782')
    assert.deepStrictEqual(receipt.IN_APP_TRANSACTION_IDS, [
      '1000000166865231',
      '1000000166965150',
      '1000000166965327',
      '1000000166965895',
      '1000000166967152',
      '1000000166967484',
      '1000000166967782',
    ])

    assert.deepStrictEqual(receipt.IN_APP_ORIGINAL_TRANSACTION_ID, '1000000166965150')
    assert.deepStrictEqual(receipt.IN_APP_ORIGINAL_TRANSACTION_IDS, [
      '1000000166865231',
      '1000000166965150',
    ])
  })

  it('should parse transactions correctly for validReceipt2', () => {
    const receipt = parseReceipt(validReceipt2)

    assert.ok(receipt)

    assert.deepStrictEqual(receipt.ENVIRONMENT, 'ProductionSandbox')
    assert.deepStrictEqual(receipt.APP_VERSION, '3')
    assert.deepStrictEqual(receipt.ORIGINAL_APP_VERSION, '1.0')
    assert.deepStrictEqual(receipt.OPAQUE_VALUE, '34e2349b0bd662e4ec127a6bfd10af24')
    assert.deepStrictEqual(receipt.SHA1_HASH, '27384ed414759313951ab084a902e4c2f52e64ff')
    assert.deepStrictEqual(receipt.BUNDLE_ID, 'com.belive.app.ios')
    assert.deepStrictEqual(receipt.RECEIPT_CREATION_DATE, '2018-11-13T16:46:31Z')
    assert.deepStrictEqual(receipt.ORIGINAL_PURCHASE_DATE, '2013-08-01T07:00:00Z')
    assert.deepStrictEqual(receipt.IN_APP_PURCHASE_DATE, '2018-11-13T16:46:31Z')
    assert.deepStrictEqual(receipt.IN_APP_ORIGINAL_PURCHASE_DATE, '2018-11-13T16:46:31Z')
    assert.deepStrictEqual(receipt.IN_APP_EXPIRES_DATE, '')
    assert.deepStrictEqual(receipt.IN_APP_CANCELLATION_DATE, '')
    assert.deepStrictEqual(receipt.IN_APP_QUANTITY, '020101')
    assert.deepStrictEqual(receipt.IN_APP_WEB_ORDER_LINE_ITEM_ID, '020100')
    assert.deepStrictEqual(receipt.IN_APP_PRODUCT_ID, 'test2')

    assert.deepStrictEqual(receipt.IN_APP_TRANSACTION_ID, '1000000472106082')
    assert.deepStrictEqual(receipt.IN_APP_TRANSACTION_IDS, ['1000000472106082'])

    assert.deepStrictEqual(receipt.IN_APP_ORIGINAL_TRANSACTION_ID, '1000000472106082')
    assert.deepStrictEqual(receipt.IN_APP_ORIGINAL_TRANSACTION_IDS, ['1000000472106082'])
  })

  it('should handle receipts with unexpected fields', () => {
    const receiptWithExtraFields = validReceipt + 'EXTRA_FIELD_DATA'
    const receipt = parseReceipt(receiptWithExtraFields)

    assert.ok(receipt)
    assert.deepStrictEqual(receipt.ENVIRONMENT, 'ProductionSandbox')
    assert.doesNotMatch(Object.keys(receipt).join(','), /EXTRA_FIELD/)
  })
})
