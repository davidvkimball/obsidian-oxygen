---
name: project
description: Project-specific architecture, maintenance tasks, and unique conventions for the Oxygen Theme.
---

# Oxygen Theme Project Skill

Oxygen is a modular, high-performance theme for Obsidian with deep customization capabilities. It is designed for visual clarity and provides extensive Style Settings support.

## Core Architecture

- **Modular CSS**: Separated into `theme.css` (primary) and `Oxygen.css` (modular components).
- **Variable-First Design**: Heavily dependent on CSS variables for customization, allowing for deep integration with the Oxygen Settings plugin.
- **Build System**: Uses `Gruntfile.cjs` for managing CSS compilation or asset tasks.

## Project-Specific Conventions

- **Visual Clarity**: Prioritizes typography and spatial organization.
- **Scaleable Components**: All CSS components should follow modular patterns for easier maintenance.
- **Style Settings**: Designed to be the source of truth for "vibrant" and "premium" aesthetics as described in the master design principles.

## Key Files

- `theme.css`: The primary theme file containing core layout and basic styling.
- `Oxygen.css`: Large modular CSS payload containing advanced components and visual enhancements.
- `manifest.json`: Theme identification and version management.
- `Gruntfile.cjs`: Automation tasks for theme development.

## Maintenance Tasks

- **Variable Drift**: Monitor Obsidian's internal CSS variable updates and adjust theme overrides accordingly.
- **Mobile Audit**: Test the modular components (Oxygen.css) across various device sizes.
- **Build Check**: Ensure Grunt tasks remain functional for bundling/minifying theme assets.
