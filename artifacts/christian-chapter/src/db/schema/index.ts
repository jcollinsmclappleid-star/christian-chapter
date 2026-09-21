import {
  pgTable,
  serial,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  jsonb,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/** Legacy waitlist table. Retained; new writes go to users + founding_applications. */
export const foundingMembers = pgTable("founding_members", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  marketingConsent: boolean("marketing_consent").default(false).notNull(),
  dateOfBirth: varchar("date_of_birth", { length: 10 }).notNull(),
  gender: varchar("gender", { length: 50 }).notNull(),
  seekingGender: text("seeking_gender").array().notNull(),
  ukRegion: varchar("uk_region", { length: 100 }).notNull(),
  travelRadiusMiles: integer("travel_radius_miles").notNull(),
  tradition: varchar("tradition", { length: 100 }).notNull(),
  churchAttendance: varchar("church_attendance", { length: 100 }).notNull(),
  faithCentrality: varchar("faith_centrality", { length: 100 }).notNull(),
  faithDescription: text("faith_description"),
  workStatus: varchar("work_status", { length: 100 }),
  familySituation: varchar("family_situation", { length: 100 }),
  interests: text("interests").array(),
  relationshipGoal: varchar("relationship_goal", { length: 100 }),
  openToRemarriage: boolean("open_to_remarriage"),
  relationshipPace: varchar("relationship_pace", { length: 50 }),
  ageRangeMin: integer("age_range_min"),
  ageRangeMax: integer("age_range_max"),
  preferredDistanceMiles: integer("preferred_distance_miles"),
  meetingPreferences: text("meeting_preferences"),
  essentials: jsonb("essentials"),
  storyPrompt1: text("story_prompt_1"),
  storyPrompt2: text("story_prompt_2"),
  storyPrompt3: text("story_prompt_3"),
  priorities: text("priorities").array(),
  photoConsent: boolean("photo_consent").default(false),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  internalNotes: text("internal_notes"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  status: varchar("status", { length: 50 })
    .default("pending_email_verification")
    .notNull(),
  emailVerifiedAt: timestamp("email_verified_at"),
  lastActiveAt: timestamp("last_active_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  legacyFoundingMemberId: integer("legacy_founding_member_id"),
}, (table) => [
  uniqueIndex("users_email_unique").on(table.email),
]);

export const emailTokens = pgTable("email_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  purpose: varchar("purpose", { length: 40 }).notNull(),
  tokenHash: varchar("token_hash", { length: 64 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("email_tokens_hash_unique").on(table.tokenHash),
  index("email_tokens_user_idx").on(table.userId),
]);

export const foundingApplications = pgTable("founding_applications", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: varchar("status", { length: 50 }).default("draft").notNull(),
  currentStep: integer("current_step").default(1).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  marketingConsent: boolean("marketing_consent").default(false).notNull(),
  dateOfBirth: varchar("date_of_birth", { length: 10 }),
  gender: varchar("gender", { length: 50 }),
  seekingGender: text("seeking_gender").array(),
  ukRegion: varchar("uk_region", { length: 100 }),
  travelRadiusMiles: integer("travel_radius_miles"),
  tradition: varchar("tradition", { length: 100 }),
  churchAttendance: varchar("church_attendance", { length: 100 }),
  faithCentrality: varchar("faith_centrality", { length: 100 }),
  faithDescription: text("faith_description"),
  workStatus: varchar("work_status", { length: 100 }),
  familySituation: varchar("family_situation", { length: 100 }),
  interests: text("interests").array(),
  relationshipGoal: varchar("relationship_goal", { length: 100 }),
  openToRemarriage: boolean("open_to_remarriage"),
  relationshipPace: varchar("relationship_pace", { length: 50 }),
  ageRangeMin: integer("age_range_min"),
  ageRangeMax: integer("age_range_max"),
  preferredDistanceMiles: integer("preferred_distance_miles"),
  meetingPreferences: text("meeting_preferences"),
  essentials: jsonb("essentials"),
  storyPrompt1: text("story_prompt_1"),
  storyPrompt2: text("story_prompt_2"),
  storyPrompt3: text("story_prompt_3"),
  priorities: text("priorities").array(),
  photoConsent: boolean("photo_consent").default(false),
  eligibilityAcknowledged: boolean("eligibility_acknowledged").default(false).notNull(),
  wizardPayload: jsonb("wizard_payload"),
  internalNotes: text("internal_notes"),
  reviewedAt: timestamp("reviewed_at"),
  submittedAt: timestamp("submitted_at"),
  hiddenAt: timestamp("hidden_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("founding_applications_user_unique").on(table.userId),
]);

export const policyDocuments = pgTable("policy_documents", {
  slug: varchar("slug", { length: 50 }).primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  version: varchar("version", { length: 50 }).notNull(),
  effectiveDate: varchar("effective_date", { length: 40 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const consentRecords = pgTable("consent_records", {
  id: serial("id").primaryKey(),
  foundingMemberId: integer("founding_member_id").references(
    () => foundingMembers.id,
    { onDelete: "cascade" },
  ),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  consentType: varchar("consent_type", { length: 100 }).notNull(),
  consentVersion: varchar("consent_version", { length: 50 }).notNull(),
  granted: boolean("granted").notNull(),
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
  withdrawnAt: timestamp("withdrawn_at"),
  source: varchar("source", { length: 80 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
});

export const auditEvents = pgTable("audit_events", {
  id: serial("id").primaryKey(),
  actorType: varchar("actor_type", { length: 40 }).notNull(),
  actorId: varchar("actor_id", { length: 80 }),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 80 }).notNull(),
  entityId: varchar("entity_id", { length: 80 }).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accountClosureRequests = pgTable("account_closure_requests", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  reason: varchar("reason", { length: 80 }).notNull(),
  detail: text("detail"),
  status: varchar("status", { length: 40 }).default("open").notNull(),
  scheduledDeleteAt: timestamp("scheduled_delete_at"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type FoundingMember = typeof foundingMembers.$inferSelect;
export type InsertFoundingMember = typeof foundingMembers.$inferInsert;
export type User = typeof users.$inferSelect;
export type FoundingApplication = typeof foundingApplications.$inferSelect;

export * from "./platform";
