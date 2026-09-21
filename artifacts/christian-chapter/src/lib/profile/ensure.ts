import { eq } from "drizzle-orm";
import { db, foundingApplications, memberProfiles, users } from "@/db";
import { defaultVisibility } from "./visibility";

function nationFromRegion(region: string | null | undefined): string | null {
  if (!region) return null;
  if (region === "Scotland") return "Scotland";
  if (region === "Wales") return "Wales";
  if (region === "Northern Ireland") return "Northern Ireland";
  return "England";
}

export async function ensureMemberProfile(userId: string) {
  const [existing] = await db
    .select()
    .from(memberProfiles)
    .where(eq(memberProfiles.userId, userId))
    .limit(1);
  if (existing) return existing;

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const [app] = await db
    .select()
    .from(foundingApplications)
    .where(eq(foundingApplications.userId, userId))
    .limit(1);

  const [created] = await db
    .insert(memberProfiles)
    .values({
      userId,
      status: "draft",
      firstName: app?.firstName ?? user?.firstName ?? null,
      dateOfBirth: app?.dateOfBirth ?? null,
      gender: app?.gender ?? null,
      seekingGender: app?.seekingGender ?? [],
      tradition: app?.tradition ?? null,
      churchAttendance: app?.churchAttendance ?? null,
      faithCentrality: app?.faithCentrality ?? null,
      faithDescription: app?.faithDescription ?? null,
      relationshipGoal: app?.relationshipGoal ?? null,
      openToRemarriage: app?.openToRemarriage ?? null,
      relationshipPace: app?.relationshipPace ?? null,
      familySituation: app?.familySituation ?? null,
      workStatus: app?.workStatus ?? null,
      interests: app?.interests ?? [],
      ukNation: nationFromRegion(app?.ukRegion),
      ukRegion: app?.ukRegion ?? null,
      travelRadiusMiles: app?.travelRadiusMiles ?? app?.preferredDistanceMiles ?? null,
      candidatePools: ["nearby"],
      essentials: app?.essentials ?? [],
      prompts: [
        app?.storyPrompt1 ? { prompt: "What has this chapter of life taught you?", answer: app.storyPrompt1 } : null,
        app?.storyPrompt2 ? { prompt: "A moment that shaped who you are today", answer: app.storyPrompt2 } : null,
        app?.storyPrompt3 ? { prompt: "What does a good ordinary day look like?", answer: app.storyPrompt3 } : null,
      ].filter((row): row is { prompt: string; answer: string } => Boolean(row)),
      visibility: defaultVisibility(),
    })
    .returning();

  return created;
}
