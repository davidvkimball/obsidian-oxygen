# Oxygen Theme - Architecture Guide for AI Agents

## Overview

The Oxygen Theme is a fork of the Minimal Theme with a custom Oxygen color scheme as the default. This document explains the architecture and how it differs from the original Minimal Theme to help AI agents understand the codebase structure.

## Architecture

### Base Theme Structure

```
Base .theme-dark = Oxygen dark colors (default)
Base .theme-light = Oxygen light colors (default)
├── Default (no scheme) = Oxygen colors (same as base)
├── Oxygen scheme = Oxygen colors (same as base) 
├── Minimal scheme = Overrides with Minimal colors
├── Atom scheme = Overrides with Atom colors
└── All other schemes = Override with their colors
```

### Key Files

- **`src/scss/variables/dynamic-color.scss`**: Contains the base Oxygen theme colors for both light and dark modes
  - **Dark mode**: Lines 159-201 (`.theme-dark` class)
  - **Light mode**: Lines 54-98 (`.theme-light` class)
- **`src/scss/color-schemes/oxygen.scss`**: Contains only Oxygen-specific overrides
- **`src/scss/color-schemes/minimal.scss`**: Contains complete Minimal color scheme for both light and dark modes
- **`src/scss/color-schemes/[other].scss`**: Contains other color schemes (Atom, Things, etc.)

## Differences from Original Minimal Theme

### Original Minimal Theme
- **Base `.theme-dark`**: Uses HSL calculations (generic, not hard-coded)
- **Base `.theme-light`**: Uses HSL calculations (generic, not hard-coded)
- **Default**: The base theme IS the "Minimal" theme (HSL-calculated)
- **Color Schemes**: Each overrides the base with specific values
- **No separate "minimal" color scheme file** - the default IS minimal

### Oxygen Theme
- **Base `.theme-dark`**: Uses Oxygen's hard-coded dark colors (not HSL calculations)
- **Base `.theme-light`**: Uses Oxygen's hard-coded light colors (not HSL calculations)
- **Default**: Uses Oxygen colors (not minimal)
- **Color Schemes**: Each overrides the base with specific values
- **Separate "minimal" color scheme file** - minimal is now a selectable scheme

## Color Scheme Isolation

### Self-Contained Color Schemes
All color schemes (Atom, Things, Minimal, etc.) are completely self-contained:
- They define their own `--base-h`, `--base-s`, `--base-l` values
- They define their own complete color sets (`--bg1`, `--bg2`, `--ui1`, etc.)
- They are **identical** to the original Minimal theme's color schemes
- **No cross-contamination** with the Oxygen base theme

### Plugin Independence
- **Style Settings plugin disabled**: Uses base Oxygen colors
- **Style Settings plugin enabled**: Uses base Oxygen colors (same result)
- **Color scheme selected**: Overrides base with scheme-specific colors

## Style Settings Plugin Integration

### Overview
The Oxygen Theme now provides **full compatibility** with the Style Settings plugin through a hybrid architecture that maintains both custom Oxygen variables and Obsidian native variables.

### Architecture Layers

```
1. Style Settings User Customizations (Highest Priority)
   ↓
2. Obsidian Native Variables (Mapped from Oxygen variables)
   ↓  
3. Oxygen Custom Variables (Internal theme logic)
   ↓
4. Base Oxygen Colors (Fallback)
```

### How It Works

#### 1. Dual Variable System
- **Oxygen Variables**: Internal theme logic uses `--bg1`, `--tx1`, `--ax1`, etc.
- **Obsidian Native Variables**: Exposed to Style Settings via `--background-primary`, `--text-normal`, etc.
- **Automatic Mapping**: Oxygen variables are automatically mapped to Obsidian native variables

#### 2. Style Settings Integration
- **`src/css/style-settings.css`**: Exposes Obsidian native variables to Style Settings
- **`src/scss/variables/dynamic-color.scss`**: Contains the mapping layer (lines 412-490)
- **User Customization**: Users modify Obsidian native variables through Style Settings UI
- **Real-time Updates**: Changes are applied immediately and persist across sessions

#### 3. CSS Cascade Priority
1. **User Customizations**: Style Settings overrides (highest priority)
2. **Obsidian Native Variables**: Mapped from Oxygen variables
3. **Oxygen Custom Variables**: Internal theme logic
4. **Base Oxygen Colors**: Fallback values

### Variable Mapping

The theme automatically maps between variable systems:

| Obsidian Native | Oxygen Custom | Purpose |
|----------------|---------------|---------|
| `--background-primary` | `--bg1` | Main background |
| `--background-secondary` | `--bg2` | Secondary background |
| `--text-normal` | `--tx1` | Primary text |
| `--text-muted` | `--tx2` | Secondary text |
| `--text-accent` | `--ax1` | Links and accents |
| `--background-modifier-border` | `--ui1` | Borders and dividers |

### Benefits

1. **Full Style Settings Compatibility**: Works with all Style Settings features
2. **Plugin Compatibility**: Other plugins can use Obsidian native variables
3. **Maintained Architecture**: Internal Oxygen logic remains unchanged
4. **User-Friendly**: Users get familiar Style Settings interface
5. **Future-Proof**: Compatible with Obsidian updates and new plugins

### Creating Custom Color Schemes

Users can now create custom color schemes using:

1. **Style Settings UI**: Visual interface for all Obsidian native variables
2. **CSS Snippets**: Override either Obsidian native or Oxygen custom variables
3. **Export/Import**: Share color schemes via Style Settings functionality

### Style Settings Configuration

The theme exposes these Obsidian native variables for customization:
- **Background colors**: `--background-primary`, `--background-secondary`, etc.
- **Text colors**: `--text-normal`, `--text-muted`, `--text-accent`, etc.
- **Interactive colors**: `--interactive-normal`, `--interactive-hover`, etc.
- **Border colors**: `--background-modifier-border`, `--divider-color`, etc.
- **Scrollbar colors**: `--scrollbar-bg`, `--scrollbar-thumb-bg`, etc.

## Maintenance Guidelines

### For Oxygen Color Changes
**ALWAYS use this prompt for DARK MODE:**
```
I want to modify the base Oxygen color scheme. Please update the Oxygen colors in the base theme (src/scss/variables/dynamic-color.scss) in the .theme-dark class (lines 159-201). Do NOT modify any overrides in src/scss/color-schemes/oxygen.scss - I want the base Oxygen colors to work natively with Obsidian regardless of plugin state.
```

**ALWAYS use this prompt for LIGHT MODE:**
```
I want to modify the base Oxygen color scheme. Please update the Oxygen colors in the base theme (src/scss/variables/dynamic-color.scss) in the .theme-light class (lines 54-98). Do NOT modify any overrides in src/scss/color-schemes/oxygen.scss - I want the base Oxygen colors to work natively with Obsidian regardless of plugin state.
```

**For BOTH light and dark mode changes:**
```
I want to modify the base Oxygen color scheme for both light and dark modes. Please update the Oxygen colors in the base theme (src/scss/variables/dynamic-color.scss) in both the .theme-light class (lines 54-98) and .theme-dark class (lines 159-201). Do NOT modify any overrides in src/scss/color-schemes/oxygen.scss - I want the base Oxygen colors to work natively with Obsidian regardless of plugin state.
```

### For Style Settings Integration
**When adding new Obsidian native variables:**
1. Add the variable mapping in `src/scss/variables/dynamic-color.scss` (lines 425-472)
2. Add the Style Settings configuration in `src/css/style-settings.css`
3. Ensure the mapping uses appropriate Oxygen custom variables as sources

**When modifying existing variables:**
- **Oxygen variables**: Modify in the base theme sections (lines 54-98 for light, 159-201 for dark)
- **Obsidian native variables**: The mapping layer will automatically update
- **Style Settings defaults**: Update in `src/css/style-settings.css` if needed

### Single Source of Truth
- **Oxygen dark colors**: Defined in `src/scss/variables/dynamic-color.scss` (lines 159-201)
- **Oxygen light colors**: Defined in `src/scss/variables/dynamic-color.scss` (lines 54-98)
- **Variable mapping**: Defined in `src/scss/variables/dynamic-color.scss` (lines 425-472)
- **Style Settings config**: Defined in `src/css/style-settings.css`
- **Oxygen overrides**: Only in `src/scss/color-schemes/oxygen.scss` (minimal overrides)
- **Other schemes**: Each has complete definitions in their respective files

### What NOT to Do
- ❌ Don't modify Oxygen colors in `oxygen.scss` (only overrides go there)
- ❌ Don't use Oxygen colors as a base for other schemes
- ❌ Don't duplicate Oxygen colors in multiple places
- ❌ Don't modify the base `.theme-dark` or `.theme-light` to use HSL calculations (breaks Oxygen default)
- ❌ Don't use aggressive `!important` overrides - let CSS cascade work naturally
- ❌ Don't modify the variable mapping layer unless you understand the full architecture
- ❌ Don't break the CSS cascade hierarchy: User Customizations > Obsidian Native > Oxygen Custom > Base Colors
- ❌ Don't modify `src/css/style-settings.css` unless adding new Style Settings options

## Build Process

```bash
# Compile SCSS to CSS
npx grunt sass

# Minify CSS
npx grunt cssmin
```

## Color Scheme Files

| File | Purpose | Contains |
|------|---------|----------|
| `oxygen.scss` | Oxygen overrides only | Right sidebar overrides for both light and dark |
| `minimal.scss` | Complete Minimal scheme | All Minimal colors + overrides for both light and dark |
| `atom.scss` | Complete Atom scheme | All Atom colors for both light and dark |
| `things.scss` | Complete Things scheme | All Things colors for both light and dark |
| `[other].scss` | Other schemes | Complete color definitions for both light and dark |
| `style-settings.css` | Style Settings config | User customization interface configuration |

## Key Principles

1. **Oxygen is the default**: Base theme uses Oxygen colors for both light and dark modes
2. **Other schemes are isolated**: Each scheme is self-contained
3. **No cross-contamination**: Schemes don't inherit from each other
4. **Plugin independence**: Colors work with or without Style Settings
5. **Single source of truth**: Oxygen colors defined in one place only
6. **Clean architecture**: No aggressive overrides or `!important` spam
7. **User customization support**: Style Settings integration enables easy custom color schemes
8. **CSS cascade respect**: User customizations > Color schemes > Base colors

## Troubleshooting

### Colors change when toggling Style Settings plugin
- **Cause**: Oxygen colors not properly defined in base theme
- **Fix**: Ensure all Oxygen colors are in `src/scss/variables/dynamic-color.scss` (lines 54-98 for light, 159-201 for dark)

### Color schemes look different from original Minimal
- **Cause**: Scheme not properly isolated from Oxygen base
- **Fix**: Ensure scheme has complete color definitions (not relying on base)

### Duplicate color definitions
- **Cause**: Colors defined in multiple places
- **Fix**: Use single source of truth - base theme for Oxygen, individual files for other schemes

### Right sidebar background wrong in color schemes
- **Cause**: Missing `--background-secondary` override
- **Fix**: Add specific override like `.theme-light.minimal-minimal-light .mod-right-split { --background-secondary: white; }`

### Custom color schemes not working
- **Cause**: Style Settings plugin not installed or enabled
- **Fix**: Install and enable the Style Settings plugin, then access via command palette

### User customizations not persisting
- **Cause**: Style Settings configuration issues or CSS conflicts
- **Fix**: Check that `src/css/style-settings.css` is properly configured and not overridden by other CSS
