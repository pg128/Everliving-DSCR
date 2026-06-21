# Everchanging

> Care records that move with you.

A static, GitHub Pages-ready concept for a UK digital social care record (DSCR). It is a visual demonstration only: every resident, care record and metric in the interface is fictional.

## Publish it on GitHub Pages

1. Commit and push these files to the repository's default branch.
2. On GitHub, open **Settings** → **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the default branch and the **/(root)** folder, then save.

GitHub will give you the public address within a minute or two.

## What is included

- Interactive overview dashboard and shift handover
- A functional People directory: add, find, filter, open and edit a person; entries persist in that browser only
- People is isolated in `people.js`, establishing a narrow service-user directory boundary for future modules
- Demonstration views for care plans, daily notes, medicines, tasks and reports
- Responsive layout for phones, tablets and desktops
- Local-only prototype interactions: tabs, task completion, search, record capture dialog and status messages

## Deliberately not included yet

Authentication, real resident data, persistence, integrations and clinical compliance controls. A production DSCR needs those designed and assessed properly before use in care delivery.
