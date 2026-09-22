import type { WizardData } from "@/app/register/_components/wizard-types";
import { defaultWizardData } from "@/app/register/_components/wizard-types";
import type { FoundingApplication } from "@/db";

export function applicationToWizard(
  row: FoundingApplication,
): { data: WizardData; step: number } {
  const payload = (row.wizardPayload ?? {}) as Partial<WizardData>;
  const data: WizardData = {
    ...defaultWizardData,
    ...payload,
    firstName: row.firstName ?? payload.firstName ?? "",
    email: payload.email ?? "",
    marketingConsent: row.marketingConsent,
    dateOfBirth: row.dateOfBirth ?? "",
    gender: row.gender ?? "",
    seekingGender: row.seekingGender ?? [],
    ukRegion: row.ukRegion ?? "",
    travelRadiusMiles: row.travelRadiusMiles ?? 40,
    religiousDataConsent: payload.religiousDataConsent ?? false,
    religiousDataConsentTimestamp: payload.religiousDataConsentTimestamp ?? null,
    religiousDataConsentVersion: payload.religiousDataConsentVersion ?? "",
    tradition: row.tradition ?? "",
    churchAttendance: row.churchAttendance ?? "",
    faithCentrality: row.faithCentrality ?? "",
    faithDescription: row.faithDescription ?? "",
    workStatus: row.workStatus ?? "",
    familySituation: row.familySituation ?? "",
    interests: row.interests ?? [],
    relationshipGoal: row.relationshipGoal ?? "",
    openToRemarriage: row.openToRemarriage ?? null,
    relationshipPace: row.relationshipPace ?? "",
    ageRangeMin: row.ageRangeMin ?? 40,
    ageRangeMax: row.ageRangeMax ?? 70,
    preferredDistanceMiles: row.preferredDistanceMiles ?? 50,
    meetingPreferences: row.meetingPreferences ?? "",
    essentials: (row.essentials as WizardData["essentials"]) ?? [],
    storyPrompt1: row.storyPrompt1 ?? "",
    storyPrompt2: row.storyPrompt2 ?? "",
    storyPrompt3: row.storyPrompt3 ?? "",
    priorities: row.priorities ?? [],
    photoConsent: row.photoConsent ?? false,
    eligibilityAcknowledged: row.eligibilityAcknowledged,
    termsAccepted: payload.termsAccepted ?? false,
  };
  const storedVersion = (row.wizardPayload as { flowVersion?: number } | null)?.flowVersion;
  const step = storedVersion === 2 ? Math.min(Math.max(row.currentStep ?? 1, 1), 10) : 1;
  return { data, step };
}

export function wizardToApplicationValues(data: WizardData, step: number) {
  return {
    currentStep: step,
    firstName: data.firstName.trim() || null,
    marketingConsent: data.marketingConsent,
    dateOfBirth: data.dateOfBirth || null,
    gender: data.gender || null,
    seekingGender: data.seekingGender,
    ukRegion: data.ukRegion || null,
    travelRadiusMiles: data.travelRadiusMiles,
    tradition: data.tradition || null,
    churchAttendance: data.churchAttendance || null,
    faithCentrality: data.faithCentrality || null,
    faithDescription: data.faithDescription || null,
    workStatus: data.workStatus || null,
    familySituation: data.familySituation || null,
    interests: data.interests,
    relationshipGoal: data.relationshipGoal || null,
    openToRemarriage: data.openToRemarriage,
    relationshipPace: data.relationshipPace || null,
    ageRangeMin: data.ageRangeMin,
    ageRangeMax: data.ageRangeMax,
    preferredDistanceMiles: data.preferredDistanceMiles,
    meetingPreferences: data.meetingPreferences || null,
    essentials: data.essentials,
    storyPrompt1: data.storyPrompt1 || null,
    storyPrompt2: data.storyPrompt2 || null,
    storyPrompt3: data.storyPrompt3 || null,
    priorities: data.priorities,
    photoConsent: data.photoConsent,
    eligibilityAcknowledged: data.eligibilityAcknowledged,
    wizardPayload: data,
    updatedAt: new Date(),
  };
}
