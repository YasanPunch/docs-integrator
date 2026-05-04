---
title: PDF Generation Service
---

# PDF Generation Service

A service that receives parameters over HTTP, populates an HTML template, and returns the rendered PDF. The example in this tutorial is a boarding pass, but the same pattern fits certificates, invoices, receipts, tickets, shipping labels, and any other parameter-driven document.

## What You'll Build

```mermaid
flowchart LR
    Client([GET /boardingpass/render<br/>?passengerName=…&flightNumber=…])
    subgraph Service["PDF Generation Service"]
        Resource[HTTP resource]
        Template[HTML template<br/>string interpolation]
        Renderer["pdf:parseHtml()<br/>local PDF rendering"]
    end
    Response([HTTP 200<br/>Content-Type: application/pdf])

    Client ----> Resource
    Resource --> Template
    Template --> Renderer
    Renderer --> Response
```

The service takes passenger details as query parameters, fills them into a boarding-pass HTML template, and returns a ready-to-print PDF. All rendering happens locally through the `ballerina/pdf` module — no external service, no headless browser.

## What You'll Learn

- Using the WSO2 Integrator visual editor to build an HTTP service without writing service/resource code
- Configuring query parameters and a typed response schema in the resource editor
- Creating a reusable function for the HTML template with the flow designer
- Using `pdf:parseHtml` from the Standard Library inside a resource flow
- Returning a binary (`byte[]`) PDF payload with a custom content type

## Prerequisites

- WSO2 Integrator installed

**Time estimate:** 30 minutes

## Step-by-Step Walkthrough

### Step 1: Create the Project

1. Open WSO2 Integrator.
2. In the home screen, click **Create** under **Create New Integration**.
3. Fill in the dialog:

   | Field | Value |
   |---|---|
   | Integration Name | `pdf-generation-service` |
   | Project Name | `pdf-generation-service`|
   | Create within a project | ✓ checked |

4. Click **Create Integration**.

![Create Integration dialog with pdf-generation-service filled in](/img/tutorials/pdf-generation-service/01-create-integration.png)

### Step 2: Add an HTTP Service

1. In the project view, navigate to **Artifacts → Service**.
2. Select **HTTP Service**.
3. Leave **Service Contract** as **Design From Scratch**.
4. Set **Service Base Path** to `/boardingpass`.
5. Click **Create**.

![Create HTTP Service form with /boardingpass entered as the base path](/img/tutorials/pdf-generation-service/02-create-http-service.png)

### Step 3: Add the GET /render Resource

1. On the HTTP Service canvas, click **+ Add Resource**.
2. Set **HTTP Method** to `GET` and **Resource Path** to `render`.
3. Click **+ Query Parameter** five times and add the following (all type `string`):

   | Name | Type |
   |---|---|
   | `passengerName` | string |
   | `flightNumber` | string |
   | `seat` | string |
   | `gate` | string |
   | `boardingTime` | string |

4. The default **200** response is pre-added. Click its edit icon to open **Response Configuration**:
   - Keep the **Status Code** as it is.
   - Expand the **Advanced Configurations**
   - Set **Response Body Schema** to `byte[]`.
   - Check **Make This Response Reusable**.
   - Set **Response Definition Name** to `OkResponse`.
   - Click **Save**
5. Click **Save**.

![New Resource Configuration panel showing all five query parameters and the OkResponse definition set to byte\[\]](/img/tutorials/pdf-generation-service/03-resource-configuration.png)

After saving, the HTTP Service view shows the `GET render` resource. The sidebar also shows `OkResponse` added under **Types** — this is the response record the resource will return.

### Step 4: Create the HTML Template Function

The boarding-pass HTML is built by a reusable function so the resource flow stays focused on wiring. Create it under **Functions** in the left sidebar.

1. In the left sidebar, expand **Functions** and click **+**.
2. Enter the function name: `buildBoardingPassHtml`.
3. Add five parameters, each of type `string`:

   `passengerName`, `flightNumber`, `seat`, `gate`, `boardingTime`

4. Set **Return Type** to `string`.
5. Click **Create**.

![Function Configuration panel showing all five string parameters and string return type](/img/tutorials/pdf-generation-service/04-function-configuration.png)

### Step 5: Build the Function Body

With the function saved, its flow editor opens automatically.

1. Click the **+** button in the middle of the flow. A side panel opens.
2. In the right-side node panel, expand **Control** and click **Return**.
3. In the **Expression** field of the Return panel, paste the HTML template as a Ballerina string template. The `${...}` placeholders reference the five function parameters directly:

   ```ballerina
   string `<!DOCTYPE html>
   <html>
   <head>
     <style>
       body { font-family: 'Liberation Sans', sans-serif; padding: 20px; color: #111; }
       .header { background: #003366; color: #fff; padding: 12px; text-align: center; }
       .header h1 { margin: 0; }
       table { border-collapse: collapse; margin-top: 16px; width: 100%; }
       td { border: 1px solid #000; padding: 8px 14px; }
       .label { background: #eee; font-weight: bold; width: 40%; }
       .banner { background: #003366; color: #fff; text-align: center; font-weight: bold; }
       .footer { margin-top: 24px; font-size: 10px; color: #555; }
     </style>
   </head>
   <body>

       <h1>Boarding Pass</h1>

     <table>
       <tr><td class="banner" colspan="2">PASSENGER DETAILS</td></tr>
       <tr><td class="label">Passenger</td><td>${passengerName}</td></tr>
       <tr><td class="label">Flight</td><td>${flightNumber}</td></tr>
       <tr><td class="label">Seat</td><td>${seat}</td></tr>
       <tr><td class="label">Gate</td><td>${gate}</td></tr>
       <tr><td class="label">Boarding</td><td>${boardingTime}</td></tr>
     </table>
     <p class="footer">Please arrive at the gate at least 30 minutes before boarding.</p>
   </body>
   </html>`
   ```

4. Click **Save**.

![Function flow editor showing the Return node with the HTML template string expression](/img/tutorials/pdf-generation-service/05-function-return-expression.png)

A few notes on the CSS used here — these all work cleanly with the `ballerina/pdf` renderer:

- `Liberation Sans` is one of the two fonts bundled with `ballerina/pdf` (the other is Liberation Serif). Between them they cover Latin-1 and Latin Extended-A scripts — enough for most Western European names including accented characters.
- `colspan` on `<td>` and `border-collapse: collapse` render as you'd expect in a browser.
- `solid` borders, cell backgrounds, percentage widths, and cell padding all compose together without special handling.

### Step 6: Wire the Resource Flow

With `buildBoardingPassHtml` ready, go back to the `render` resource and build the four-node flow that calls the function, converts the HTML to PDF, constructs the response, and returns it.

Navigate to **HTTP Service → /boardingpass → render** in the left sidebar to open the resource flow editor.

#### 6.1 Call buildBoardingPassHtml

1. Click the + button in the middle of the flow. A side panel opens.
2. In the right-side panel, click **Call Function → Within Project** and click **buildBoardingPassHtml**.
3. Map each input field to the matching query parameter using **Expression** mode:

   | Input | Expression |
   |---|---|
   | Passenger Name | `passengerName` |
   | Flight Number | `flightNumber` |
   | Seat | `seat` |
   | Gate | `gate` |
   | Boarding Time | `boardingTime` |

4. Set **Result** name to `html` and **Result Type** to `string`.
5. Click **Save**.

![Call Function node configured for buildBoardingPassHtml with all five inputs mapped](/img/tutorials/pdf-generation-service/06-call-buildBoardingPassHtml.png)

#### 6.2 Convert HTML to PDF

1. Click the + button in the middle of the flow.
2. In the panel, click **Call Function**, search for `parseHtml`, then under **Standard Library → pdf**, click **parseHtml**.
3. Set the **html** input to the `html` variable (select it from **Variables**).
4. The **Result Type** is `byte[]` — leave it as-is and set **Result** name to `pdfBytes`.
5. Click **Save**.

![pdf:parseHtml node configured with html variable as input and byte\[\] result](/img/tutorials/pdf-generation-service/07-pdf-parseHtml-node.png)

#### 6.3 Construct the Response

1. Click the + button in the middle of the flow and choose **Statement → Declare Variable** in the right-hand side panel.
2. Set **Name** to `response` and **Type** to `OkResponse`.
3. In the **Expression** field, switch to **Record** mode. The Record Configuration for `OkResponse` opens:
   - Set **body** to `pdfBytes` (select from **Variables**).
   - Enable **mediaType** (optional field) and set its value to `"application/pdf"`.
4. Click **Save**.

![Declare Variable panel with OkResponse record configured — body mapped to pdfBytes, mediaType set to application/pdf](/img/tutorials/pdf-generation-service/08-declare-response-variable.png)

#### 6.4 Return the Response

1. Click the + button in the middle of the flow and choose **Control → Return** in the right-hand side panel.
2. Set the **Expression** to `response` (select from **Variables**).
3. Click **Save**.

The completed resource flow has four nodes in sequence:

![Complete resource flow showing buildBoardingPassHtml, pdf:parseHtml, Declare Variable, and Return nodes](/img/tutorials/pdf-generation-service/09-complete-resource-flow.png)

### Step 7: Run and Test

1. Click **Try It** in the top-right of the resource editor. WSO2 Integrator starts the service and opens the **Try Service** panel.
2. The panel shows `GET /render` with all five query parameters listed as required strings.
3. Run the service using curl (copy the generated URL from the panel and add your values):

   ```bash
   curl "http://localhost:9090/boardingpass/render?\
   passengerName=Alice%20Zhang&\
   flightNumber=WS2026&\
   seat=14A&\
   gate=B7&\
   boardingTime=2026-04-20%2008:45" \
     -o boarding-pass.pdf
   ```

4. Open `boarding-pass.pdf`. You should see a formatted boarding pass with the passenger details laid out in a table.

![Try Service panel showing GET /render with five required query parameters and the curl command in the terminal](/img/tutorials/pdf-generation-service/10-try-service-and-test.png)

![Rendered boarding pass PDF showing the five fields laid out in a styled table](/img/tutorials/pdf-generation-service/boarding-pass-rendered.png)

If a required parameter is missing, `ballerina/http` returns a `400 Bad Request` with a structured JSON body before your resource runs — no need to add your own validation for missing-parameter cases.

### Step 8: Support International Character Sets

Try the same request with a passenger name in Chinese:

```bash
curl "http://localhost:9090/boardingpass/render?\
passengerName=%E5%BC%A0%E4%B8%89&\
flightNumber=WS2026&seat=14A&gate=B7&boardingTime=2026-04-20%2008:45" \
  -o boarding-pass-cjk.pdf
```

The request succeeds and the PDF comes back — but the passenger cell is empty. The Liberation Sans font doesn't contain CJK glyphs, and the renderer drops characters it can't display rather than substituting a placeholder.

![Boarding pass PDF with an empty passenger cell — CJK characters were silently dropped](/img/tutorials/pdf-generation-service/cjk-without-customfonts.png)

The fix is the `customFonts` option on `pdf:parseHtml`. You load a font that covers the scripts you need, pass it in, and reference it by family name in the template's CSS.

Download [Noto Sans SC from Google Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+SC) and place the `.ttf` file in the root of your project (e.g. `NotoSansSC-VariableFont_wght.ttf`).

#### 8.1 Update the HTML Template CSS

1. In the left sidebar, expand **Functions** and click **buildBoardingPassHtml** to open its flow editor.
2. Click the **Return** node to open its expression panel.
3. In the **Expression** field, locate the `body` line inside the `<style>` block and update it to include `NotoSansCJK` at the front of the font cascade:

   ```css
   body { font-family: 'NotoSansCJK', 'Liberation Sans', sans-serif; padding: 20px; color: #111; }
   ```

4. Click **Save**.

![buildBoardingPassHtml Return node expression panel showing the updated body font-family with NotoSansCJK](/img/tutorials/pdf-generation-service/08-1-buildBoardingPassHtml-css-update.png)

#### 8.2 Add an `io:fileReadBytes` Node to the Resource Flow

Navigate back to **HTTP Service → /boardingpass → render** to open the resource flow editor.

1. Click the **+** button at the very top of the flow (before the `buildBoardingPassHtml` node).
2. In the right-side panel, click **Call Function** and search for `fileReadBytes`. Under **Standard Library → io**, click **fileReadBytes**.
3. Set **Path** to `./NotoSansSC-VariableFont_wght.ttf`.
4. Set **Result** name to `cjkFontBytes`. The **Result Type** is automatically set to `byte[] & readonly` — leave it as-is.
5. Click **Save**.

![io:fileReadBytes node configured with the font file path and cjkFontBytes result](/img/tutorials/pdf-generation-service/08-1-io-fileReadBytes-node.png)

#### 8.3 Update the `pdf:parseHtml` Node

1. Click the `pdf:parseHtml` node in the flow to open its configuration panel.
2. Expand **Advanced Configurations**.
3. Locate **Custom Fonts** and click **Initialize Array** to add the first font entry.
4. The **Record Configuration** opens with `Font` fields:
   - Set **family** (`string`) to `"NotoSansCJK"`.
   - Set **content** (`byte[]`) to `cjkFontBytes` — click the field, switch to **Expression** mode, then select `cjkFontBytes` from **Variables**.
   - Leave **bold** and **italic** (optional) unchecked.
5. Confirm **Result** name is `pdfBytes` and **Result Type** is `byte[]`.
6. Click **Save**.

![pdf:parseHtml node with customFonts configured — family NotoSansCJK, content cjkFontBytes](/img/tutorials/pdf-generation-service/08-2-parseHtml-customFonts.png)

The completed resource flow now has five nodes in sequence:

![Complete resource flow showing io:fileReadBytes, buildBoardingPassHtml, pdf:parseHtml, Declare Variable, and Return nodes](/img/tutorials/pdf-generation-service/08-3-complete-resource-flow-with-font.png)

Re-run the project using **Try It** and re-send the CJK request. The characters render correctly.

![Boarding pass PDF rendering CJK characters correctly using a custom font](/img/tutorials/pdf-generation-service/cjk-with-customfonts.png)

The font is subset automatically — only the glyphs actually used appear in the output. A 17 MB source font typically contributes only a few KB to each generated PDF.

The `family` value in the `customFonts` entry must match the name you reference in the CSS. You can load multiple fonts at once (for example, a CJK font and a RTL font) by adding more entries to the array via **+ Add New Item** in the Custom Fonts configuration.

## Limitations and Supported Subset

The `ballerina/pdf` renderer covers the HTML and CSS you need for document-style templates but isn't a full browser engine. A few limits worth knowing:

| Not supported | Use instead |
| --- | --- |
| `display: flex`, CSS Grid, `position: fixed` | Tables or floats for multi-column layouts |
| `@font-face` CSS rules | `customFonts` option on `ConversionOptions` (see Step 8) |
| Inline `<svg>` elements | Rasterise the SVG to PNG at build time (`rsvg-convert`, Inkscape) and embed as a data URL |
| `rowspan`, `<caption>`, `table-layout: fixed` | Plain table rows with `colspan` are supported |
| Non-`solid` border styles (`dashed`, `dotted`, `double`) | Use `solid` and adjust width |
| Glyphs outside loaded fonts' coverage | Load a font that covers them via `customFonts` |

Unsupported features do not raise errors. The renderer silently falls back — flex containers render as block, `@font-face` rules are skipped, SVG elements are dropped. Always preview your generated PDFs visually when you introduce new template features, especially if the template comes from a CSS library or AI-generated HTML.

### `ConversionOptions` Quick Reference

Pass any of these as named arguments to `pdf:parseHtml`:

| Field | Type | Default | Purpose |
| --- | --- | --- | --- |
| `pageSize` | `StandardPageSize` or `CustomPageSize` | `A4` | `A4`, `LETTER`, `LEGAL`, or a `{width, height}` record in points. Swap width and height for landscape — there is no separate `orientation` field. |
| `margins` | `PageMargins` | `{top: 0, right: 0, bottom: 0, left: 0}` | Page margins in points |
| `fallbackFontSize` | `float` | `12.0` | Font size used when CSS doesn't specify one |
| `customFonts` | `Font[]?` | `()` | Array of `{family, content, bold, italic}` entries for fonts to load |
| `additionalCss` | `string?` | `()` | Extra CSS injected into every render |
| `maxPages` | `int?` | `()` | Cap on the number of pages rendered — must be greater than 0 if set. Rejects documents larger than this |

## Production Considerations

- **Concurrency is safe.** Each `pdf:parseHtml` call is independent — the library is thread-safe, and concurrent requests don't share mutable state. The renderer is CPU-bound, so throughput scales with cores. Expect hundreds of requests per second per process on modern hardware.
- **Rendering is memory-intensive for large documents.** If you plan to render multi-megabyte templates or long multi-page documents under sustained load, run your own load tests before committing capacity.
- **Validate user input.** This tutorial uses query parameters directly in the HTML template. If any parameter comes from untrusted input, sanitise it first to avoid HTML injection. Escape angle brackets, quotes, and any other HTML-significant characters.

## Summary

You built an HTTP service that turns parameters into a PDF using `ballerina/pdf`. The end-to-end pattern is three calls: render a template string, call `pdf:parseHtml`, wrap the result in an `http:Response` with `application/pdf` content type. You extended it to handle non-Latin scripts via `customFonts` and learned the shape of the renderer's supported subset.

The same pattern — parameterised HTML template plus `pdf:parseHtml` — is the foundation for certificates of completion, invoices, shipping labels, contracts, and any other document a service needs to generate on demand.

## What's Next

- [HTTP Service](../develop/integration-artifacts/service/http.md) — the reference for services, resources, and return types
- [REST API Aggregation Service](rest-api-aggregation-service.md) — another HTTP-service walkthrough, with parallel backend calls
- [Data Mapper](../develop/integration-artifacts/supporting/data-mapper.md) — transform request payloads before rendering, when your input shape doesn't match the template's slots directly
