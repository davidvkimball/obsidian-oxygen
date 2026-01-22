---
name: project
description: Project-specific architecture, maintenance tasks, and unique conventions for this repository. Load when performing project-wide maintenance or working with the core architecture.
---

# Project Context

This skill provides the unique context and architectural details for the **Obsidian Sample Theme Plus** repository.

## Purpose

To provide guidance on project-specific structures and tasks that differ from general Obsidian theme development patterns.

## When to Use

Load this skill when:
- Understanding the repository's unique architecture.
- Performing recurring maintenance tasks.
- Following project-specific coding conventions.

## Project Overview

- **Architecture**: Single `theme.css` file in the root directory.
- **Reference Management**: Uses a `.ref` folder with symlinks to centralized Obsidian repositories for documentation.

## Maintenance Tasks

- **Sync References**: Run the setup scripts (`scripts/setup-ref-links.*`) to update symlinks to the 6 core Obsidian projects.
- **Update Skills**: Use `node scripts/update-agents.mjs "Description"` after syncing or updating reference materials.

## Project-Specific Conventions

- **Clean CSS**: Maintain organized CSS sections for different UI elements (Editor, UI, Sidebar, etc.).
- **Variables**: Favor using Obsidian's internal CSS variables for better compatibility across updates.
