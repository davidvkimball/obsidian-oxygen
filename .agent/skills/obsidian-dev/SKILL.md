---
name: obsidian-dev
description: CSS/SCSS development patterns, styling conventions, and theme-specific coding rules. Load when working with theme.css, SCSS variables, or CSS selectors.
---

# Obsidian Theme Development Skill

This skill provides patterns and rules for developing Obsidian themes, focusing on CSS/SCSS development, styling conventions, and theme-specific coding practices.

## Purpose

To ensure consistent theme development, proper CSS organization, and adherence to Obsidian's theming patterns and CSS variable usage.

## When to Use

Load this skill when:
- Writing or modifying CSS/SCSS for `theme.css`
- Working with Obsidian's CSS variables and theming system
- Implementing responsive design or dark/light mode support
- Debugging CSS layout or styling issues
- Following CSS/SCSS coding conventions

## Core Rules

- **Use Obsidian CSS Variables**: Always prefer Obsidian's built-in CSS variables (like `--background-primary`, `--text-normal`) over hardcoded colors/values for better compatibility.
- **Follow BEM Methodology**: Use Block-Element-Modifier naming convention for CSS classes to avoid conflicts and improve maintainability.
- **Mobile-First**: Consider mobile layouts and use responsive design patterns.
- **Dark/Light Mode Support**: Always test themes in both light and dark modes.
- **Performance**: Minimize CSS complexity and avoid expensive selectors.

## Bundled Resources

- `references/agent-dos-donts.md`: Critical do's and don'ts for theme development.
- `references/project-overview.md`: Theme project structure and organization.
- `references/environment.md`: Development environment setup for themes.

## Theme Development Best Practices

### CSS Organization
- Group related styles together (Editor, UI, Sidebar, etc.)
- Use comments to separate major sections
- Keep specificity low to allow for easy customization

### Obsidian CSS Variables
```css
/* Always use Obsidian's variables */
.theme-dark {
  --my-accent: var(--interactive-accent);
  background-color: var(--background-primary);
  color: var(--text-normal);
}
```

### Responsive Design
```css
/* Mobile-first approach */
.my-component {
  width: 100%;
}

@media (min-width: 768px) {
  .my-component {
    width: 50%;
  }
}
```

### Dark/Light Mode Support
```css
/* Automatic dark/light mode support */
.theme-dark .my-element {
  background: var(--background-primary);
}

.theme-light .my-element {
  background: var(--background-secondary);
}
```