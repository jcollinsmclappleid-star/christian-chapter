const DAY_MS = 24 * 60 * 60 * 1000;

/** Ordinary messages. A safety report does not yet keep a separate copy. */
export const UNREAD_MESSAGE_DAYS = 30;
export const READ_MESSAGE_DAYS = 7;
export const REPORT_EVIDENCE_DAYS = 90;

export function unreadMessageExpiry(sentAt: Date): Date {
  return new Date(sentAt.getTime() + UNREAD_MESSAGE_DAYS * DAY_MS);
}

/** First read only. A later view must not call this again. */
export function readMessageExpiry(firstReadAt: Date): Date {
  return new Date(firstReadAt.getTime() + READ_MESSAGE_DAYS * DAY_MS);
}

export const MESSAGE_RETENTION_COPY =
  "Messages are deleted seven days after they are first read, or 30 days after sending if unread. A message you select in a safety report is kept separately for 90 days.";
