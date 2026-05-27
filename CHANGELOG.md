# Changelog

## 2.3.0 - 2026-05-27

### Added

- Added `IN_APP_RECEIPTS` to parsed receipts, exposing each supported in-app purchase receipt as a structured object.
- Exported the `InAppReceipt` type from the package entrypoint.

### Changed

- Updated package metadata and documentation to describe selected receipt field parsing beyond transaction ID extraction.
- Updated the package version to `2.3.0`.

### Maintenance

- Updated dependency lockfile entries already merged into `main`.
- Updated transitive development dependency resolution for `brace-expansion` to clear npm audit findings.
- Pinned GitHub Actions workflow actions by commit SHA and constrained Dependabot update cadence.

## 2.2.3 - 2026-04-15

### Added

- Added a security policy.
- Added GitHub Actions CI for linting, building, and testing.

### Changed

- Migrated tests from Jest to the Node.js test runner.
- Split linting into `lint` and `lint:fix` scripts.

### Fixed

- Upgraded `asn1js` from `3.0.6` to `3.0.7`.

### Maintenance

- Updated development dependencies and GitHub Actions versions.
- Consolidated ESLint dependencies.

## 2.2.2 - 2025-05-02

### Fixed

- Upgraded `asn1js` from `3.0.5` to `3.0.6`.

### Maintenance

- Updated dependencies.

## 2.2.1 - 2024-09-25

### Fixed

- Fixed exported TypeScript types.

## 2.2.0 - 2024-09-25

### Changed

- Refactored parser and verifier internals into classes.
- Updated TypeScript and ESLint configuration.

### Maintenance

- Updated dependencies.

## 2.1.2 - 2024-05-20

### Maintenance

- Updated the Scrutinizer Node.js version.

## 2.1.1 - 2024-05-06

### Maintenance

- Updated dependencies.

## 2.1.0 - 2024-04-11

### Added

- Added mapping for the `ENVIRONMENT` receipt field.
- Added `Production` as the default parsed environment.

### Fixed

- Fixed parsed receipt completeness checks for the `ENVIRONMENT` field.

### Maintenance

- Updated dependencies and documentation.

## 2.0.0 - 2024-01-10

### Changed

- Refactored the parser implementation for the `2.x` release line.
- Updated documentation and project structure.

## 1.0.1 - 2023-11-14

### Maintenance

- Simplified tests.
- Moved CI from CircleCI to Scrutinizer.

## 1.0.0 - 2023-08-19

### Added

- Added the initial receipt parsing functionality.
- Added tests, publishing configuration, and README documentation.
