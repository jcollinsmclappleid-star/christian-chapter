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

export const staffUsers = pgTable("staff_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  status: varchar("status", { length: 40 }).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [uniqueIndex("staff_users_email_unique").on(table.email)]);

export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: varchar("type", { length: 80 }).notNull(),
  payload: jsonb("payload").notNull(),
  status: varchar("status", { length: 40 }).default("queued").notNull(),
  attempts: integer("attempts").default(0).notNull(),
  maxAttempts: integer("max_attempts").default(5).notNull(),
  runAfter: timestamp("run_after").defaultNow().notNull(),
  lockedAt: timestamp("locked_at"),
  lastError: text("last_error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
}, (table) => [
  index("jobs_status_run_idx").on(table.status, table.runAfter),
]);

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id"),
  channel: varchar("channel", { length: 40 }).notNull(),
  template: varchar("template", { length: 80 }).notNull(),
  payload: jsonb("payload"),
  status: varchar("status", { length: 40 }).default("queued").notNull(),
  lastError: text("last_error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  sentAt: timestamp("sent_at"),
}, (table) => [index("notifications_user_idx").on(table.userId)]);

export const providerResults = pgTable("provider_results", {
  id: serial("id").primaryKey(),
  feature: varchar("feature", { length: 80 }).notNull(),
  adapter: varchar("adapter", { length: 80 }).notNull(),
  state: varchar("state", { length: 40 }).notNull(),
  sandbox: boolean("sandbox").default(true).notNull(),
  entityType: varchar("entity_type", { length: 80 }).notNull(),
  entityId: varchar("entity_id", { length: 80 }).notNull(),
  message: text("message"),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("provider_results_entity_idx").on(table.entityType, table.entityId)]);

export const memberProfiles = pgTable("member_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  status: varchar("status", { length: 40 }).default("draft").notNull(),
  moderationStatus: varchar("moderation_status", { length: 40 }).default("clear").notNull(),
  currentSection: varchar("current_section", { length: 40 }).default("about").notNull(),
  firstName: varchar("first_name", { length: 100 }),
  dateOfBirth: varchar("date_of_birth", { length: 10 }),
  gender: varchar("gender", { length: 50 }),
  seekingGender: text("seeking_gender").array(),
  aboutMe: text("about_me"),
  tradition: varchar("tradition", { length: 100 }),
  churchAttendance: varchar("church_attendance", { length: 100 }),
  faithCentrality: varchar("faith_centrality", { length: 100 }),
  faithDescription: text("faith_description"),
  relationshipGoal: varchar("relationship_goal", { length: 100 }),
  openToRemarriage: boolean("open_to_remarriage"),
  relationshipPace: varchar("relationship_pace", { length: 50 }),
  relationshipHistory: varchar("relationship_history", { length: 80 }),
  familySituation: varchar("family_situation", { length: 100 }),
  dependentChildren: boolean("dependent_children"),
  adultChildren: boolean("adult_children"),
  grandchildren: boolean("grandchildren"),
  workStatus: varchar("work_status", { length: 100 }),
  interests: text("interests").array(),
  futureChildren: varchar("future_children", { length: 80 }),
  lookingFor: text("looking_for"),
  nextChapter: text("next_chapter"),
  caringResponsibilities: text("caring_responsibilities"),
  smoking: varchar("smoking", { length: 40 }),
  alcohol: varchar("alcohol", { length: 40 }),
  ukResidence: varchar("uk_residence", { length: 40 }),
  ukNation: varchar("uk_nation", { length: 40 }),
  ukRegion: varchar("uk_region", { length: 100 }),
  travelRadiusMiles: integer("travel_radius_miles"),
  openToRelocation: boolean("open_to_relocation"),
  candidatePools: text("candidate_pools").array(),
  ageRangeMin: integer("age_range_min"),
  ageRangeMax: integer("age_range_max"),
  breakConversationPolicy: varchar("break_conversation_policy", { length: 40 }).default("preserve"),
  preferenceRevision: integer("preference_revision").default(0).notNull(),
  essentials: jsonb("essentials"),
  visibility: jsonb("visibility"),
  prompts: jsonb("prompts"),
  reviewNotes: text("review_notes"),
  planEntitlement: varchar("plan_entitlement", { length: 20 }).default("free").notNull(),
  activityState: varchar("activity_state", { length: 40 }).default("active_now").notNull(),
  synthetic: boolean("synthetic").default(false).notNull(),
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  hiddenAt: timestamp("hidden_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("member_profiles_user_unique").on(table.userId),
  index("member_profiles_status_idx").on(table.status),
]);

export const memberPhotos = pgTable("member_photos", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .references(() => memberProfiles.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id").notNull(),
  position: integer("position").notNull(),
  storageKey: varchar("storage_key", { length: 255 }).notNull(),
  moderationStatus: varchar("moderation_status", { length: 40 }).default("pending").notNull(),
  verificationStatus: varchar("verification_status", { length: 40 }).default("unverified").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const memberMedia = pgTable("member_media", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .references(() => memberProfiles.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id").notNull(),
  kind: varchar("kind", { length: 20 }).notNull(),
  storageKey: varchar("storage_key", { length: 255 }).notNull(),
  moderationStatus: varchar("moderation_status", { length: 40 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** One face check per member. The photograph is cleared once a person decides, or after 24 hours. */
export const photoChecks = pgTable("photo_checks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  status: varchar("status", { length: 40 }).default("pending").notNull(),
  imageData: text("image_data"),
  contentType: varchar("content_type", { length: 40 }),
  consentedAt: timestamp("consented_at").notNull(),
  decidedAt: timestamp("decided_at"),
  imageDeletedAt: timestamp("image_deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [uniqueIndex("photo_checks_user_unique").on(table.userId)]);

export const verificationChecks = pgTable("verification_checks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  kind: varchar("kind", { length: 40 }).notNull(),
  state: varchar("state", { length: 40 }).notNull(),
  adapter: varchar("adapter", { length: 80 }).notNull(),
  sandbox: boolean("sandbox").default(true).notNull(),
  expiresAt: timestamp("expires_at"),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("verification_checks_user_idx").on(table.userId, table.kind)]);

export const matchingRules = pgTable("matching_rules", {
  version: varchar("version", { length: 40 }).primaryKey(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recommendationSnapshots = pgTable("recommendation_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  viewerUserId: uuid("viewer_user_id").notNull(),
  rulesVersion: varchar("rules_version", { length: 40 }).notNull(),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  clockAt: timestamp("clock_at").notNull(),
  expiresAt: timestamp("expires_at"),
  payload: jsonb("payload").notNull(),
}, (table) => [
  index("recommendation_snapshots_viewer_idx").on(table.viewerUserId, table.generatedAt),
]);

export const introductions = pgTable("introductions", {
  id: uuid("id").defaultRandom().primaryKey(),
  snapshotId: uuid("snapshot_id").notNull(),
  viewerUserId: uuid("viewer_user_id").notNull(),
  candidateUserId: uuid("candidate_user_id").notNull(),
  pool: varchar("pool", { length: 40 }).notNull(),
  alignmentLabel: varchar("alignment_label", { length: 40 }).notNull(),
  why: jsonb("why").notNull(),
  worthDiscussing: jsonb("worth_discussing").notNull(),
  rank: integer("rank").notNull(),
  score: integer("score").notNull(),
  exploration: boolean("exploration").default(false).notNull(),
  status: varchar("status", { length: 40 }).default("presented").notNull(),
  presentedAt: timestamp("presented_at").defaultNow().notNull(),
  actedAt: timestamp("acted_at"),
  expiresAt: timestamp("expires_at"),
}, (table) => [
  index("introductions_viewer_idx").on(table.viewerUserId, table.status),
  index("introductions_candidate_idx").on(table.candidateUserId),
]);

export const interests = pgTable("interests", {
  id: uuid("id").defaultRandom().primaryKey(),
  fromUserId: uuid("from_user_id").notNull(),
  toUserId: uuid("to_user_id").notNull(),
  introductionId: uuid("introduction_id"),
  kind: varchar("kind", { length: 20 }).notNull(),
  status: varchar("status", { length: 40 }).default("open").notNull(),
  preferenceHash: varchar("preference_hash", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
}, (table) => [
  uniqueIndex("interests_pair_unique").on(table.fromUserId, table.toUserId),
  index("interests_to_idx").on(table.toUserId, table.kind),
]);

export const matches = pgTable("matches", {
  id: uuid("id").defaultRandom().primaryKey(),
  userAId: uuid("user_a_id").notNull(),
  userBId: uuid("user_b_id").notNull(),
  status: varchar("status", { length: 40 }).default("open").notNull(),
  closedReason: varchar("closed_reason", { length: 80 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  closedAt: timestamp("closed_at"),
}, (table) => [
  uniqueIndex("matches_pair_unique").on(table.userAId, table.userBId),
]);

export const memberBlocks = pgTable("member_blocks", {
  id: uuid("id").defaultRandom().primaryKey(),
  blockerUserId: uuid("blocker_user_id").notNull(),
  blockedUserId: uuid("blocked_user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("member_blocks_pair_unique").on(table.blockerUserId, table.blockedUserId),
]);

export const memberReports = pgTable("member_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  reporterUserId: uuid("reporter_user_id").notNull(),
  reportedUserId: uuid("reported_user_id").notNull(),
  source: varchar("source", { length: 40 }).notNull(),
  reason: varchar("reason", { length: 80 }).notNull(),
  detail: text("detail"),
  status: varchar("status", { length: 40 }).default("open").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activityEvents = pgTable("activity_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  kind: varchar("kind", { length: 40 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("activity_events_user_idx").on(table.userId, table.createdAt),
]);

export type MemberProfile = typeof memberProfiles.$inferSelect;
export type StaffUser = typeof staffUsers.$inferSelect;
export type Introduction = typeof introductions.$inferSelect;
export type Interest = typeof interests.$inferSelect;
export type MatchRow = typeof matches.$inferSelect;
