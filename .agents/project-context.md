<!--
Source: Project-specific (not synced from reference repos)
Last updated: [Maintain manually - this file is project-specific]
Applicability: Theme

IMPORTANT: This file contains project-specific information and can override
general guidance in other .agents files. When syncing updates from reference
repos, this file is preserved and not overwritten.
-->

# Project Context: Oxygen Theme

## Project Overview

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

## Development Notes

- This theme is a fork of Minimal, so when Minimal updates, consider syncing relevant improvements
- The companion plugin (obsidian-oxygen-settings) is developed alongside this theme
- SCSS files are organized by component (app, color-schemes, components, content, features, plugins, etc.)
- Build process uses Grunt to compile SCSS to CSS
- The `.agents` folder structure is designed to be reusable across projects
- When syncing updates from reference repos, only general `.agents` files are updated; `project-context.md` is preserved

### When to Consider Using `.agents/.context/` Directory

If your project needs project-specific versions of multiple `.agents` files (e.g., custom `build-workflow.md`, `code-patterns.md`, etc.), consider creating a `.agents/.context/` directory structure. This advanced feature is optional and only needed for complex projects. See `AGENTS.md` for details on the `.context/` directory structure.

