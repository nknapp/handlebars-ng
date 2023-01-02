# Handlebars performance tests

This package contains a test-suite for performance tests.
It exports

- The TestBench,
- a default set of tests
- testee-adapters for the original Handlebars parser and runner

```typescript
import { TestBench } from "./index";
import { originalHandlebars } from "./index";
import { tests } from "./index";

const result = new TestBench()
  .addTests(tests)
  .addTestee(originalHandlebars.parser)
  .addTestee(originalHandlebars.runner)
  .run()
  .asTable();

console.table(result);
```
