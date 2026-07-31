// Interview fixture. console.log per request is the point.

const PORT = 3002;

const knownShiftIds = new Set<string>();

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

type Decision = {
  status: number;
  body: object;
  idCheck:
    | "n/a"
    | "missing"
    | "recorded"
    | "known"
    | "released"
    | "unknown"
    | "skipped-injected-500";
};

const decide = (
  eventType: string | undefined,
  shiftId: string | undefined,
  injectedFailure: boolean,
): Decision => {
  const inject500: Decision = {
    status: 500,
    body: { ok: false, error: "injected failure (deterministic)" },
    idCheck: "skipped-injected-500",
  };

  if (eventType === "shift.assigned" || eventType === "shift.unassigned") {
    if (!shiftId) {
      return {
        status: 422,
        body: { ok: false, error: "missing data.shiftId" },
        idCheck: "missing",
      };
    }

    if (eventType === "shift.assigned") {
      if (injectedFailure) return inject500;
      const wasNew = !knownShiftIds.has(shiftId);
      knownShiftIds.add(shiftId);
      return { status: 200, body: { ok: true }, idCheck: wasNew ? "recorded" : "known" };
    }

    if (!knownShiftIds.has(shiftId)) {
      return {
        status: 404,
        body: { ok: false, error: `unknown shiftId ${shiftId}` },
        idCheck: "unknown",
      };
    }
    if (injectedFailure) return inject500;
    knownShiftIds.delete(shiftId);
    return { status: 200, body: { ok: true }, idCheck: "released" };
  }

  if (injectedFailure) return inject500;
  return { status: 200, body: { ok: true }, idCheck: "n/a" };
};

const server = Bun.serve({
  port: PORT,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);
    const rawBody = await req.text();

    let parsedBody: unknown = rawBody;
    if (rawBody.length > 0) {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        // non-JSON payload — keep rawBody as-is
      }
    }

    const eventType =
      isObject(parsedBody) && typeof parsedBody.eventType === "string"
        ? parsedBody.eventType
        : undefined;
    const shiftId =
      isObject(parsedBody) &&
      isObject(parsedBody.data) &&
      typeof parsedBody.data.shiftId === "string"
        ? parsedBody.data.shiftId
        : undefined;

    const deliveryKey =
      req.headers.get("x-idempotency-key") ||
      (isObject(parsedBody) && typeof parsedBody.deliveryId === "string"
        ? parsedBody.deliveryId
        : undefined);

    const injectedFailure =
      !!deliveryKey && BigInt(Bun.hash(deliveryKey)) % 5n === 0n;

    const decision = decide(eventType, shiftId, injectedFailure);

    console.log(
      JSON.stringify({
        ts: new Date().toISOString(),
        method: req.method,
        path: url.pathname + url.search,
        status: decision.status,
        eventType,
        shiftId,
        idCheck: decision.idCheck,
        knownShiftCount: knownShiftIds.size,
        deliveryKey,
        headers: Object.fromEntries(req.headers.entries()),
        body: parsedBody,
      }),
    );

    return new Response(JSON.stringify(decision.body), {
      status: decision.status,
      headers: { "content-type": "application/json" },
    });
  },
});

console.log(
  `[mock-partner] listening on http://${server.hostname}:${server.port} (POST /webhook)`,
);
