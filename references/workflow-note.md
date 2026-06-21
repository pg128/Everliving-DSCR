# Note to self: project workflow

## What the repo is

The GitHub repo is the online copy of the project.

The folder on my computer is the local copy.

When I work in VS Code, I am changing the local copy.

To save work properly:

- Commit = save a checkpoint locally
- Push/Sync = upload that checkpoint to GitHub

## Starting work

1. Open VS Code.
2. Open the project folder.
3. Pull/Sync first if VS Code shows remote changes.
4. Use Codex to make changes.
5. Review the files Codex changed.
6. Run/test the project if possible.
7. Commit the changes.
8. Push/Sync to GitHub.

Basic loop:

```text
open project
→ get latest version
→ Codex edits files
→ review changes
→ test
→ commit
→ push
```

## Stopping work

Before closing VS Code:

1. Open the Source Control tab.
2. Check what files changed.
3. If the changes are worth keeping, write a short commit message.
4. Click Commit.
5. Click Push or Sync Changes.
6. Then close VS Code.

Do not leave important work only on the computer. Push it to GitHub before stopping.

## Good commit messages

Examples:

```text
Add homepage layout
Update project brief
Fix mobile spacing
Add contact form
Add reference notes
```

Keep commit messages short and clear.

## Reference material

Put project context here:

```text
reference/
├─ brief.md
├─ goals.md
├─ design-notes.md
└─ examples.md
```

Use `AGENTS.md` for Codex instructions.

Example:

```md
# Codex instructions

Use the files in /reference for project context.

Keep code simple and readable.

Do not add unnecessary dependencies.

Explain what files you changed before finishing.
```

## Do not commit

Never upload:

```text
.env
passwords
API keys
tokens
node_modules/
```

`.gitignore` should block most of this, but still check before committing.

## Simple rule

When starting: pull/sync first.

When stopping: commit and push.
