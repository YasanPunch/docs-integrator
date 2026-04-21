---
title: Expressions & Functions
---

# Expressions & Functions

Use built-in expressions and functions to transform data within your integrations. Ballerina provides a rich standard library for string manipulation, date/time processing, math operations, and collection handling.

## Expression Language Overview

Ballerina expressions can be used wherever a value is expected -- in variable assignments, function arguments, record field initializers, query `select` clauses, and data mapper expressions. Common expression forms include:

- **Template strings** -- `` string `Hello, ${name}!` ``
- **Ternary operator** -- `condition ? valueIfTrue : valueIfFalse`
- **Elvis operator** -- `value ?: defaultValue`
- **Type test** -- `value is string`
- **Range expressions** -- `1 ... 10`

## String Functions

The `ballerina/lang.string` module (available as `string:` prefix) provides functions for common text operations.

1. **Add a Variable step for the input string** — In the flow designer, click **+** and select **Variable**. Set the type to `string` and the expression to `"  Hello, World!  "`.

2. **Add Variable steps for each string operation** — Click **+** and select **Variable** for each operation:

   - **Trim** — Set the type to `string` and the expression to `input.trim()`.
   - **Upper case** — Set the type to `string` and the expression to `"hello".toUpperAscii()`.
   - **Lower case** — Set the type to `string` and the expression to `"HELLO".toLowerAscii()`.
   - **Substring** — Set the type to `string` and the expression to `"Hello, World!".substring(7)`.
   - **Starts with** — Set the type to `boolean` and the expression to `"order-123".startsWith("order")`.
   - **Ends with** — Set the type to `boolean` and the expression to `"file.csv".endsWith(".csv")`.
   - **Index of** — Set the type to `int?` and the expression to `"Hello, World!".indexOf("World")`.
   - **Includes** — Set the type to `boolean` and the expression to `"integration".includes("grat")`.
   - **Split** — Set the type to `string[]` and the expression to `"a,b,c".split(",")`.
   - **Join** — Set the type to `string` and the expression to `string:'join("-", "x", "y", "z")`.
   - **Length** — Set the type to `int` and the expression to `"Hello".length()`.



```ballerina
import ballerina/io;

public function main() {
    string input = "  Hello, World!  ";

    // Trimming whitespace
    string trimmed = input.trim();               // "Hello, World!"

    // Case conversion
    string upper = "hello".toUpperAscii();        // "HELLO"
    string lower = "HELLO".toLowerAscii();        // "hello"

    // Substring operations
    string sub = "Hello, World!".substring(7);    // "World!"
    boolean starts = "order-123".startsWith("order"); // true
    boolean ends = "file.csv".endsWith(".csv");       // true

    // Search and replace
    int? idx = "Hello, World!".indexOf("World");  // 7
    boolean has = "integration".includes("grat");  // true

    // Split and join
    string[] parts = "a,b,c".split(",");          // ["a", "b", "c"]
    string joined = string:'join("-", "x", "y", "z"); // "x-y-z"

    // Length
    int len = "Hello".length();                   // 5

    io:println(trimmed);
}
```

### Regular expressions

Ballerina supports regex patterns with the `re` literal prefix for matching, replacing, and splitting.

1. **Add a Variable step for the input string** — Click **+** and select **Variable**. Set the type to `string` and the expression to `"Order: ORD-12345, Date: 2025-03-15"`.

2. **Add a Variable step for the regex pattern** — Click **+** and select **Variable**. Set the type to `regexp:RegExp` and the expression to `` re `ORD-\d+` ``.

3. **Add a Variable step for find** — Click **+** and select **Variable**. Set the type to `regexp:Span?` and the expression to `orderPattern.find(input)`.

4. **Add an If step to check the match** — Click **+** and select **If**. Set the condition to `match is regexp:Span`. Inside the **If** block, add a **Variable** step with type `string` and expression `match.substring()`.

5. **Add a Variable step for replaceAll** — Click **+** and select **Variable**. Set the type to `string` and the expression to `` re `\D`.replaceAll("abc-123-def-456", "") ``.

6. **Add a Variable step for split** — Click **+** and select **Variable**. Set the type to `string[]` and the expression to `` re `,\s*`.split("one, two,three ,  four") ``.



```ballerina
import ballerina/lang.regexp;

public function main() {
    string input = "Order: ORD-12345, Date: 2025-03-15";

    // Match a pattern
    regexp:RegExp orderPattern = re `ORD-\d+`;
    regexp:Span? match = orderPattern.find(input);
    if match is regexp:Span {
        string orderId = match.substring();  // "ORD-12345"
    }

    // Replace all non-digit characters
    string digits = re `\D`.replaceAll("abc-123-def-456", ""); // "123456"

    // Split by pattern
    string[] tokens = re `,\s*`.split("one, two,three ,  four");
    // ["one", "two", "three", "four"]
}
```

## Date and Time Functions

The `ballerina/time` module handles time zones, formatting, parsing, and arithmetic on timestamps.

1. **Add a Variable step for the current UTC time** — Click **+** and select **Variable**. Set the type to `time:Utc` and the expression to `time:utcNow()`.

2. **Add a Variable step to parse an ISO 8601 string** — Click **+** and select **Variable**. Set the type to `time:Civil` and the expression to `check time:civilFromString("2025-03-15T10:30:00Z")`.

3. **Add a Variable step to format a civil time** — Click **+** and select **Variable**. Set the type to `string` and the expression to `check time:civilToString(civil)`.

4. **Add a Variable step for time arithmetic** — Click **+** and select **Variable**. Set the type to `time:Utc` and the expression to `time:utcAddSeconds(now, 3600)`.

5. **Add a Variable step for the time difference** — Click **+** and select **Variable**. Set the type to `decimal` and the expression to `time:utcDiffSeconds(later, now)`.



```ballerina
import ballerina/time;
import ballerina/io;

public function main() returns error? {
    // Current UTC time
    time:Utc now = time:utcNow();

    // Parse an ISO 8601 string
    time:Civil civil = check time:civilFromString("2025-03-15T10:30:00Z");
    io:println(civil.year);  // 2025
    io:println(civil.month); // 3
    io:println(civil.day);   // 15

    // Format a civil time
    string formatted = check time:civilToString(civil);
    io:println(formatted); // "2025-03-15T10:30:00Z"

    // Time arithmetic -- add duration
    time:Utc later = time:utcAddSeconds(now, 3600); // 1 hour later

    // Difference between two timestamps
    decimal diffSeconds = time:utcDiffSeconds(later, now);
    io:println(diffSeconds); // 3600
}
```

### Working with time zones

1. **Add a Variable step to parse the UTC time** — Click **+** and select **Variable**. Set the type to `time:Civil` and the expression to `check time:civilFromString("2025-03-15T10:00:00Z")`.

2. **Add a Variable step for the timezone-converted time** — Click **+** and select **Variable**. Set the type to `time:Civil` and the expression to a `time:Civil` record literal with `utcOffset: {hours: -8, minutes: 0}` for PST.



```ballerina
import ballerina/time;

public function main() returns error? {
    time:Civil utcTime = check time:civilFromString("2025-03-15T10:00:00Z");

    // Convert to a specific timezone
    time:Civil localTime = {
        year: utcTime.year,
        month: utcTime.month,
        day: utcTime.day,
        hour: utcTime.hour,
        minute: utcTime.minute,
        second: utcTime.second,
        utcOffset: {hours: -8, minutes: 0}  // PST
    };
}
```

## Math Functions

The `ballerina/lang.int`, `ballerina/lang.float`, and `ballerina/lang.decimal` modules provide numeric operations.

1. **Add Variable steps for parsing numbers from strings** — Click **+** and select **Variable** for each:

   - **Integer** — Set the type to `int` and the expression to `check intLib:fromString("42")`.
   - **Float** — Set the type to `float` and the expression to `check floatLib:fromString("3.14")`.
   - **Decimal** — Set the type to `decimal` and the expression to `check decimalLib:fromString("29.99")`.

2. **Add Variable steps for integer operations** — Click **+** and select **Variable** for each:

   - **Absolute value** — Set the type to `int` and the expression to `intLib:abs(-42)`.
   - **Max** — Set the type to `int` and the expression to `intLib:max(10, 20)`.
   - **Min** — Set the type to `int` and the expression to `intLib:min(10, 20)`.

3. **Add Variable steps for float operations** — Click **+** and select **Variable** for each:

   - **Round** — Set the type to `float` and the expression to `floatLib:round(3.7)`.
   - **Floor** — Set the type to `float` and the expression to `floatLib:floor(3.7)`.
   - **Ceiling** — Set the type to `float` and the expression to `floatLib:ceiling(3.2)`.
   - **Square root** — Set the type to `float` and the expression to `floatLib:sqrt(16.0)`.

4. **Add Variable steps for decimal operations** — Click **+** and select **Variable** for each:

   - **Subtotal** — Set the type to `decimal` and the expression to `99.99d`.
   - **Tax** — Set the type to `decimal` and the expression to `subtotal * 0.08d`.
   - **Total** — Set the type to `decimal` and the expression to `subtotal + tax`.
   - **Rounded total** — Set the type to `decimal` and the expression to `decimalLib:round(total, 2)`.



```ballerina
import ballerina/lang.'int as intLib;
import ballerina/lang.'float as floatLib;
import ballerina/lang.'decimal as decimalLib;

public function main() returns error? {
    // Parsing numbers from strings
    int count = check intLib:fromString("42");
    float ratio = check floatLib:fromString("3.14");
    decimal price = check decimalLib:fromString("29.99");

    // Absolute value
    int abs = intLib:abs(-42);     // 42

    // Min and max
    int larger = intLib:max(10, 20);  // 20
    int smaller = intLib:min(10, 20); // 10

    // Float math
    float rounded = floatLib:round(3.7);  // 4.0
    float floor = floatLib:floor(3.7);    // 3.0
    float ceil = floatLib:ceiling(3.2);   // 4.0
    float sqrt = floatLib:sqrt(16.0);     // 4.0

    // Decimal for financial calculations (no floating-point errors)
    decimal subtotal = 99.99d;
    decimal tax = subtotal * 0.08d;
    decimal total = subtotal + tax;       // 107.9892
    decimal roundedTotal = decimalLib:round(total, 2); // 107.99
}
```

## Collection Functions

Ballerina provides functional-style operations on arrays and maps through `ballerina/lang.array` and `ballerina/lang.map`.

1. **Add a Variable step for the numbers array** — Click **+** and select **Variable**. Set the type to `int[]` and initialize it with `[3, 1, 4, 1, 5, 9, 2, 6]`.

2. **Add Variable steps for each collection operation** — Click **+** and select **Variable** for each:

   - **Sort** — Set the type to `int[]` and the expression to `numbers.sort()`.
   - **Reverse** — Set the type to `int[]` and the expression to `numbers.reverse()`.
   - **Length** — Set the type to `int` and the expression to `numbers.length()`.
   - **Map** — Set the type to `string[]` and the expression to `` numbers.map(n => string `#${n}`) ``.
   - **Filter** — Set the type to `int[]` and the expression to `numbers.filter(n => n > 4)`.
   - **Reduce** — Set the type to `int` and the expression to `numbers.reduce(function(int acc, int n) returns int => acc + n, 0)`.
   - **Slice** — Set the type to `int[]` and the expression to `numbers.slice(2, 5)`.



```ballerina
import ballerina/io;

public function main() {
    int[] numbers = [3, 1, 4, 1, 5, 9, 2, 6];

    // Sort
    int[] sorted = numbers.sort();  // [1, 1, 2, 3, 4, 5, 6, 9]

    // Reverse
    int[] reversed = numbers.reverse();

    // Length
    int count = numbers.length();   // 8

    // Map -- transform each element
    string[] labels = numbers.map(n => string `#${n}`);

    // Filter
    int[] large = numbers.filter(n => n > 4);  // [5, 9, 6]

    // Reduce -- aggregate into a single value
    int sum = numbers.reduce(function(int acc, int n) returns int => acc + n, 0);

    // Slice
    int[] middle = numbers.slice(2, 5);  // [4, 1, 5]

    io:println(sorted);
}
```

### Map operations

1. **Add a Variable step for the inventory map** — Click **+** and select **Variable**. Set the type to `map<int>` and initialize it with `{"widget": 50, "gadget": 12, "gizmo": 0}`.

2. **Add Variable steps for map operations** — Click **+** and select **Variable** for each:

   - **Keys** — Set the type to `string[]` and the expression to `inventory.keys()`.
   - **Values** — Set the type to `int[]` and the expression to `inventory.toArray()`.
   - **Has key** — Set the type to `boolean` and the expression to `inventory.hasKey("widget")`.

3. **Add a Foreach step to iterate entries** — Click **+** and select **Foreach**. Set the collection expression to `inventory.entries()` and the iteration variable to `[string, int] [name, qty]`. Add steps inside the loop body to process each entry.



```ballerina
public function main() {
    map<int> inventory = {"widget": 50, "gadget": 12, "gizmo": 0};

    // Get keys and values
    string[] products = inventory.keys();
    int[] quantities = inventory.toArray();

    // Check existence
    boolean hasWidget = inventory.hasKey("widget"); // true

    // Iterate entries
    foreach [string, int] [name, qty] in inventory.entries() {
        // process each entry
    }
}
```

## Writing Custom Functions

Define reusable transformation functions to keep your integration logic modular.

Custom functions appear under **Functions** in the sidebar. To create and use them:

1. **Navigate to Functions** — In the sidebar, click **Functions** to view the list of helper functions in your project.

2. **Add the `maskEmail` function** — Click **+** to add a new function. Name it `maskEmail`, set the parameter to `string email`, and the return type to `string`. Implement the logic to mask the email prefix — use `email.indexOf("@")` to find the `@` position, then construct the masked result with `email.substring(0, 2) + "***" + email.substring(atIndex)`.

3. **Add the `formatCurrency` function** — Click **+** to add a new function. Name it `formatCurrency`, set the parameters to `decimal amount` and `string symbol = "$"`, and the return type to `string`. Set the expression to `` string `${symbol}${decimalRound(amount, 2)}` ``.

4. **Add the `decimalRound` helper function** — Click **+** to add a new function. Name it `decimalRound`, set the parameters to `decimal val` and `int places`, and the return type to `decimal`. Implement the rounding logic using a factor-based approach.



```ballerina
// Mask sensitive data
function maskEmail(string email) returns string {
    int? atIndex = email.indexOf("@");
    if atIndex is int && atIndex > 2 {
        string prefix = email.substring(0, 2);
        string domain = email.substring(atIndex);
        return prefix + "***" + domain;
    }
    return "***";
}

// Format currency
function formatCurrency(decimal amount, string symbol = "$") returns string {
    return string `${symbol}${decimalRound(amount, 2)}`;
}

function decimalRound(decimal val, int places) returns decimal {
    decimal factor = 1;
    foreach int _ in 0 ..< places {
        factor *= 10;
    }
    return <decimal>(<int>(val * factor + 0.5d)) / factor;
}
```

## Using Expressions in the Visual Designer

The WSO2 Integrator data mapper provides an inline expression editor for each field mapping. Click the **expression** icon next to a target field to open the editor, where you can write any Ballerina expression including function calls, ternary logic, and string templates.

The expression editor supports:

- Auto-completion for source fields and available functions.
- Type checking with inline error indicators.
- Preview of the generated Ballerina code.

## What's Next

- [AI-Assisted Data Mapping](ai-assisted-mapping.md) -- AI suggestions for transformations
