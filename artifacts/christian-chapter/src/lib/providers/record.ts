import { db, providerResults } from "@/db";
import { writeAudit } from "@/lib/audit";
import type { ProviderResult } from "@/lib/providers/types";

export async function recordProviderResult(opts: {
  feature: string;
  entityType: string;
  entityId: string;
  result: ProviderResult;
  actorId?: string;
}) {
  await db.insert(providerResults).values({
    feature: opts.feature,
    adapter: opts.result.adapter,
    state: opts.result.state,
    sandbox: opts.result.sandbox,
    entityType: opts.entityType,
    entityId: opts.entityId,
    message: opts.result.message,
    payload: opts.result.data ?? null,
  });
  await writeAudit({
    actorType: "system",
    actorId: opts.actorId ?? opts.result.adapter,
    action: `provider_${opts.feature}_${opts.result.state}`,
    entityType: opts.entityType,
    entityId: opts.entityId,
    metadata: {
      adapter: opts.result.adapter,
      sandbox: opts.result.sandbox,
      message: opts.result.message,
    },
  });
}
