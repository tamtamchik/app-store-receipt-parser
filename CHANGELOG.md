# Changelog

## 2.3.0

### Added

- Added `IN_APP_RECEIPTS` to parsed receipts, exposing each supported in-app purchase receipt as a structured object.
- Exported the `InAppReceipt` type from the package entrypoint.

### Changed

- Updated package metadata and documentation to describe selected receipt field parsing beyond transaction ID extraction.
- Updated the package version to `2.3.0`.

### Maintenance

- Updated dependency lockfile entries already merged into `main`.
- Pinned GitHub Actions workflow actions by commit SHA and constrained Dependabot update cadence.
