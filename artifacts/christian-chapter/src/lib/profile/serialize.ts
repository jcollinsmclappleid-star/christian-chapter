import type { MemberProfile } from "@/db/schema/platform";
import { parsePrompts } from "./prompts";
import { parseVisibility } from "./visibility";
import { submitBlockingErrors } from "./schema";

export function serializeProfile(
  profile: MemberProfile,
  extras: {
    photos: Array<{
      id: string;
      position: number;
      moderationStatus: string;
      verificationStatus: string;
    }>;
    messages?: Array<{ id: string; body: string; createdAt: Date | string }>;
  },
) {
  const missing = submitBlockingErrors({
    firstName: profile.firstName,
    dateOfBirth: profile.dateOfBirth,
    gender: profile.gender,
    seekingGender: profile.seekingGender,
    aboutMe: profile.aboutMe,
    tradition: profile.tradition,
    churchAttendance: profile.churchAttendance,
    faithCentrality: profile.faithCentrality,
    relationshipGoal: profile.relationshipGoal,
    relationshipHistory: profile.relationshipHistory,
    ukRegion: profile.ukRegion,
    ukResidence: profile.ukResidence,
    travelRadiusMiles: profile.travelRadiusMiles,
    photoCount: extras.photos.length,
  });

  return {
    ...profile,
    prompts: parsePrompts(profile.prompts),
    visibility: parseVisibility(profile.visibility),
    photos: extras.photos.map((photo) => ({
      ...photo,
      url: `/api/profile/photos/${photo.id}`,
    })),
    messages: extras.messages ?? [],
    completion: {
      ready: missing.length === 0,
      missing,
      photoCount: extras.photos.length,
    },
  };
}
