import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/admin-session";
import { db, foundingApplications, consentRecords, users } from "@/db";
import { eq, desc } from "drizzle-orm";
import { getAge } from "@/lib/age";
import { StatusBadge } from "../../_components/status-badge";
import { AdminPanel } from "./_components/admin-panel";

export const metadata: Metadata = { title: "Application Detail" };

function getAgeLabel(dob: string | null): string {
  if (!dob) return "—";
  const age = getAge(dob);
  return age === null ? dob : `${dob} (age ${age})`;
}

function fmtDate(val: Date | string): string {
  return new Date(val).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h3 className="text-[11px] uppercase tracking-[0.22em] text-stone font-sans mb-3 pb-2 border-b border-border">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex gap-4 py-2 border-b border-border last:border-0">
      <dt className="text-[12px] text-stone font-sans w-44 flex-shrink-0 pt-0.5">{label}</dt>
      <dd className="text-[14px] text-plum font-sans">{value}</dd>
    </div>
  );
}

const STORY_PROMPTS = [
  "What has this chapter of life taught you, and what are you carrying forward into the next?",
  "Describe a moment — recent or long ago — that shaped who you are today.",
  "What does a good ordinary day look like for you?",
];

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();

  const { id } = await params;
  const memberId = Number(id);
  if (isNaN(memberId)) notFound();

  const [applications] = await Promise.all([
    db.select().from(foundingApplications).where(eq(foundingApplications.id, memberId)).limit(1),
  ]);

  const m = applications[0];
  if (!m) notFound();

  const [user] = await db.select().from(users).where(eq(users.id, m.userId)).limit(1);
  const consents = await db
    .select()
    .from(consentRecords)
    .where(eq(consentRecords.userId, m.userId))
    .orderBy(desc(consentRecords.grantedAt));

  type EssentialItem = { factor: string; label: string; tier: string };
  const essentials = (m.essentials as EssentialItem[] | null) ?? [];

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <a href="/admin/applications" className="text-[12px] text-stone underline underline-offset-2 hover:text-plum font-sans">
            ← Applications
          </a>
          <h1 className="font-serif text-plum text-3xl mt-2">{m.firstName ?? user?.firstName ?? "Application"}</h1>
          <p className="text-[13px] text-stone font-sans mt-1">{user?.email ?? "—"}</p>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={m.status} />
            <span className="text-[12px] text-stone font-sans">
              {m.submittedAt ? `Submitted ${fmtDate(m.submittedAt)}` : `Updated ${fmtDate(m.updatedAt)}`}
            </span>
          </div>
          {m.hiddenAt && (
            <p className="text-[12px] text-oxblood font-sans mt-2">Hidden from member view {fmtDate(m.hiddenAt)}</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
        {/* Left: Full profile */}
        <div className="bg-ivory border border-border rounded-lg px-6 py-6">
          <Section title="Account">
            <dl>
              <Field label="First name" value={m.firstName} />
              <Field label="Email" value={user?.email} />
              <Field label="Account status" value={user?.status} />
              <Field label="Email verified" value={user?.emailVerifiedAt ? fmtDate(user.emailVerifiedAt) : "Not verified"} />
              <Field label="Marketing consent" value={m.marketingConsent ? "Yes" : "No"} />
            </dl>
          </Section>

          <Section title="About you">
            <dl>
              <Field label="Date of birth" value={getAgeLabel(m.dateOfBirth)} />
              <Field label="Gender" value={m.gender} />
              <Field label="Seeking" value={m.seekingGender?.join(", ")} />
            </dl>
          </Section>

          <Section title="Location">
            <dl>
              <Field label="UK region" value={m.ukRegion} />
              <Field label="Travel radius" value={m.travelRadiusMiles != null ? `${m.travelRadiusMiles} miles` : null} />
            </dl>
          </Section>

          <Section title="Faith">
            <dl>
              <Field label="Tradition" value={m.tradition} />
              <Field label="Church attendance" value={m.churchAttendance} />
              <Field label="Faith centrality" value={m.faithCentrality} />
              <Field label="Description" value={m.faithDescription} />
            </dl>
          </Section>

          <Section title="Life now">
            <dl>
              <Field label="Work status" value={m.workStatus} />
              <Field label="Family situation" value={m.familySituation} />
              <Field label="Interests" value={m.interests?.join(", ")} />
            </dl>
          </Section>

          <Section title="Relationship intentions">
            <dl>
              <Field label="Looking for" value={m.relationshipGoal} />
              <Field label="Open to remarriage" value={
                m.openToRemarriage === true ? "Yes" :
                m.openToRemarriage === false ? "No" : "Unsure"
              } />
              <Field label="Pace" value={m.relationshipPace} />
            </dl>
          </Section>

          <Section title="Who to meet">
            <dl>
              <Field label="Age range" value={
                m.ageRangeMin && m.ageRangeMax ? `${m.ageRangeMin}–${m.ageRangeMax}` : null
              } />
              <Field label="Max distance" value={m.preferredDistanceMiles ? `${m.preferredDistanceMiles} miles` : null} />
              <Field label="Meeting preferences" value={m.meetingPreferences} />
            </dl>
          </Section>

          {essentials.length > 0 && (
            <Section title="My Essentials">
              <div className="space-y-2">
                {essentials.map((e) => (
                  <div key={e.factor} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                    <span className="text-[14px] text-plum font-sans">{e.label}</span>
                    <span className={`text-[11px] font-sans font-medium uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${
                      e.tier === "essential" ? "bg-oxblood-light text-oxblood" :
                      e.tier === "preferred" ? "bg-evergreen-light text-evergreen" :
                      "bg-ivory-dark text-stone"
                    }`}>{e.tier}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section title="Story">
            {([m.storyPrompt1, m.storyPrompt2, m.storyPrompt3] as (string|null)[]).map((answer, i) => {
              if (!answer) return null;
              return (
                <div key={i} className="mb-5">
                  <p className="text-[12px] text-stone font-sans mb-1 italic">{STORY_PROMPTS[i]}</p>
                  <p className="text-[14px] text-plum font-sans leading-6">{answer}</p>
                </div>
              );
            })}
            {m.priorities && m.priorities.filter(Boolean).length > 0 && (
              <div className="mt-4">
                <p className="text-[12px] text-stone font-sans mb-2">Three priorities:</p>
                <ol className="list-decimal list-inside space-y-1">
                  {m.priorities.filter(Boolean).map((p, i) => (
                    <li key={i} className="text-[14px] text-plum font-sans">{p}</li>
                  ))}
                </ol>
              </div>
            )}
          </Section>

          {/* Consent audit */}
          <Section title="Consent records">
            {consents.length === 0 ? (
              <p className="text-[13px] text-stone font-sans">No consent records found.</p>
            ) : (
              <div className="overflow-hidden border border-border rounded-md">
                <table className="w-full text-[12px] font-sans">
                  <thead>
                    <tr className="bg-ivory-dark border-b border-border">
                      {["Type", "Version", "Granted", "At", "IP"].map((h) => (
                        <th key={h} className="text-left px-3 py-2 text-stone font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {consents.map((c) => (
                      <tr key={c.id} className="border-b border-border last:border-0">
                        <td className="px-3 py-2 text-plum">{c.consentType}</td>
                        <td className="px-3 py-2 text-stone">{c.consentVersion}</td>
                        <td className="px-3 py-2">
                          <span className={c.granted && !c.withdrawnAt ? "text-evergreen" : "text-oxblood"}>
                            {c.granted && !c.withdrawnAt ? "Yes" : "Withdrawn / no"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-stone">{fmtDate(c.grantedAt)}</td>
                        <td className="px-3 py-2 text-stone">{c.ipAddress ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        </div>

        {/* Right: Admin panel */}
        <div className="sticky top-6">
          <AdminPanel
            memberId={m.id}
            currentStatus={m.status}
            currentNotes={m.internalNotes ?? ""}
            reviewedAt={m.reviewedAt ? fmtDate(m.reviewedAt) : null}
          />
        </div>
      </div>
    </div>
  );
}
