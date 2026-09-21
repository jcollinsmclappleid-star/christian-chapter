import { eq } from "drizzle-orm";
import { db, auditEvents } from "@/db";

export async function writeAudit(opts: {
  actorType: "member" | "admin" | "system";
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}) {
  await db.insert(auditEvents).values({
    actorType: opts.actorType,
    actorId: opts.actorId ?? null,
    action: opts.action,
    entityType: opts.entityType,
    entityId: opts.entityId,
    metadata: opts.metadata ?? null,
  });
}

export async function getUserAudit(userId: string) {
  return db
    .select()
    .from(auditEvents)
    .where(eq(auditEvents.entityId, userId));
}
