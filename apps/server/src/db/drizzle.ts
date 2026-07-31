import * as PgDrizzle from "drizzle-orm/effect-postgres";
import { PgClient } from "@effect/sql-pg";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import { databaseUrl } from "./index";

const dbEffect = PgDrizzle.make({ casing: "snake_case" }).pipe(
  Effect.provide(PgDrizzle.DefaultServices),
);

export class DB extends Context.Tag("DB")<
  DB,
  Effect.Effect.Success<typeof dbEffect>
>() {}

const DBLive = Layer.effect(DB, dbEffect);

const PgClientLive = PgClient.layer({
  url: Redacted.make(databaseUrl),
});

export const DatabaseLive = DBLive.pipe(Layer.provide(PgClientLive));
