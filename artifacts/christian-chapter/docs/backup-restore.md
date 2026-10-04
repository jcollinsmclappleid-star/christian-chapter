# After a database restore

Internal. Short procedure. Not a backup product.

Neon keeps its own backups. This app does not replay them.

After a restore, call `GET /api/cron/jobs` with `Authorization: Bearer CRON_SECRET` before members use the site. That deletes messages past their expiry and report copies past 90 days. Do not treat a restored backup as permission to keep a message that had already expired.
