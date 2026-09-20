---
name: Christian Chapter preview routing
description: The registration constraint required for the app to remain reachable through Replit's public development URL.
---

Christian Chapter must remain registered as the root web artifact and run through its artifact-managed workflow. A manually configured workflow can serve the app locally while the public development URL routes elsewhere and returns 404.

**Why:** The app worked on localhost but the external review URL was routed to the API service until Christian Chapter was registered as the web artifact at `/`.

**How to apply:** Preserve the artifact metadata when restoring or moving app files, and use the managed artifact workflow rather than creating a replacement workflow.