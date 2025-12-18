<!--
Source: Based on Obsidian Sample Theme and community guidelines
Last synced: See sync-status.json for authoritative sync dates
Update frequency: Check Obsidian Sample Theme repo for updates
-->

# Project overview

- Target: Obsidian Community Theme (CSS/SCSS).
- Entry point: `theme.css` (or compiled from SCSS) loaded by Obsidian.
- **Theme structure patterns**:
  - **Simple CSS theme**: `theme.css` in root (no build step, edit directly)
  - **Complex theme**: `src/scss/` directory with build tools (Grunt, npm scripts, etc.) that compiles to `theme.css`
  - **Important**: Themes can have `theme.css` in root (simple) or use `src/scss/` with build tools (complex). Never have both patterns. See [file-conventions.md](file-conventions.md) for structure.
- Required release artifacts: `manifest.json` and `theme.css`.
- Optional: `snippets/` directory for theme snippets.


