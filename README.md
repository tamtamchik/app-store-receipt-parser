# Apple Receipt Parser

[![Latest Version on NPM][ico-version]][link-npm]
[![Scrutinizer build][ico-scrutinizer-build]][link-scrutinizer]
[![Scrutinizer quality][ico-scrutinizer-quality]][link-scrutinizer]
[![Scrutinizer coverage][ico-scrutinizer-coverage]][link-scrutinizer]
[![Software License][ico-license]](./LICENSE)
[![Total Downloads][ico-downloads]][link-downloads]

A lightweight TypeScript library for extracting transaction IDs from Apple's ASN.1 encoded Unified Receipts.

> **Warning!** This library is not a full-fledged receipt parser. 
> It only extracts some information from Apple's ASN.1 encoded Unified Receipts.
> It does not work with the old-style transaction receipts.

> **Documentation for the version 1.x of the library can be found [here](https://github.com/tamtamchik/app-store-receipt-parser/tree/1.x/README.md).**

## Installation

Using npm:

```shell
npm install @tamtamchik/app-store-receipt-parser
```

Using yarn:

```shell
yarn add @tamtamchik/app-store-receipt-parser
```

## Usage

```typescript
import { parseReceipt } from '@tamtamchik/app-store-receipt-parser';

// Unified Receipt string 
const receiptString = "MII...";
const data = parseReceipt(receiptString);

console.log(data);
// {
//   ENVIRONMENT: 'ProductionSandbox',
//   APP_VERSION: '1',
//   ORIGINAL_APP_VERSION: '1.0',
//   OPAQUE_VALUE: 'c4dd4054b0b61a07beb585f6a842e048',
//   SHA1_HASH: '2e0a115beac1c57023a5bd37349955a9ad99db4d',
//   BUNDLE_ID: 'com.mbaasy.ios.demo',
//   RECEIPT_CREATION_DATE: '2015-08-13T07:50:46Z',
//   ORIGINAL_PURCHASE_DATE: '2013-08-01T07:00:00Z',
//   IN_APP_EXPIRES_DATE: '2015-08-10T07:19:32Z',
//   IN_APP_CANCELLATION_DATE: '',
//   IN_APP_QUANTITY: '020101',
//   IN_APP_WEB_ORDER_LINE_ITEM_ID: '0207038d7ea69472c9',
//   IN_APP_PRODUCT_ID: 'monthly',
//   IN_APP_TRANSACTION_ID: '1000000166967782',
//   IN_APP_TRANSACTION_IDS: [
//     '1000000166865231',
//     '1000000166965150',
//     '1000000166965327',
//     '1000000166965895',
//     '1000000166967152',
//     '1000000166967484',
//     '1000000166967782'
//   ],
//   IN_APP_ORIGINAL_TRANSACTION_ID: '1000000166965150',
//   IN_APP_ORIGINAL_TRANSACTION_IDS: [
//     '1000000166865231',
//     '1000000166965150'
//   ],
//   IN_APP_PURCHASE_DATE: '2015-08-10T07:14:32Z',
//   IN_APP_ORIGINAL_PURCHASE_DATE: '2015-08-10T07:12:34Z'
// }
```

## Special Thanks

- [@Jurajzovinec](https://github.com/Jurajzovinec) for his superb contribution to the project.
- [@fechy](https://github.com/fechy) for bringing environment variable support to the lib.

## Contributing

Pull requests are always welcome. If you have bigger changes, please open an issue first to discuss your ideas.

## License

Apple Receipt Parser is [MIT licensed](./LICENSE).

## Third-Party Licenses

This project uses `ASN1.js`, licensed under the BSD-3-Clause License. The license text can be found in [LICENSE](./LICENSE).

---
[![Buy Me A Coffee][ico-coffee]][link-coffee]

[ico-coffee]: https://img.shields.io/badge/Buy%20Me%20A-Coffee-%236F4E37.svg?style=flat-square
[ico-version]: https://img.shields.io/npm/v/@tamtamchik/app-store-receipt-parser.svg?style=flat-square
[ico-license]: https://img.shields.io/npm/l/@tamtamchik/app-store-receipt-parser.svg?style=flat-square
[ico-downloads]: https://img.shields.io/npm/dt/@tamtamchik/app-store-receipt-parser.svg?style=flat-square
[ico-scrutinizer-build]: https://img.shields.io/scrutinizer/build/g/tamtamchik/app-store-receipt-parser/main.svg?style=flat-square
[ico-scrutinizer-quality]: https://img.shields.io/scrutinizer/quality/g/tamtamchik/app-store-receipt-parser/main.svg?style=flat-square
[ico-scrutinizer-coverage]: https://img.shields.io/scrutinizer/coverage/g/tamtamchik/app-store-receipt-parser/main.svg?style=flat-square

[link-coffee]: https://www.buymeacoffee.com/tamtamchik
[link-npm]: https://www.npmjs.com/package/@tamtamchik/app-store-receipt-parser
[link-downloads]: https://www.npmjs.com/package/@tamtamchik/app-store-receipt-parser
[link-scrutinizer]: https://scrutinizer-ci.com/g/tamtamchik/app-store-receipt-parser/
