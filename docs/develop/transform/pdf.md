---
title: PDF Processing
---

# PDF Processing

Extract text from existing PDFs, convert PDF pages to images, and generate PDF documents from HTML. The `ballerina/pdf` module provides a single-call API for each task — parsing and rendering run locally, with no external service or headless browser required.

## Text Extraction

Read the textual content of a PDF one page at a time. The module provides three entry points — choose the one that matches where the PDF originates.

### Extracting from PDF Bytes

Use `pdf:extractText` when the PDF is already in memory — for example, when it arrives as an HTTP request payload or comes from another connector call.

1. **Add a Variable step for the PDF bytes** — In the flow designer, click **+** and select **Variable**. If the PDF arrives in an HTTP request, set the type to `byte[]` and assign the request payload.

2. **Add a Function Call step for extraction** — Click **+** and select **Call Function**. Search for `extractText` under **pdf** and configure:
   - **pdf***: `pdfBytes`
   - **Result***: `pages`
   - **Type**: `string[]`

3. **Add a Foreach step** — Click **+** and select **Foreach** under **Control**. Set the **Collection** to `pages` and the **Variable Name** to `pageText`. Inside the loop, process each page's text — index it, search it, or forward it to a downstream service.

```ballerina
import ballerina/io;
import ballerina/pdf;

public function main() returns error? {
    byte[] pdfBytes = check io:fileReadBytes("./report.pdf");
    string[] pages = check pdf:extractText(pdfBytes);

    foreach int i in 0 ..< pages.length() {
        io:println(string `--- Page ${i + 1} ---`);
        io:println(pages[i]);
    }
}
```

### Extracting from a File or URL

When the PDF lives on disk or behind a URL, skip the intermediate `byte[]` and use `fileExtractText` or `urlExtractText` directly.

1. **Add a Function Call step for file extraction** — Click **+** and select **Call Function**. Search for `fileExtractText` under **pdf** and set the input to a file path string such as `"./report.pdf"`. Assign the `string[]` result to a variable named `pages`.

2. **Add a Function Call step for URL extraction** — For PDFs served over HTTP, search for `urlExtractText` under **pdf** instead. Set the input to the URL string. The module fetches the document and returns the same `string[]` shape.

```ballerina
import ballerina/pdf;

public function main() returns error? {
    // From a local file path
    string[] pagesFromFile = check pdf:fileExtractText("./report.pdf");

    // From a URL
    string[] pagesFromUrl = check pdf:urlExtractText("https://example.com/report.pdf");
}
```

## Image Conversion

Render each page of a PDF to a Base64-encoded PNG. Useful for page previews, thumbnails, archival snapshots, or feeding pages to an OCR or vision model.

### Converting from a PDF

The three variants mirror text extraction — bytes, file path, or URL. Each returns a `string[]` where every element is a Base64-encoded PNG for one page.

1. **Add a Function Call step for conversion** — Click **+** and select **Call Function**. Depending on your input, choose one of:
   - `pdf:toImages` — input is `byte[]`
   - `pdf:fileToImages` — input is a file path `string`
   - `pdf:urlToImages` — input is a URL `string`

   Assign the `string[]` result to a variable named `pageImages`.

2. **Add a Foreach step** — Click **+** and select **Foreach** under **Control**. Set the **Collection** to `pageImages` and the **Variable Name** to `pageImage`.

3. **Decode and write each image** — Inside the loop, click **+** and select **Call Function**. Call `array:fromBase64(pageImage)` to obtain the raw PNG bytes, then call `io:fileWriteBytes` to save each page as a separate PNG file.

```ballerina
import ballerina/io;
import ballerina/lang.array;
import ballerina/pdf;

public function main() returns error? {
    string[] pageImages = check pdf:fileToImages("./report.pdf");

    foreach int i in 0 ..< pageImages.length() {
        byte[] pngBytes = check array:fromBase64(pageImages[i]);
        check io:fileWriteBytes(string `./page-${i + 1}.png`, pngBytes);
    }
}
```

## HTML to PDF Rendering

Convert parameterized HTML templates into PDF bytes suitable for download, email attachments, or storage. The rendering engine covers document-style HTML and CSS — tables, inline images, fonts, colored cells, and injected stylesheets — without depending on a headless browser.

### Rendering an HTML String

Read or build an HTML string, then pass it to `pdf:parseHtml` to obtain the PDF bytes.

1. **Add a Variable step for the HTML** — In the flow designer, click **+** and select **Statement** → **Declare Variable**. Set the type to `string` and the name to `html`. Switch the toggle from **Record** to **Expression** and enter the HTML string (use a `string \`...\`` template to interpolate parameters).

2. **Add a Function Call step for rendering** — Click **+** and select **Call Function**. Search for `parseHtml` under **pdf** and configure:
   - **html***: `html`
   - **Result***: `pdfBytes`
   - **Type**: `byte[]`

3. **Add a Function Call step for output** — Click **+** and select **Call Function**. Call `io:fileWriteBytes("./output.pdf", pdfBytes)` to save the PDF to disk, or assign `pdfBytes` to an `http:Response` payload to return it from a service.

```ballerina
import ballerina/io;
import ballerina/pdf;

public function main() returns error? {
    string html = string `<!DOCTYPE html>
<html>
  <body style="font-family: 'Liberation Sans'; padding: 24px;">
    <h1>Invoice #1042</h1>
    <p>Amount due: $240.00</p>
  </body>
</html>`;

    byte[] pdfBytes = check pdf:parseHtml(html);
    check io:fileWriteBytes("./invoice.pdf", pdfBytes);
}
```

### Customizing Page Size, Margins, and Fonts

`parseHtml` accepts a set of named options — page size, margins, a `maxPages` cap, custom fonts for non-Latin scripts, and extra CSS injected into every render.

1. **Add a Variable step for the font bytes (optional)** — If you need to render non-Latin scripts such as Chinese, Japanese, Korean, Arabic, or Devanagari, click **+** and select **Call Function**. Call `io:fileReadBytes("./resources/NotoSansSC.ttf")` and assign the result to a `byte[] & readonly` variable named `fontBytes`.

2. **Add a Function Call step for rendering with options** — Click **+** and select **Call Function**. Search for `parseHtml` under **pdf** and add the named arguments:
   - **html***: `html`
   - **pageSize**: `pdf:LETTER`
   - **margins**: `{top: 36, bottom: 36, left: 40, right: 40}`
   - **customFonts**: `[{family: "NotoSansSC", content: fontBytes}]`
   - **maxPages**: `50`
   - **Result***: `pdfBytes`

```ballerina
import ballerina/io;
import ballerina/pdf;

final byte[] & readonly fontBytes = check io:fileReadBytes("./resources/NotoSansSC.ttf");

public function renderWithOptions(string html) returns byte[]|error {
    return pdf:parseHtml(html,
        pageSize = pdf:LETTER,
        margins = {top: 36, bottom: 36, left: 40, right: 40},
        customFonts = [{family: "NotoSansSC", content: fontBytes}],
        maxPages = 50);
}
```

For the complete list of options, the `StandardPageSize` enum, the `CustomPageSize` record, and the `Font` record, see the [ballerina/pdf action reference](../../connectors/catalog/built-in/pdf/action-reference.md#conversionoptions).

### Supported HTML and CSS

The renderer covers the subset of HTML and CSS needed for document-style templates — headings, paragraphs, tables with `colspan`, solid borders, background colors, percentage widths, inline images, and embedded data URLs all work as expected. Two bundled fonts, `Liberation Sans` and `Liberation Serif`, cover most Western European scripts. For other scripts, load a font via `customFonts`.

The renderer does not support CSS flex, CSS Grid, `position: fixed`, `@font-face` rules, inline `<svg>`, `rowspan`, or non-solid border styles. Unsupported features are silently dropped rather than raising an error — always preview new templates visually before shipping.

For the full list of supported and unsupported features with recommended workarounds, see the [PDF Generation Service tutorial](../../tutorials/pdf-generation-service.md#limitations-and-supported-subset).

## Integration Example: PDF Generation Service

Build an HTTP service that renders a parameterized template into a PDF and returns it as a binary response. The same pattern fits invoices, certificates, boarding passes, and receipts.

1. **Create the HTTP service** — Add an HTTP service with a named path such as `/invoices` and add a resource `GET /render` that accepts query parameters (`customer`, `amount`, `dueDate`).

2. **Change the resource return type** — Set the return type to `http:Response|error`. The PDF is a binary payload, so you need `http:Response` to attach a `byte[]` body and set `Content-Type: application/pdf`.

3. **Add a Function Call step to build the HTML** — Click **+** and select **Call Function**. Call your template function (for example, `buildInvoiceHtml(customer, amount, dueDate)`) and assign the result to a string variable `html`.

4. **Add a Function Call step for rendering** — Click **+** and select **Call Function**. Call `pdf:parseHtml(html)` and assign the result to `pdfBytes`.

5. **Add a Variable step for the response** — Declare an `http:Response` named `response`, then call `response.setBinaryPayload(pdfBytes)` and `response.setContentType("application/pdf")` in follow-up Function Call steps. Return `response`.

```ballerina
import ballerina/http;
import ballerina/pdf;

configurable int port = 8290;

service /invoices on new http:Listener(port) {

    resource function get render(
            string customer,
            decimal amount,
            string dueDate) returns http:Response|error {

        string html = buildInvoiceHtml(customer, amount, dueDate);
        byte[] pdfBytes = check pdf:parseHtml(html);

        http:Response response = new;
        response.setBinaryPayload(pdfBytes);
        response.setContentType("application/pdf");
        return response;
    }
}

function buildInvoiceHtml(string customer, decimal amount, string dueDate)
        returns string {
    return string `<!DOCTYPE html>
<html>
  <body style="font-family: 'Liberation Sans'; padding: 24px;">
    <h1>Invoice</h1>
    <p>Customer: ${customer}</p>
    <p>Amount due: $${amount}</p>
    <p>Due by: ${dueDate}</p>
  </body>
</html>`;
}
```

For a full step-by-step walkthrough covering templates, custom fonts for non-Latin scripts, and the full list of supported features, follow the [PDF Generation Service tutorial](../../tutorials/pdf-generation-service.md).

## Best Practices

- **Prefer `file*` and `url*` variants when the input location is fixed** — they skip the intermediate `byte[]` and reduce one step of plumbing.
- **Parameterize HTML templates with string templates** — use Ballerina's `string \`...\`` syntax for interpolation rather than string concatenation; it is safer and more readable.
- **Escape untrusted input before rendering** — any value that ends up in the HTML must be escaped for angle brackets, quotes, and ampersands. Treat query parameters, form inputs, and user-supplied data as untrusted.
- **Load custom fonts once at module level** — font files are several megabytes each. Read them into a `readonly` module-level variable at startup so every render reuses the same bytes.
- **Set `maxPages` on user-driven renders** — cap the number of pages rendered from any template that takes external input to avoid runaway documents and memory pressure.

## What's Next

- [ballerina/pdf action reference](../../connectors/catalog/built-in/pdf/action-reference.md) — full signatures, supporting records, and error types.
- [PDF Generation Service](../../tutorials/pdf-generation-service.md) — end-to-end tutorial covering HTML templates, custom fonts, and production considerations.
- [HTTP Service](../integration-artifacts/service/http-service.md) — return PDFs as binary payloads from an HTTP resource.
