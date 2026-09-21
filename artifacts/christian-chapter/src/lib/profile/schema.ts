import { z } from "zod";
import { getAge } from "@/lib/age";
import { MINIMUM_AGE } from "@/lib/site-config";
import { VISIBILITY_FIELDS, VISIBILITY_LEVELS } from "./visibility";

export const PROFILE_STATUSES = [
  "draft",
  "submitted",
  "review",
  "changes_required",
  "approved",
  "paused",
  "hidden",
] as const;

export const PROFILE_SECTIONS = [
  "about",
  "faith",
  "intentions",
  "history",
  "family",
  "lifestyle",
  "future",
  "location",
  "essentials",
] as const;

const optionalText = z.string().max(4000).optional();
const optionalShort = z.string().max(100).optional();

export const ProfileVisibilitySchema = z.object(
  Object.fromEntries(VISIBILITY_FIELDS.map((field) => [field, z.enum(VISIBILITY_LEVELS).optional()])),
);

export const ProfilePatchSchema = z.object({
  currentSection: z.enum(PROFILE_SECTIONS).optional(),
  firstName: optionalShort,
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .optional()
    .or(z.literal("")),
  gender: optionalShort,
  seekingGender: z.array(z.string().max(50)).max(4).optional(),
  aboutMe: optionalText,
  tradition: optionalShort,
  churchAttendance: optionalShort,
  faithCentrality: optionalShort,
  faithDescription: optionalText,
  relationshipGoal: optionalShort,
  openToRemarriage: z.boolean().nullable().optional(),
  relationshipPace: optionalShort,
  relationshipHistory: optionalShort,
  familySituation: optionalShort,
  dependentChildren: z.boolean().optional(),
  adultChildren: z.boolean().optional(),
  grandchildren: z.boolean().optional(),
  workStatus: optionalShort,
  interests: z.array(z.string().max(80)).max(20).optional(),
  futureChildren: optionalShort,
  lookingFor: optionalText,
  nextChapter: optionalText,
  caringResponsibilities: optionalText,
  smoking: optionalShort,
  alcohol: optionalShort,
  ukResidence: z.enum(["resident", "intending_to_relocate"]).optional(),
  ukNation: optionalShort,
  ukRegion: optionalShort,
  travelRadiusMiles: z.number().int().min(5).max(500).optional(),
  ageRangeMin: z.number().int().min(40).max(120).optional(),
  ageRangeMax: z.number().int().min(40).max(120).optional(),
  openToRelocation: z.boolean().optional(),
  candidatePools: z.array(z.enum(["nearby", "worth_the_journey", "open_to_distance"])).max(3).optional(),
  essentials: z
    .array(
      z.object({
        factor: z.string(),
        label: z.string(),
        tier: z.enum(["essential", "preferred", "open"]),
      }),
    )
    .max(20)
    .optional(),
  prompts: z
    .array(
      z.object({
        prompt: z.string().max(240),
        answer: z.string().max(800),
      }),
    )
    .max(6)
    .optional(),
  visibility: ProfileVisibilitySchema.optional(),
  status: z.enum(["draft", "paused"]).optional(),
});

export type ProfilePatch = z.infer<typeof ProfilePatchSchema>;

export const AdminProfilePatchSchema = z.object({
  status: z.enum(PROFILE_STATUSES).optional(),
  moderationStatus: z.enum(["clear", "pending", "held", "rejected"]).optional(),
  internalNote: z.string().max(2000).optional(),
});

export function assertEligibleDob(dateOfBirth: string): string | null {
  const age = getAge(dateOfBirth);
  if (age === null) return "Enter a valid date of birth.";
  if (age < MINIMUM_AGE) return `Christian Chapter is for adults aged ${MINIMUM_AGE} and over.`;
  return null;
}

export function submitBlockingErrors(profile: {
  firstName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  seekingGender: string[] | null;
  aboutMe: string | null;
  tradition: string | null;
  churchAttendance: string | null;
  faithCentrality: string | null;
  relationshipGoal: string | null;
  relationshipHistory: string | null;
  ukRegion: string | null;
  ukResidence?: string | null;
  travelRadiusMiles: number | null;
  photoCount: number;
}): string[] {
  const errors: string[] = [];
  if (!profile.firstName?.trim()) errors.push("Add your first name.");
  if (!profile.dateOfBirth) errors.push("Add your date of birth.");
  else {
    const dobError = assertEligibleDob(profile.dateOfBirth);
    if (dobError) errors.push(dobError);
  }
  if (!profile.gender) errors.push("Add how you describe yourself.");
  if (!profile.seekingGender?.length) errors.push("Add who you would like to meet.");
  if (!profile.aboutMe || profile.aboutMe.trim().length < 40) {
    errors.push("Write at least 40 characters about yourself.");
  }
  if (!profile.tradition) errors.push("Add your Christian tradition.");
  if (!profile.churchAttendance) errors.push("Add how often you attend church.");
  if (!profile.faithCentrality) errors.push("Add how central faith is for you.");
  if (!profile.relationshipGoal) errors.push("Add what you are looking for.");
  if (!profile.relationshipHistory) errors.push("Add your relationship history.");
  if (!profile.ukResidence) errors.push("Declare UK residence or intended relocation.");
  if (!profile.ukRegion) errors.push("Add your UK region.");
  if (!profile.travelRadiusMiles) errors.push("Add how far you can travel.");
  if (profile.photoCount < 4) errors.push("Add at least four photographs.");
  if (profile.photoCount > 8) errors.push("Keep eight photographs or fewer.");
  return errors;
}
