---
title: PDF
---

PDF (Portable Document Format) is the standard file format for formatted documents intended for print, archive, or reliable cross-system exchange. The Ballerina `ballerina/pdf` module (v0.9.0) provides programmatic HTML-to-PDF rendering, text extraction, and page-to-image conversion, enabling you to generate formatted documents and read existing PDFs directly from Ballerina integration flows. All rendering runs locally — no headless browser or external service is required.

## Key Features

- Convert HTML documents (with inline CSS and data-URL images) to PDF bytes using `parseHtml`
- Configure page size (A4, LETTER, LEGAL, or custom width/height), margins, and fonts per conversion
- Load non-Latin fonts via `customFonts` for CJK, Arabic, Hebrew, and other scripts
- Automatic glyph subsetting — only the characters actually used are embedded in the output PDF
- Extract text content from PDFs by byte array, file path, or URL
- Convert PDF pages to Base64-encoded PNG images by byte array, file path, or URL

## Functions

Functions are the operations you invoke from your integration to generate or process PDFs. `ballerina/pdf` exposes them at the package level — there is no client type to instantiate.

| Category | Functions |
|--------|---------|
| HTML → PDF rendering | `parseHtml` |
| Text extraction | `extractText`, `fileExtractText`, `urlExtractText` |
| Image conversion | `toImages`, `fileToImages`, `urlToImages` |

See the **[Action Reference](action-reference.md)** for the full list of functions, parameters, return types, and sample code.

## Documentation

* **[Action Reference](action-reference.md)**: Full reference for all module functions — parameters, return types, and sample code.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this module, please create a pull request in the following repository.

* [PDF Module GitHub repository](https://github.com/ballerina-platform/module-ballerina-pdf)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.
