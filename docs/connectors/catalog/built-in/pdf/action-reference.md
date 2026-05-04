# Actions

The `ballerina/pdf` package exposes the following module-level functions:

| Category | Functions |
|--------|---------|
| [HTML → PDF rendering](#html--pdf-rendering) | `parseHtml` |
| [Text extraction](#text-extraction) | `extractText`, `fileExtractText`, `urlExtractText` |
| [Image conversion](#image-conversion) | `toImages`, `fileToImages`, `urlToImages` |

Functions are package-level — import `ballerina/pdf` and call them directly; there is no client instance.

---

## HTML → PDF rendering

<details>
<summary>parseHtml</summary>

Converts an HTML document to PDF bytes. Supports configurable page size, margins, custom fonts, injected CSS, and an optional maximum-page cap.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `html` | <code>string</code> | Yes | The HTML document to render. Inline CSS and data-URL images are supported. |
| `options` | <code>*ConversionOptions</code> | No | Included-record options — see the [ConversionOptions](#conversionoptions) record below. |

**Returns:** `byte[]|Error` — the rendered PDF as a byte array.

**Sample code:**

```ballerina
byte[] pdfBytes = check pdf:parseHtml("<html><body><h1>Hello</h1></body></html>",
    pageSize = pdf:LETTER,
    margins = {top: 40, bottom: 40, left: 36, right: 36});
```

</details>

---

## Text extraction

<details>
<summary>extractText</summary>

Extracts text content from each page of a PDF document given as bytes.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `pdf` | <code>byte[]</code> | Yes | The PDF document bytes. |

**Returns:** `string[]|Error` — one entry per page.

**Sample code:**

```ballerina
byte[] pdfBytes = check io:fileReadBytes("./document.pdf");
string[] pages = check pdf:extractText(pdfBytes);
```

</details>

<details>
<summary>fileExtractText</summary>

Extracts text content from each page of a PDF file on disk.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `filePath` | <code>string</code> | Yes | Path to the PDF file. |

**Returns:** `string[]|Error` — one entry per page.

**Sample code:**

```ballerina
string[] pages = check pdf:fileExtractText("./document.pdf");
```

</details>

<details>
<summary>urlExtractText</summary>

Extracts text content from each page of a PDF fetched from the given URL.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `url` | <code>string</code> | Yes | URL of the PDF to fetch. |

**Returns:** `string[]|Error` — one entry per page.

**Sample code:**

```ballerina
string[] pages = check pdf:urlExtractText("https://example.com/document.pdf");
```

</details>

---

## Image conversion

<details>
<summary>toImages</summary>

Converts each page of a PDF document (given as bytes) to a Base64-encoded PNG image.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `pdf` | <code>byte[]</code> | Yes | The PDF document bytes. |

**Returns:** `string[]|Error` — one Base64-encoded PNG per page.

**Sample code:**

```ballerina
byte[] pdfBytes = check io:fileReadBytes("./document.pdf");
string[] pageImages = check pdf:toImages(pdfBytes);
```

</details>

<details>
<summary>fileToImages</summary>

Converts each page of a PDF file on disk to a Base64-encoded PNG image.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `filePath` | <code>string</code> | Yes | Path to the PDF file. |

**Returns:** `string[]|Error` — one Base64-encoded PNG per page.

**Sample code:**

```ballerina
string[] pageImages = check pdf:fileToImages("./document.pdf");
```

</details>

<details>
<summary>urlToImages</summary>

Converts each page of a PDF fetched from the given URL to a Base64-encoded PNG image.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `url` | <code>string</code> | Yes | URL of the PDF to fetch. |

**Returns:** `string[]|Error` — one Base64-encoded PNG per page.

**Sample code:**

```ballerina
string[] pageImages = check pdf:urlToImages("https://example.com/document.pdf");
```

</details>

---

## Supporting types

### `ConversionOptions`

Options for `parseHtml`, passed as an included record (named arguments).

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `pageSize` | <code>PageSize</code> | `A4` | Page size — one of the `StandardPageSize` enum values (`A4`, `LETTER`, `LEGAL`) or a `CustomPageSize` record. |
| `margins` | <code>PageMargins</code> | `{}` (all 0) | Page margins in points. |
| `fallbackFontSize` | <code>float</code> | `12.0` | Font size applied when CSS does not specify one. |
| `customFonts` | <code>Font[]?</code> | `()` | Fonts to load for scripts outside the bundled fonts' coverage. |
| `additionalCss` | <code>string?</code> | `()` | Extra CSS injected into every render. |
| `maxPages` | <code>int?</code> | `()` | Maximum number of pages to render. Must be greater than 0 if set. |

### `PageSize`

Describes the paper dimensions used when rendering. Use a `StandardPageSize` value for common paper formats, or a `CustomPageSize` record to set explicit width and height. For landscape orientation with a standard size, switch to a `CustomPageSize` with the height and width swapped.

| Member | Description |
|--------|-------------|
| `StandardPageSize` | Enum of common paper formats — `A4`, `LETTER`, `LEGAL`. |
| `CustomPageSize` | Record with explicit `width` and `height` in points. |

### `StandardPageSize`

Enum of the common paper sizes supported out of the box.

| Member | Description |
|--------|-------------|
| `A4` | ISO A4 — 210 × 297 mm. This is the default. |
| `LETTER` | US Letter — 8.5 × 11 inches. |
| `LEGAL` | US Legal — 8.5 × 14 inches. |

### `CustomPageSize`

Custom page dimensions in points (1 point = 1/72 inch). For landscape orientation, swap `width` and `height`.

| Field | Type | Description |
|-------|------|-------------|
| `width` | <code>float</code> | Page width in points. |
| `height` | <code>float</code> | Page height in points. |

### `PageMargins`

Page margins in points. All fields default to 0.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `top` | <code>float</code> | `0` | Top margin. |
| `right` | <code>float</code> | `0` | Right margin. |
| `bottom` | <code>float</code> | `0` | Bottom margin. |
| `left` | <code>float</code> | `0` | Left margin. |

### `Font`

A font to register via `customFonts`. The `family` value is the name referenced from CSS.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `family` | <code>string</code> | — | Font family name. Referenced from CSS `font-family`. |
| `content` | <code>byte[]</code> | — | Raw font file bytes. |
| `bold` | <code>boolean</code> | `false` | Whether this entry represents the bold variant. |
| `italic` | <code>boolean</code> | `false` | Whether this entry represents the italic variant. |

---

## Error types

| Error | Description |
|-------|-------------|
| `Error` | Base error type for the module. |
| `HtmlParseError` | Raised when the input HTML cannot be parsed. |
| `ReadError` | Raised when a PDF input cannot be read. |
| `RenderError` | Raised during rendering — font loading, glyph mapping, PDF assembly. |
