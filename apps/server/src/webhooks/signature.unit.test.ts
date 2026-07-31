import { expect, test } from "bun:test";
// TODO(candidate): implement `signRequestBody` in `./signature.ts` and unskip.
// The helper should produce a stable HMAC over the raw request body using
// `WEBHOOK_SECRET`, matching whatever scheme you ship in the outbound
// `X-Vitalize-Signature` header.
//
// import { signRequestBody } from "./signature";

test.skip("signRequestBody produces a stable signature for a known body + secret", () => {
  // const body = JSON.stringify({ deliveryId: "00000000-0000-0000-0000-000000000001" });
  // const secret = "interview-shared-secret";
  // expect(signRequestBody(body, secret)).toBe("<expected-hex-digest>");
  expect(true).toBe(true);
});
