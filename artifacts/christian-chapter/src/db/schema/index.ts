import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

// ── Founding members ─────────────────────────────────────────────────────────

export const foundingMembers = pgTable("founding_members", {
  id: serial("id").primaryKey(),

  // Account
  firstName: varchar("first_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  marketingConsent: boolean("marketing_consent").default(false).notNull(),

  // About you
  dateOfBirth: varchar("date_of_birth", { length: 10 }).notNull(),
  gender: varchar("gender", { length: 50 }).notNull(),
  seekingGender: text("seeking_gender").array().notNull(),

  // Location
  ukRegion: varchar("uk_region", { length: 100 }).notNull(),
  travelRadiusMiles: integer("travel_radius_miles").notNull(),

  // Faith
  tradition: varchar("tradition", { length: 100 }).notNull(),
  churchAttendance: varchar("church_attendance", { length: 100 }).notNull(),
  faithCentrality: varchar("faith_centrality", { length: 100 }).notNull(),
  faithDescription: text("faith_description"),

  // Life now
  workStatus: varchar("work_status", { length: 100 }),
  familySituation: varchar("family_situation", { length: 100 }),
  interests: text("interests").array(),

  // Intentions
  relationshipGoal: varchar("relationship_goal", { length: 100 }),
  openToRemarriage: boolean("open_to_remarriage"),
  relationshipPace: varchar("relationship_pace", { length: 50 }),

  // Who to meet
  ageRangeMin: integer("age_range_min"),
  ageRangeMax: integer("age_range_max"),
  preferredDistanceMiles: integer("preferred_distance_miles"),
  meetingPreferences: text("meeting_preferences"),

  // Essentials
  essentials: jsonb("essentials"),

  // Story
  storyPrompt1: text("story_prompt_1"),
  storyPrompt2: text("story_prompt_2"),
  storyPrompt3: text("story_prompt_3"),
  priorities: text("priorities").array(),
  photoConsent: boolean("photo_consent").default(false),

  // Admin
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  internalNotes: text("internal_notes"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Consent records (separate audit table) ───────────────────────────────────

export const consentRecords = pgTable("consent_records", {
  id: serial("id").primaryKey(),
  foundingMemberId: integer("founding_member_id")
    .references(() => foundingMembers.id, { onDelete: "cascade" })
    .notNull(),
  consentType: varchar("consent_type", { length: 100 }).notNull(),
  consentVersion: varchar("consent_version", { length: 50 }).notNull(),
  granted: boolean("granted").notNull(),
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
});

export type FoundingMember = typeof foundingMembers.$inferSelect;
export type InsertFoundingMember = typeof foundingMembers.$inferInsert;
