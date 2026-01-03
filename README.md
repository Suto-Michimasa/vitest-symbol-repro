# Vitest 4.0.16 Symbol Serialization Bug Reproduction

This repository demonstrates a regression in vitest 4.0.16 where `console.error` with objects containing Symbol properties causes `TypeError: Cannot convert a Symbol value to a string`.

## Problem

In vitest 4.0.16 browser mode, when `console.error` is called with an object that contains Symbol properties (like RTK Query error objects), the `baseFormat` function in `@vitest/utils` attempts to convert Symbol to string, causing an error.

### Error Message

```
TypeError: Cannot convert a Symbol value to a string
    at baseFormat (@vitest/utils@4.0.16/dist/display.js:700:15)
    at browserFormat (@vitest/utils@4.0.16/dist/display.js:711:9)
    at processLog (__vitest_browser__/tester.js:1202:10)
    at console.error (__vitest_browser__/tester.js:1198:23)
```

## Reproduction Steps

1. Clone this repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run browser tests with vitest 4.0.16:
   ```bash
   pnpm test:browser
   ```

## Expected Behavior

Tests should pass without errors. Symbol properties should be safely handled during console output formatting.

## Actual Behavior

With vitest 4.0.16, tests that use `console.error` with Symbol-containing objects fail with:
```
TypeError: Cannot convert a Symbol value to a string
```

## Workaround

Downgrade to vitest 4.0.15:
```bash
pnpm add -D vitest@4.0.15 @vitest/browser@4.0.15 @vitest/browser-playwright@4.0.15
```

## Environment

- vitest: 4.0.16
- @vitest/browser: 4.0.16
- @vitest/browser-playwright: 4.0.16
- Node.js: 20+
- OS: macOS / Linux

## Related

This issue affects projects using:
- RTK Query (Redux Toolkit Query) - error objects contain Symbol properties
- Storybook vitest addon with browser mode
- Any code that logs objects with Symbol properties via console.error/console.log
