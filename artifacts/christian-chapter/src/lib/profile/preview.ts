import { getAge } from "@/lib/age";
import type { MemberProfile } from "@/db/schema/platform";
import { answeredPrompts, parsePrompts } from "./prompts";
import { isVisibleTo, parseVisibility, type VisibilityField } from "./visibility";

const FIELD_MAP: Record<VisibilityField, keyof MemberProfile | "photos" | "media"> = {
  aboutMe: "aboutMe",
  faithDescription: "faithDescription",
  familySituation: "familySituation",
  workStatus: "workStatus",
  relationshipHistory: "relationshipHistory",
  lookingFor: "lookingFor",
  nextChapter: "nextChapter",
  photos: "photos",
  media: "media",
};

export function publicProfileView(
  profile: MemberProfile,
  photos: Array<{ id: string; position: number; moderationStatus: string }>,
  media: Array<{ id: string; kind: string; moderationStatus: string; url?: string }>,
  viewer: "member" | "match",
) {
  const visibility = parseVisibility(profile.visibility);
  const hide = (field: VisibilityField) => !isVisibleTo(visibility[field], viewer);
  const age = profile.dateOfBirth ? getAge(profile.dateOfBirth) : null;

  return {
    firstName: profile.firstName,
    age,
    ukNation: profile.ukNation,
    ukRegion: profile.ukRegion,
    tradition: profile.tradition,
    churchAttendance: profile.churchAttendance,
    faithCentrality: profile.faithCentrality,
    relationshipGoal: profile.relationshipGoal,
    relationshipPace: profile.relationshipPace,
    interests: profile.interests,
    travelRadiusMiles: profile.travelRadiusMiles,
    openToRelocation: profile.openToRelocation,
    candidatePools: profile.candidatePools,
    workStatus: hide("workStatus") ? null : profile.workStatus,
    aboutMe: hide("aboutMe") ? null : profile.aboutMe,
    faithDescription: hide("faithDescription") ? null : profile.faithDescription,
    familySituation: hide("familySituation") ? null : profile.familySituation,
    relationshipHistory: hide("relationshipHistory") ? null : profile.relationshipHistory,
    lookingFor: hide("lookingFor") ? null : profile.lookingFor,
    nextChapter: hide("nextChapter") ? null : profile.nextChapter,
    prompts: answeredPrompts(parsePrompts(profile.prompts)),
    photos: hide("photos")
      ? []
      : photos
          .filter((p) => p.moderationStatus === "clear" || p.moderationStatus === "pending")
          .map((photo) => ({
            ...photo,
            url: `/api/profile/photos/${photo.id}`,
          })),
    media: hide("media")
      ? []
      : media.filter((m) => m.moderationStatus === "clear" || m.moderationStatus === "pending"),
    visibilityNote:
      viewer === "member"
        ? "This is how another member would see your profile before a match."
        : "This is how a mutual match would see additional fields you marked for matches.",
    hiddenFields: (Object.keys(FIELD_MAP) as VisibilityField[]).filter(hide),
  };
}
