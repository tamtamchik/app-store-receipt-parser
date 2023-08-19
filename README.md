# Apple Receipt Parser

[![Buy Me A Coffee][ico-coffee]][link-coffee]
[![Latest Version on NPM][ico-version]][link-npm]
[![Software License][ico-license]](./LICENSE)
[![Total Downloads][ico-downloads]][link-downloads]

A lightweight TypeScript library for extracting transaction IDs from Apple's ASN.1 encoded Unified Receipts.

> **Warning!** This library is not a full-fledged receipt parser. 
> It only extracts transaction IDs from the Apple's ASN.1 encoded Unified Receipts.
> It does not work with the old style transactions receipts.

## Installation

Using npm:

```shell
npm install @tamtamchik/apple-receipt-parser
```

Using yarn:

```shell
yarn add @tamtamchik/apple-receipt-parser
```

## Usage

```typescript
import { ReceiptParser } from '@tamtamchik/apple-receipt-parser';

// Unified Receipt string 
const receiptString = "MII...";

// As an instance ...
const parser = new ReceiptParser(receiptString);
const ids = parser.getTransactionIds();
console.log(ids);
// { 
//    transactionIds: ['1000000000000000'], 
//    originalTransactionIds: ['1000000000000000'], 
// }

// ... or as a static method
const ids = ReceiptParser.getTransactionIds(receiptString);
console.log(ids);
// { 
//    transactionIds: ['1000000000000000'], 
//    originalTransactionIds: ['1000000000000000'], 
// }
```

## Contributing

Pull requests are always welcome. If you have bigger changes in mind, please open an issue first to discuss your ideas.

## License

Apple Receipt Parser is [MIT licensed](./LICENSE).

[ico-coffee]: https://img.shields.io/badge/Buy%20Me%20A-Coffee-%236F4E37.svg?style=flat-square
[ico-version]: https://img.shields.io/npm/v/@tamtamchik/apple-receipt-parser.svg?style=flat-square
[ico-license]: https://img.shields.io/npm/l/@tamtamchik/apple-receipt-parser.svg?style=flat-square
[ico-downloads]: https://img.shields.io/npm/dt/@tamtamchik/apple-receipt-parser.svg?style=flat-square

[link-coffee]: https://www.buymeacoffee.com/tamtamchik
[link-npm]: https://www.npmjs.com/package/@tamtamchik/apple-receipt-parser
[link-downloads]: https://www.npmjs.com/package/@tamtamchik/apple-receipt-parser
