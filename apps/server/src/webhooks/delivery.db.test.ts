import { expect, test } from "bun:test";
import "../db/database-setup";

// TODO(candidate): once you have a webhook delivery effect (e.g. `deliverWebhook`
// in `./delivery.ts`) plus whatever table you choose to back it, unskip this
// test. It should:
//   1. Insert a pending delivery row.
//   2. Invoke the delivery effect against the mock partner at
//      WEBHOOK_RECEIVER_URL (http://localhost:3002/webhook by default).
//   3. Assert the row transitions to a terminal status and that the partner
//      received a request with the expected `X-Vitalize-*` headers.

test.skip("deliverWebhook persists a successful delivery against the mock partner", () => {
  expect(true).toBe(true);
});
