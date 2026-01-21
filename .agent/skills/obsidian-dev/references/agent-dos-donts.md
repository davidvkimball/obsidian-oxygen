<!--
Source: Based on Obsidian community best practices
Last synced: See sync-status.json for authoritative sync dates
Update frequency: Review periodically for AI agent-specific guidance
-->

# Agent do/don't

**Do**
- **.ref folder setup**: When user asks to add a reference, check if it already exists first. For external repos:
  - **Clone directly** into the target folder: `../.ref/obsidian-dev/plugins/<name>/` (for plugins), `../.ref/obsidian-dev/themes/<name>/` (for themes), or `../.ref/obsidian-dev/<name>/` (for other projects)
  - **DO NOT** create a `.ref` subfolder inside the plugins/themes folder - clone the repo directly there
  - Then create symlink in project's `.ref/` folder pointing to the global location
  - For local projects, symlink directly in project's `.ref/` (don't clone to global)
  - See [ref-instructions.md](ref-instructions.md) for details.
- Use consistent CSS variable naming conventions.
- Test themes in both light and dark modes.
- **Always run the build command after making changes** (if using build tools) to catch build errors early. For simple CSS themes, no build step is needed. For complex themes with build tools, run the appropriate build command (e.g., `npx grunt build` for Grunt, `npm run build` for npm scripts). Only check for npm installation if the build fails. See [build-workflow.md](build-workflow.md) for details.
- **Summarize commands**: When user requests "Summarize" or "Summarize for release", follow the workflow in [summarize-commands.md](summarize-commands.md). Always read actual file changes, not just chat history.
- **Release preparation**: When user asks "is my theme ready for release?" or similar, use [release-readiness.md](release-readiness.md) checklist. Run automated checks where possible, ask user interactively for items requiring their input (like platform testing).

**Don't**
- Introduce network calls without an obvious user-facing reason and documentation.
- Ship features that require cloud services without clear disclosure and explicit opt-in.
- Store or transmit vault contents unless essential and consented.
- Don't override core Obsidian functionality with CSS hacks that break features.
- **File structure**: Never have both `theme.css` as source AND `src/scss/` - choose one pattern. Simple themes should use `theme.css` directly. Complex themes should use `src/scss/` and compile to `theme.css`. See [file-conventions.md](file-conventions.md) for structure.
- **Git operations**: Never automatically commit, push, or perform any git operations. All git operations must be left to the user.
- **Git updates**: When checking for updates to repos in `.ref`, you can use read-only commands like `git fetch` and `git log` to check what's new, but **never automatically pull** - always ask the user first. See [ref-instructions.md](ref-instructions.md) for how to check for updates.


