# AI Agent Instructions

This file serves as the **project-specific entry point** for AI agents working on this Obsidian theme project. General-purpose instructions are located in the [`.agents`](.agents/) directory.

**Note**: The `.agents/` directory contains general-purpose guidance files for Obsidian plugin and theme development.

---

## Project Context

<!--
Source: Project-specific (not synced from reference repos)
Last updated: [Maintain manually - this file is project-specific]
Applicability: Theme
-->

This is the **Oxygen Theme** for Obsidian - a fork of the Minimal theme with a custom Oxygen color scheme as the default. Oxygen extends Minimal's excellent foundation with enhanced color scheme management and custom preset functionality.

**Key features:**
- Calm color scheme prioritizing focus
- Polished animations with customizable speed and motion styles
- Advanced custom presets via the Oxygen Theme Settings plugin
- Full Style Settings integration supporting all Minimal features
- Part of the Vault CMS project

## Important Project-Specific Details

- **Project Type**: Obsidian theme (fork of Minimal)
- **Base Theme**: Based on [obsidian-minimal](https://github.com/kepano/obsidian-minimal)
- **Companion Plugin**: [obsidian-oxygen-settings](https://github.com/davidvkimball/obsidian-oxygen-settings) - controls theme settings
- **Status**: Active development

## Maintenance Tasks

- **README.md**: When asked to update documentation or when making significant changes, review and update `README.md` to ensure it accurately reflects the current state of the project, including features, installation instructions, and usage examples.
- Keep the sample functionality simple and clear for educational purposes
- Ensure all examples follow Obsidian best practices

## Project-Specific Conventions

- Code should remain simple and well-commented for educational purposes
- Examples should demonstrate one concept clearly rather than complex integrations
- Follow the standard Obsidian plugin structure (main.ts, manifest.json, styles.css)

## Project-Specific References

This project references specific plugins and themes that are relevant to its development. These are symlinked in `.ref/plugins/` or `.ref/themes/` as needed.

**Current project-specific references**:

- **`.ref/themes/obsidian-minimal/`** - The base theme upon which Oxygen is built
  - Source: https://github.com/kepano/obsidian-minimal
  - Location: Cloned to global `.ref/themes/` and symlinked in project
  - Purpose: Reference for Minimal theme patterns, structure, and features

- **`.ref/plugins/obsidian-minimal-settings/`** - The settings plugin for Minimal theme
  - Source: https://github.com/kepano/obsidian-minimal-settings
  - Location: Cloned to global `.ref/plugins/` and symlinked in project
  - Purpose: Reference for Minimal's settings plugin patterns and implementation

- **`.ref/plugins/obsidian-oxygen-settings/`** - The companion plugin that controls this theme
  - Source: Local project at `C:\Users\david\Development\obsidian-oxygen-settings`
  - Location: Symlinked directly to working copy (local development)
  - Purpose: Active development reference for theme settings integration

- **`.ref/plugins/obsidian-ui-tweaker/`** - UI Tweaker plugin reference
  - Source: Local project at `C:\Users\david\Development\obsidian-ui-tweaker`
  - Location: Symlinked directly to working copy (local development)
  - Purpose: Reference for UI customization patterns and integration

**Note**: The 6 core Obsidian projects (obsidian-api, obsidian-sample-plugin, obsidian-developer-docs, obsidian-plugin-docs, obsidian-sample-theme, eslint-plugin) are always relevant and should be in every project's `.ref` folder. Only project-specific plugins/themes are documented above.

## Overrides (Optional)

None currently. This project follows the general `.agents` guidance.

## Key Files and Their Purposes

- `manifest.json` - Theme metadata and configuration
- `theme.css` - Compiled theme CSS (distribution file)
- `Oxygen.css` - Unminified theme CSS (development file)
- `src/scss/` - SCSS source files organized by component
- `src/css/` - Compiled CSS output files
- `Gruntfile.js` - Build configuration for SCSS compilation
- `package.json` - Node.js dependencies and build scripts
- `version-bump.mjs` - Script for version management
- `versions.json` - Version compatibility mapping
- `README.md` - Project documentation and usage instructions

## Enhanced Borders Feature

The Enhanced Borders feature (`src/scss/features/borders.scss`) provides a sophisticated border system for the workspace with three modes:

### Border Modes

1. **Enhanced (Default)**: `body:not(.borders-on)` - The default behavior when neither `borders-on` nor `borders-none` is present
   - Rounded corners on main content area (`workspace-tab-container`)
   - Top, left, and right borders (no bottom border)
   - Background colors match sidebar for seamless appearance
   - Resize handles hidden by default, show on hover

2. **Default/On**: `body.borders-on` - Obsidian's default border behavior (not yet implemented in current version)

3. **None**: `body.borders-none` - No borders at all (set via CSS variables)

### Feature Organization

The Enhanced Borders feature is organized into logical groups:

#### Group 1: Foundation (Lines 1-30)
- CSS variable setup for `borders-none` mode
- CSS variable setup for `borders-on` detection
- Foundation for all border modes

#### Group 2: Core Container Borders (Lines 32-123)
- **2A**: Border reset on `workspace-tab-container` (prevents double borders)
- **2B**: Enhanced border styling (rounded corners, top/left/right borders)
- **2C**: Remove borders from split elements (workspace-split, sidebars, ribbon)
- **2D**: Remove borders from leaf elements (workspace-leaf, workspace-leaf-content)
- **2E**: Resize handle styling (hidden by default, accent color on hover)

**Critical Note**: Group 2F (universal selector removing borders from all descendants) was removed because it was too aggressive and broke checkboxes and tag pills. **Never use universal selectors like `*:not(...)` that remove box-shadows or borders from all descendants.**

#### Group 3: macOS-Specific Fixes (Lines 125-155)
- Remove top border on macOS (title bar integration)
- Title bar positioning and z-index fixes
- Right sidebar toggle button background fix

#### Group 4: Background Color Matching (Lines 157-222)
- CSS variable for sidebar background (`--enhanced-border-sidebar-bg`)
- Tab header container background matching
- Workspace-split background matching
- Right sidebar background matching (to match left sidebar)
- macOS-specific background adjustments

#### Group 5: Tab Positioning and Styling (Not yet implemented)
- Tab container positioning adjustments
- Active/inactive tab border styling
- Tab curve and margin adjustments
- Borders-on and borders-none reset rules

### Key Implementation Details

1. **Border-radius inheritance**: Child elements inherit border-radius from `workspace-tab-container` to ensure rounded corners work properly

2. **Overflow visible**: Changed from `overflow: hidden` to `overflow: visible` to prevent clipping of metadata elements (checkboxes, pills, etc.) while still allowing border-radius to work

3. **Background color matching**: The feature uses CSS variables (`--enhanced-border-sidebar-bg`, `--enhanced-border-right-sidebar-bg`) to capture and restore background colors before theme overrides apply

4. **macOS title bar integration**: Special handling for macOS frameless windows where the title bar is integrated into the tab area

5. **Colorful frame compatibility**: All background color rules exclude `.colorful-frame` to let the theme handle it

### Important Warnings

- **Never use universal selectors** (`*:not(...)`) that remove box-shadows or borders from all descendants - this breaks checkboxes and tag pills
- **Always test after adding border rules** - border rules can easily create double-border effects or break visual elements
- **Respect overflow: visible** - Changing to `overflow: hidden` will clip metadata elements
- **Test on macOS** - macOS has special title bar integration that requires specific handling

## Development Notes

- This theme is a fork of Minimal, so when Minimal updates, consider syncing relevant improvements
- The companion plugin (obsidian-oxygen-settings) is developed alongside this theme
- SCSS files are organized by component (app, color-schemes, components, content, features, plugins, etc.)
- Build process uses Grunt to compile SCSS to CSS
- The `.agents` folder structure is designed to be reusable across projects
- When syncing updates from reference repos, only general `.agents` files are updated; `project-context.md` is preserved

---

## Quick Start

**All general-purpose agent instructions are located in the [`.agents`](.agents/) directory**.

**Quick Commands**: See [quick-reference.md](.agents/quick-reference.md#quick-commands) for one-word commands like `build`, `sync`, `release ready?`, `summarize`, `bump the version`, etc. **AI Agents: Execute these commands automatically when users type them** (detailed execution instructions are in the Help sections below).

**New to this project?** Start here:

0. **Set up reference materials**: Check if `.ref` folder exists and has symlinks. If not, run the setup script:
   - **Windows**: `scripts\setup-ref-links.bat`
   - **macOS/Linux**: `./scripts/setup-ref-links.sh`
   - The script will automatically create `../.ref/obsidian-dev/` (if needed), clone the 6 core Obsidian projects (or update them if they already exist), and create symlinks

1. Read the **Project Context** section above for project-specific information and overrides

3. Read [project-overview.md](.agents/project-overview.md) to understand the structure

4. Check [environment.md](.agents/environment.md) for setup requirements

5. Bookmark [quick-reference.md](.agents/quick-reference.md) for common commands

7. Bookmark [quick-reference.md](.agents/quick-reference.md) for common commands

**Note**: For complex projects, see `.agents/.context/` directory (optional advanced feature).

## When to Check .ref Folder Setup

**AI Agents: Only check `.ref` folder setup when user explicitly asks about:**
- "What does the Obsidian API say about X?"
- "Check the latest Obsidian documentation"
- "What's the latest API?"
- "Look up [feature] in the Obsidian docs"
- "What does the Obsidian documentation say?"
- "Check obsidian-api for..."
- Similar explicit requests about API or documentation

**Do NOT check `.ref` automatically for regular coding tasks.** Most users may never need it, and it shouldn't be a barrier to getting work done.

**When triggered:**
1. Check if `.ref/obsidian-api` exists (note: this may be a symlink pointing to a central location)
2. If missing, run setup script: `scripts\setup-ref-links.bat` (Windows) or `./scripts/setup-ref-links.sh` (Unix)
3. If it exists but git commands fail, check if it's a symlink and navigate to the actual target location
4. Then proceed with the API/documentation lookup

**Quick check commands:**
- Windows: `Test-Path .ref/obsidian-api`
- Unix: `test -d .ref/obsidian-api`

## Help: Interactive Guidance

**When the user asks for "help"**:
1. **First, display the Quick Commands table**: Read and show the Quick Commands section from [quick-reference.md](.agents/quick-reference.md#quick-commands) (the table with all one-word commands)
2. **Then, present these additional options** below for more detailed workflows:

**When the user asks for "what's the latest"**, present these options and guide them based on their choice:

---

### Option 0: Check for Updates / "What's the Latest"

**Present this option when**: User explicitly asks "what's the latest", "check for updates", "what does the Obsidian documentation say", or wants to see what's new in reference repos.

**Important**: Updates are **optional**. The reference materials work fine with whatever version was cloned initially. Most users never need to update. This is only for users who want the latest documentation.

**Instructions for AI agent**:
1. **First, ensure `.ref` folder is set up**: Check if `.ref/obsidian-api` exists. If not, run the setup script first (see "When to Check .ref Folder Setup" above).
2. **Determine setup**: Check if `.ref` contains symlinks (see [sync-procedure.md](.agents/sync-procedure.md#step-1-determine-your-ref-setup) for how to check). If symlinks, note the target location (usually `..\.ref\obsidian-dev`).
3. **Check for updates** (read-only, safe):
   - **For core Obsidian projects**: Check `.ref/` root (all 6: obsidian-api, obsidian-sample-plugin, obsidian-developer-docs, obsidian-plugin-docs, obsidian-sample-theme, eslint-plugin)
   - **For project-specific repos**: Check `.ref/plugins/` or `.ref/themes/` (only if documented in this `AGENTS.md`)
4. **Use read-only git commands** (from actual target location if using symlinks):
   ```bash
   # If using symlinks, navigate to central location first (usually ..\.ref\obsidian-dev)
   # If using local clones, use .ref/obsidian-api directly
   cd ../.ref/obsidian-dev/obsidian-api  # or .ref/obsidian-api for local clones
   git fetch
   git log HEAD..origin/main --oneline  # Shows what's new
   ```
5. **Report findings**: Show what's new and ask if they want to pull updates
6. **Never automatically pull** - always ask first (see [agent-dos-donts.md](.agents/agent-dos-donts.md))

**Key files**: [ref-instructions.md](.agents/ref-instructions.md#checking-for-updates-to-reference-repos), [quick-sync-guide.md](.agents/quick-sync-guide.md), [sync-procedure.md](.agents/sync-procedure.md)

---

### Option 1: Sync Reference Documentation

**Present this option when**: User says "sync" or "quick sync" - they want to pull latest changes from all 6 core `.ref` repos.

**Instructions for AI agent** (execute automatically, don't just show commands):
1. **Determine setup**: Check if `.ref` contains symlinks (see [sync-procedure.md](.agents/sync-procedure.md#step-1-determine-your-ref-setup)). This determines where to run git commands.
2. **Execute git pull commands**: Actually run `git pull` for all 6 core repos:
   - Navigate to the actual target location (usually `../.ref/obsidian-dev` if using symlinks)
   - Run `git pull` in each of the 6 repos: obsidian-api, obsidian-sample-plugin, obsidian-developer-docs, obsidian-plugin-docs, obsidian-sample-theme, eslint-plugin
   - See [quick-sync-guide.md](.agents/quick-sync-guide.md) for exact commands
3. **Review changes**: Check git logs to see what changed in each repo (optional, but helpful)
4. **Update `.agents/` files**: If user wants, compare changes and update relevant files (optional)
5. **Update sync status**: Update `.agents/sync-status.json` with current date

**The 6 core Obsidian projects** (always relevant):
- obsidian-api
- obsidian-sample-plugin
- obsidian-developer-docs
- obsidian-plugin-docs
- obsidian-sample-theme
- eslint-plugin

**Key files**: [sync-procedure.md](.agents/sync-procedure.md), [quick-sync-guide.md](.agents/quick-sync-guide.md)

---

### Option 2: Add a Project to Your References

**Present this option when**: User says "add ref [name]" or "add ref [name] [URL/path]" - they want to reference another project.

**Instructions for AI agent** (execute automatically, don't just show commands):
1. **Parse the command**: Extract the name and optional URL/path from user input
   - If URL provided (starts with `http://`, `https://`, `git@`, etc.) → External repository
   - If path provided (starts with `../`, `./`, `/`, `C:\`, etc.) → Local project
   - If only name provided → Ask user: "Is this an external repository (GitHub, GitLab, etc.) or a local project path?"
   
2. **If external repository** (execute these steps):
   - **Determine type**: Is it a plugin, theme, or other project? (infer from URL or ask)
   - **Check if already exists**: Check `../.ref/obsidian-dev/plugins/<name>/` (for plugins), `../.ref/obsidian-dev/themes/<name>/` (for themes), or `../.ref/obsidian-dev/<name>/` (for other projects)
   - **Execute clone command** (NOT into a `.ref` subfolder!):
     - For plugins: Run `cd ../.ref/obsidian-dev/plugins && git clone <URL> <name>` → Creates `../.ref/obsidian-dev/plugins/<name>/` (the actual repo)
     - For themes: Run `cd ../.ref/obsidian-dev/themes && git clone <URL> <name>` → Creates `../.ref/obsidian-dev/themes/<name>/` (the actual repo)
     - For other projects: Run `cd ../.ref/obsidian-dev && git clone <URL> <name>` → Creates `../.ref/obsidian-dev/<name>/` (the actual repo)
   - **Execute symlink creation**: Create symlink at `.ref/plugins/<name>/` (or `.ref/themes/<name>/` or `.ref/<name>/`) pointing to the global location
   - **Document if project-specific**: Document in this `AGENTS.md` if it's project-specific
   
   **IMPORTANT**: Clone the repo directly into the target folder (e.g., `../.ref/obsidian-dev/plugins/plugin-name/`), NOT into a `.ref` subfolder. The repo folder name should match the project name.
   
3. **If local project** (execute these steps):
   - **Verify path exists**: Check that the local path exists
   - **Execute symlink creation**: Create symlink directly in project's `.ref/` folder pointing to the local project (e.g., `../my-other-plugin`)
   - **Do NOT** clone to global `.ref/obsidian-dev/` - this is project-specific
   - Document in this `AGENTS.md` if relevant

4. **Verify**: Check that the symlink was created and works (test by listing directory or reading a file)

**Key file**: [ref-instructions.md](.agents/ref-instructions.md) - See "Adding Additional References" section

---

### Option 3: Bump the Version

**Present this option when**: User says "bump the version", "bump version", or similar - they want to increment the version number.

**Instructions for AI agent** (execute automatically, don't just show commands):
1. **Parse the command**: Extract the version increment type from user input
   - If no type specified → Default to `patch` (bumps by 0.0.1)
   - If user specifies `patch`, `minor`, or `major` → Use that type
   - If user specifies an exact version (e.g., "1.2.3") → Use that version
   
2. **Execute version bump**:
   - Run `npm version <type>` where `<type>` is one of:
     - `patch` (default) - bumps patch version: 1.0.0 → 1.0.1
     - `minor` - bumps minor version: 1.0.0 → 1.1.0
     - `major` - bumps major version: 1.0.0 → 2.0.0
     - Or exact version: `1.2.3` (sets to that version)
   - The `npm version` command automatically:
     - Updates `package.json` version
     - Runs the `version` script in `package.json` (which updates `manifest.json` and `versions.json` via `version-bump.mjs`)
     - Stages `manifest.json` and `versions.json` for commit
   
3. **Verify**: Check that both `package.json` and `manifest.json` have the new version

**Examples**:
- `bump the version` → Runs `npm version patch` (default: 0.0.1 increment)
- `bump version minor` → Runs `npm version minor`
- `bump version major` → Runs `npm version major`
- `bump version 1.2.3` → Runs `npm version 1.2.3`

**Key files**: [versioning-releases.md](.agents/versioning-releases.md), `package.json`, `manifest.json`, `version-bump.mjs`

---

### Option 4: Start a New Theme Project

**Present this option when**: User wants to create a new Obsidian theme.

**Instructions for AI agent** - Follow this funnel:

1. **Theme Funnel** - Ask these questions in order:
   - "What visual style are you aiming for?" (color scheme, typography, layout)
   - "Will it support both light and dark modes?" → Point to CSS variable usage
   - "Are there specific UI elements you want to customize?" (editor, sidebar, status bar, etc.)
   - "Do you want to include theme snippets?" → Point to file structure in [file-conventions.md](.agents/file-conventions.md)

2. **After gathering answers**, guide them to:
   - [project-overview.md](.agents/project-overview.md) - Project structure
   - [environment.md](.agents/environment.md) - Setup and tooling
   - [file-conventions.md](.agents/file-conventions.md) - File organization
   - [references.md](.agents/references.md) - Official documentation links
   - **Set up `.ref` folder**: Run the setup script (`scripts/setup-ref-links.bat` or `.sh`) to configure reference materials

**Key files**: [project-overview.md](.agents/project-overview.md), [references.md](.agents/references.md), [ref-instructions.md](.agents/ref-instructions.md)

## Static vs. Project-Specific Files

**General `.agents` files** (most files in the `.agents/` directory):
- Are synced from reference repos (Sample Plugin, API, etc.)
- Should remain static and not be edited directly in theme projects
- Provide general-purpose guidance for all Obsidian plugins/themes
- Can be updated by syncing from reference repositories

**Project-specific files**:
- **This `AGENTS.md` file** - Contains project-specific information and overrides (replaces the old `project-context.md`)
  - Contains project overview, specific details, maintenance tasks, and conventions
  - Can override general `.agents` guidance when project-specific needs differ
  - Is preserved when syncing updates from reference repos
- **`.agents/.context/` directory** - Optional advanced feature for complex projects
  - Use when you need project-specific versions of multiple `.agents` files
  - Only create files that differ from general guidance
  - Structure mirrors `.agents/` directory (e.g., `.context/build-workflow.md`, `.context/code-patterns.md`)
  - Entry point: `.agents/.context/AGENTS.md` (if it exists)

**Precedence**: When conflicts exist, project-specific files take precedence over general guidance.

## How to Use This Documentation

This documentation is organized into topic-based files in the `.agents/` directory. Most files are **general-purpose** and apply to all Obsidian plugins/themes. Some files are **project-specific** and can override general guidance.

**Key concepts**:
- **General files**: Synced from official Obsidian repos, provide standard guidance
- **Project-specific files**: This `AGENTS.md` file (and optional `.agents/.context/` directory) contain project-specific information
- **Precedence**: Project-specific files override general guidance when conflicts exist
- **`.ref` folder**: Contains symlinks to reference materials (not actual files). See [ref-instructions.md](.agents/ref-instructions.md) for details.
- **`.agents/` folder**: Contains general-purpose guidance files for Obsidian plugin and theme development

**Quick Links by Task**:
- **Starting a new project** → [project-overview.md](.agents/project-overview.md), [environment.md](.agents/environment.md), [file-conventions.md](.agents/file-conventions.md)
- **Making code changes** → [build-workflow.md](.agents/build-workflow.md) (run build after changes if using build tools!)
- **Preparing for release** → [versioning-releases.md](.agents/versioning-releases.md), [testing.md](.agents/testing.md)
- **Troubleshooting** → [troubleshooting.md](.agents/troubleshooting.md), [build-workflow.md](.agents/build-workflow.md)
- **Quick reference** → [quick-reference.md](.agents/quick-reference.md) (one-page cheat sheet)

## Navigation

**When to use each file**:
- **Starting a new project** → See Quick Start above
- **Need to understand project structure** → [project-overview.md](.agents/project-overview.md)
- **Setting up development environment** → [environment.md](.agents/environment.md)
- **Troubleshooting issues** → [troubleshooting.md](.agents/troubleshooting.md)
- **Need a quick command reference** → [quick-reference.md](.agents/quick-reference.md)
- **Working with `.ref` folder** → [ref-instructions.md](.agents/ref-instructions.md)

### Project-Specific
- **This `AGENTS.md` file** - Project-specific information and overrides (simple, recommended)
- **`.agents/.context/` directory** - Optional project-specific structure for complex projects (advanced)

### Core Development
- **[project-overview.md](.agents/project-overview.md)** - Project structure, entry points, and artifacts (Theme)
- **[environment.md](.agents/environment.md)** - Development environment and tooling (Theme)
- **[file-conventions.md](.agents/file-conventions.md)** - File organization and folder structure (Theme)

### Configuration
- **[manifest.md](.agents/manifest.md)** - `manifest.json` rules and requirements (Theme)
- **[versioning-releases.md](.agents/versioning-releases.md)** - Versioning and GitHub release workflow (Both)

### Best Practices
- **[security-privacy.md](.agents/security-privacy.md)** - Security, privacy, and compliance guidelines (Both)
- **[ux-copy.md](.agents/ux-copy.md)** - UX guidelines and UI text conventions (Both)
- **[performance.md](.agents/performance.md)** - Performance optimization best practices (Both)
- **[mobile.md](.agents/mobile.md)** - Mobile compatibility considerations (Both)

### Development Workflow
- **[build-workflow.md](.agents/build-workflow.md)** - Build commands to run after changes (if using build tools) (Theme)
- **[testing.md](.agents/testing.md)** - Testing and manual installation procedures (Theme)
- **[troubleshooting.md](.agents/troubleshooting.md)** - Common issues, error messages, and debugging techniques (Both)
- **[quick-reference.md](.agents/quick-reference.md)** - One-page cheat sheet for common tasks and commands (Both)
- **[agent-dos-donts.md](.agents/agent-dos-donts.md)** - Specific do's and don'ts for AI agents (Both)
- **[summarize-commands.md](.agents/summarize-commands.md)** - How to generate commit messages and release notes

### Reference Materials
- **[references.md](.agents/references.md)** - External links and resources
- **[ref-instructions.md](.agents/ref-instructions.md)** - Instructions for using the `.ref` folder
- **[sync-procedure.md](.agents/sync-procedure.md)** - Procedure for syncing content from Sample Plugin and API
- **[sync-status.json](.agents/sync-status.json)** - Central tracking of sync dates and status
- **[quick-sync-guide.md](.agents/quick-sync-guide.md)** - Quick reference for pulling updates from reference repos

## Important: .ref Folder

The `.ref` folder contains **symlinks** to reference materials (not actual files). It's gitignored and acts as a "portal" to other locations on the computer.

**For AI Agents**:
- **Only when user explicitly asks about API/docs**: Check if `.ref/obsidian-api` exists. If not, run the setup script to create it (see "When to Check .ref Folder Setup" above)
- **When asked to reference something**: Actively search for it using `list_dir`, `glob_file_search`, or `read_file`
- **When adding references**: 
  - External repos → Clone to `../.ref/obsidian-dev/` (global), then symlink in project's `.ref/`
  - Local projects → Symlink directly in project's `.ref/` (don't clone to global)
- **The `.ref` folder may be hidden** by default in file explorers, but it exists in the project root

**Setup**: The setup scripts (`scripts/setup-ref-links.*`) automatically:
1. Create `../.ref/` if it doesn't exist
2. Create `../.ref/obsidian-dev/` subfolder if it doesn't exist
3. Clone the 6 core Obsidian projects to `../.ref/obsidian-dev/` if they don't exist, or pull latest changes if they do exist
4. Create `../.ref/obsidian-dev/plugins/` and `../.ref/obsidian-dev/themes/` folders
5. Create symlinks in the project's `.ref/` folder pointing to `../.ref/obsidian-dev/`

**Philosophy**: It "just works" out of the box. The reference materials are cloned once and work indefinitely. The setup scripts automatically update repos when run, so you can keep them up to date by simply re-running the setup script. Updates are optional and only needed if you want the latest documentation. Most users never update, and that's perfectly fine.

See [ref-instructions.md](.agents/ref-instructions.md) for complete details.

## Important: .agents Folder

The `.agents/` directory contains general-purpose guidance files for Obsidian plugin and theme development. This directory structure provides:

- **Reusable guidance**: General `.agents` files provide standard guidance for all Obsidian plugins/themes
- **Project-specific content**: This `AGENTS.md` file remains project-specific and contains project-specific information
- **Easy maintenance**: Files can be updated by syncing from reference repositories

**Note**: The `.agents/` folder may be hidden by default in some file explorers, but it exists in the project root.

## Source Attribution

Each file in `.agents` includes a header comment with:
- Source(s) of the information
- Last sync date (for reference; see [sync-status.json](.agents/sync-status.json) for authoritative dates)
- Update frequency guidance

**Central Sync Tracking**: All sync dates are tracked centrally in [sync-status.json](.agents/sync-status.json). When syncing content, update this file with the actual current date (never use placeholder dates).

## Updating Content

Content in the `.agents/` directory is based on:
- **Obsidian API** (`.ref/obsidian-api/obsidian.d.ts`) - **Authoritative source** for all API information
- Obsidian Sample Plugin repository - Implementation patterns and best practices
- Obsidian Sample Theme repository - Theme patterns
- Obsidian Plugin Docs and Developer Docs - General guidance (may be outdated, always verify against API)
- Community best practices

**Important**: The `obsidian-api` repository is the authoritative source. When information conflicts between API and documentation, the API takes precedence. Always check `.ref/obsidian-api/obsidian.d.ts` first, especially for new features (e.g., `SettingGroup` since 1.11.0).

Check the source attribution in each file header for update frequency guidance. When the Obsidian Sample Plugin, Sample Theme, or API documentation is updated, relevant files here should be reviewed and updated accordingly.

**See [sync-procedure.md](.agents/sync-procedure.md) for the standard procedure to sync content from the latest Sample Plugin, Sample Theme, and API updates.**

## General Purpose / Reusable

The `.agents` directory structure and content is designed to be **general-purpose and reusable** across Obsidian plugin and theme projects. The content is based on official Obsidian repositories and documentation, not project-specific code. You can:

- Copy this structure to other Obsidian projects
- Use it as a template for new projects
- Share it with other developers
- Adapt it for your specific needs

The only project-specific content is in:
- This `AGENTS.md` file - Project-specific information and overrides (maintained by developer)
- `.agents/.context/` directory - Optional project-specific structure for complex projects (if it exists)
- `ref-instructions.md` - OS-agnostic setup instructions that may need path adjustments

Everything else syncs from official Obsidian sources.

## Troubleshooting

**If `.ref` folder is missing or empty**:
- Run the setup script: `scripts\setup-ref-links.bat` (Windows) or `./scripts/setup-ref-links.sh` (macOS/Linux)
- The script will automatically set everything up

**If `.agents` folder is missing**:
- The `.agents/` folder should exist in the project root
- If it's missing, it may need to be created or restored from the project template

**If symlinks are broken**:
- Re-run the appropriate setup script - it will recreate the symlinks

**If you can't find a reference**:
- Check [ref-instructions.md](.agents/ref-instructions.md) for organization
- Check this `AGENTS.md` file for project-specific references
- Use `list_dir` or `glob_file_search` to search `.ref/` folder

**If build fails** (if using build tools):
- See [build-workflow.md](.agents/build-workflow.md) for build commands
- See [troubleshooting.md](.agents/troubleshooting.md) for common issues
