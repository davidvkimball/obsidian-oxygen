# Oxygen Theme - Architecture Guide for AI Agents

## Overview

The Oxygen Theme is a fork of the Minimal Theme with a custom Oxygen color scheme as the default. This document explains the architecture and how it differs from the original Minimal Theme to help AI agents understand the codebase structure.

## Oxygen Theme vs. Oxygen Theme Settings Plugin

### Understanding the Relationship

**The Oxygen Theme** and **the Oxygen Theme Settings Plugin** are two separate but complementary components:

#### Oxygen Theme (This Repository)
- **What it is**: The CSS theme file itself (`Oxygen.css`, `theme.css`)
- **What it contains**: 
  - Base Oxygen color definitions (hard-coded in SCSS)
  - All built-in color scheme definitions (Minimal, Atom, Ayu, etc.)
  - All feature styles (focus mode, colorful headings, etc.)
  - Layout and typography styles
  - Style Settings plugin integration
- **How it works**: Compiled from SCSS source files into CSS that Obsidian loads as a theme
- **Location**: This repository (`obsidian-oxygen`)

#### Oxygen Theme Settings Plugin (Separate Repository)
- **What it is**: A companion Obsidian plugin that manages theme settings
- **What it does**:
  - Applies color scheme classes to the `body` element (e.g., `minimal-oxygen-dark`, `minimal-minimal-light`)
  - Manages custom color presets (injects CSS custom properties)
  - Controls theme features (fonts, widths, focus mode, etc.)
  - Provides hotkeys for quick theme adjustments
  - Syncs settings between light/dark modes
- **How it works**: 
  - Adds/removes CSS classes on `body` to activate color schemes
  - Injects CSS custom properties for custom presets
  - Modifies existing CSS variables for features
- **Location**: Separate repository (`.oxygen-settings-reference/` folder contains a reference copy)

### How They Work Together

```
┌─────────────────────────────────────────────────────────────┐
│                    Obsidian Application                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐    ┌──────────────────────────┐ │
│  │  Oxygen Theme        │    │  Oxygen Theme Settings   │ │
│  │  (CSS File)          │    │  Plugin                   │ │
│  │                      │    │                           │ │
│  │  • Base colors       │◄───┤  • Applies scheme classes │ │
│  │  • Color schemes     │    │  • Manages custom presets │ │
│  │  • Feature styles    │    │  • Controls features      │ │
│  │  • Layout styles     │    │  • Provides hotkeys       │ │
│  └──────────────────────┘    └──────────────────────────┘ │
│           │                              │                  │
│           └──────────────┬───────────────┘                  │
│                          │                                   │
│                          ▼                                   │
│              ┌─────────────────────┐                         │
│              │   <body> element    │                         │
│              │                     │                         │
│              │ Classes:            │                         │
│              │ • theme-dark        │                         │
│              │ • minimal-oxygen-*  │                         │
│              │                     │                         │
│              │ CSS Variables:      │                         │
│              │ • --bg1, --tx1, etc.│                         │
│              └─────────────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### Key Distinctions

1. **Color Schemes**: 
   - **Defined in Theme**: All built-in color schemes (Oxygen, Minimal, Atom, etc.) are defined in `src/scss/color-schemes/*.scss`
   - **Activated by Plugin**: The plugin adds classes like `minimal-oxygen-dark` or `minimal-minimal-light` to activate schemes

2. **Custom Presets**:
   - **Created in Plugin**: Users create custom presets through the plugin's UI
   - **Injected by Plugin**: The plugin injects CSS custom properties directly onto the `body` element
   - **Not in Theme Files**: Custom presets are NOT stored in the theme's SCSS files

3. **Base Theme Colors**:
   - **Defined in Theme**: Base Oxygen colors are in `src/scss/variables/dynamic-color.scss`
   - **Modified in Theme**: To change base colors, edit the SCSS source files and rebuild
   - **Not Modified by Plugin**: The plugin doesn't change base theme colors (only applies schemes/presets)

4. **Features**:
   - **Styles in Theme**: Feature CSS (focus mode, colorful headings, workspace borders, etc.) is in `src/scss/features/*.scss`
   - **Implemented in Theme**: The theme provides the actual CSS implementation for all features
   - **Toggled by Plugin**: The plugin adds/removes classes to enable/disable features
   - **Plugin Overrides**: The plugin may provide additional CSS overrides in its own `styles.css` for advanced features
   - **Theme Provides Defaults**: The theme implements features for the base Oxygen theme (and potentially other color schemes)
   - **Plugin Handles Settings**: The plugin manages user settings, toggles classes, and provides UI controls

### Division of Responsibilities: Theme vs. Plugin

**CRITICAL**: Understanding what belongs in the theme vs. the plugin is essential:

#### Theme Responsibilities (CSS Implementation)
- ✅ **Implement all feature CSS** in `src/scss/features/*.scss`
- ✅ **Provide base implementations** for the default Oxygen theme
- ✅ **May provide implementations** for other color schemes if needed
- ✅ **Define default CSS variables** (e.g., `--nav-indentation-guide-width: 1px`)
- ✅ **Style Settings integration** - Only for features that are part of the original Minimal theme

#### Plugin Responsibilities (Settings & Control)
- ✅ **Manage user settings** (store, load, save)
- ✅ **Provide UI controls** (settings panels, toggles, dropdowns)
- ✅ **Toggle CSS classes** on `body` element (e.g., `borders-none`, `workspace-borders-enhanced`)
- ✅ **Set CSS variables** when user changes settings (e.g., `--nav-indentation-guide-width`)
- ✅ **Provide advanced overrides** in plugin's `styles.css` for complex features
- ✅ **Handle feature interactions** (e.g., enhanced borders requiring keep-tab-borders)

#### What NOT to Do
- ❌ **Don't add new features to Style Settings** - Only Minimal theme features belong there
- ❌ **Don't implement features only in plugin** - Theme must provide base implementation
- ❌ **Don't remove feature CSS from theme** - Plugin toggles classes, theme provides styles
- ❌ **Don't duplicate implementations** - Theme provides base, plugin may enhance/override

#### Example: Workspace Borders Feature
- **Theme**: Implements `borders-none` class behavior, `keep-tab-borders` styling, `workspace-borders-enhanced` styling in `src/scss/features/borders.scss`
- **Plugin**: Toggles `borders-none`, `keep-tab-borders`, `workspace-borders-enhanced` classes based on user settings
- **Plugin**: May provide additional CSS overrides in `styles.css` for advanced behavior
- **Style Settings**: NOT added here (not part of original Minimal theme)

### When to Modify What

| What to Change | Where to Modify | How |
|----------------|-----------------|-----|
| **Base Oxygen colors** | `src/scss/variables/dynamic-color.scss` | Edit SCSS, rebuild with `npx grunt build` |
| **Base fonts/sizes** | `src/scss/variables/root.scss` or `theme.scss` | Edit SCSS, rebuild |
| **Feature styles** | `src/scss/features/*.scss` | Edit SCSS, rebuild - **Theme implements features, plugin toggles them** |
| **Layout styles** | `src/scss/app/*.scss` | Edit SCSS, rebuild |
| **Built-in color schemes** | `src/scss/color-schemes/*.scss` | Edit SCSS, rebuild - **May need feature implementations for each scheme** |
| **Custom presets** | Plugin UI (not in theme files) | Use plugin settings |
| **Which scheme is active** | Plugin settings | User selects in plugin UI |
| **Feature toggles** | Plugin settings | User toggles in plugin UI |
| **New feature settings** | Plugin code + Theme CSS | Add CSS in theme, add settings in plugin |

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
  - **Light mode base**: Lines 54-98 (`.theme-light` class)
  - **Dark mode base**: Lines 224-266 (`.theme-dark` class)
  - **Oxygen variants**: Lines 158-203 (`.minimal-oxygen-dark.minimal-dark-black`, `.minimal-oxygen-dark.minimal-dark-tonal`, etc.)
  - **Variable mapping layer**: Lines 412-490 (maps Oxygen vars → Obsidian native vars)
- **`src/scss/color-schemes/oxygen.scss`**: Intentionally empty - Oxygen is the base theme, not an override
- **`src/scss/color-schemes/minimal.scss`**: Contains complete Minimal color scheme for both light and dark modes
- **`src/scss/color-schemes/[other].scss`**: Contains other color schemes (Atom, Things, etc.)
- **`src/css/style-settings.css`**: Style Settings plugin configuration and UI definitions

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

**Note**: This section refers to the **Style Settings plugin** (a different plugin from Oxygen Theme Settings).

- **Style Settings plugin disabled**: Uses base Oxygen colors
- **Style Settings plugin enabled**: Uses base Oxygen colors (same result)
- **Color scheme selected**: Overrides base with scheme-specific colors

**Oxygen Theme Settings plugin** is required for:
- Selecting and switching between color schemes
- Managing custom color presets
- Controlling theme features (fonts, widths, focus mode, etc.)
- Providing hotkeys for theme adjustments

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

## Why We Don't Modify `oxygen.scss`

### Understanding Oxygen's Architecture

**The base Oxygen colors live in `dynamic-color.scss`, NOT in `oxygen.scss`.**

Here's why this architecture exists:

### 1. Oxygen is the Default Theme
- When you install the Oxygen Theme, it's the **default** theme
- The base `.theme-light` and `.theme-dark` classes (in `dynamic-color.scss`) define Oxygen's colors
- This ensures Oxygen works perfectly **without any color scheme selected**
- Other themes (Minimal, Atom, etc.) are **alternatives** that override the Oxygen base

### 2. What `oxygen.scss` Actually Contains

The `oxygen.scss` file is **intentionally empty** (contains only comments):

```css
/*
Oxygen is the BASE theme, not an override.
All Oxygen styling comes from the base .theme-light and .theme-dark classes.
*/
```

This emphasizes that Oxygen doesn't override anything - it IS the foundation that other schemes override.

### 3. Why `oxygen.scss` is Empty

Oxygen is the **base theme**, not a color scheme override. This means:
- ❌ NO color definitions needed (they're in the base `.theme-light`/`.theme-dark`)
- ❌ NO UI overrides needed (global features handle everything)
- ✅ Oxygen works automatically as the foundation
- ✅ Other schemes override Oxygen by defining their own complete color sets

### 4. The Correct Approach

**To change Oxygen colors:**
1. ✅ Modify `dynamic-color.scss` lines 54-98 (light) or 224-266 (dark)
2. ✅ Colors automatically propagate through the mapping layer
3. ✅ Works with or without Style Settings plugin
4. ✅ No duplication, single source of truth

**If you were to modify `oxygen.scss` with colors:**
1. ❌ Creates duplicate color definitions
2. ❌ Breaks the "Oxygen is the base" principle
3. ❌ Colors may not work without explicitly selecting "Oxygen" scheme
4. ❌ Violates single source of truth principle

### 5. Should You Ever Modify `oxygen.scss`?

**Short answer: No.** 

Oxygen is the base theme. If you need to change Oxygen's appearance:
- ✅ **Colors**: Modify the base `.theme-light` or `.theme-dark` classes
- ✅ **Layout/Features**: Add to global feature files (not color scheme files)
- ❌ **Never** add anything to `oxygen.scss` - it should remain empty

The file exists only for organizational consistency with other color schemes.

## Modifying the Base Theme

### Understanding Base Theme vs. Color Schemes

**CRITICAL DISTINCTION**: The "base theme" refers to the default Oxygen colors that appear when no color scheme is selected. Color schemes (Minimal, Atom, etc.) are **overrides** that replace the base colors.

### What is the Base Theme?

The base theme consists of:
- **Base Oxygen colors** (defined in `src/scss/variables/dynamic-color.scss`)
- **Default fonts and typography** (defined in `src/scss/variables/root.scss` and `theme.scss`)
- **Feature styles** (defined in `src/scss/features/*.scss`)
- **Layout styles** (defined in `src/scss/app/*.scss`)

### How to Modify Base Theme Colors

**To change the base Oxygen color scheme** (the default colors users see):

1. **Edit the base color definitions** in `src/scss/variables/dynamic-color.scss`:
   - **Light mode**: Lines 54-98 (`.theme-light` class)
   - **Dark mode**: Lines 224-266 (`.theme-dark` class)

2. **Check for additional CSS rules** that may need updates:
   - Light mode tab containers: around lines 100-105
   - Dark mode tab containers: around lines 278-283
   - These may need to reference specific variables for certain UI elements

3. **Rebuild the theme**:
   ```bash
   npx grunt build
   ```

4. **Verify changes** appear in `Oxygen.css` (not just `src/css/main.css`)

**Important Notes**:
- ❌ **DO NOT** modify `src/scss/color-schemes/oxygen.scss` - it's intentionally empty
- ❌ **DO NOT** modify other color scheme files (minimal.scss, atom.scss, etc.) when updating base colors
- ✅ Changes to base colors affect the default appearance when no scheme is selected
- ✅ Color schemes will continue to override base colors when selected

### How to Modify Base Fonts and Typography

**To change default fonts, sizes, or typography**:

1. **Edit font variables** in `src/scss/variables/root.scss`:
   - Font families: `--font-editor`, `--font-text`, `--font-ui`
   - Font sizes: `--font-text-size`, `--font-ui-small`, etc.

2. **Edit typography settings** in `src/scss/variables/theme.scss`:
   - Heading sizes: `--h1-size`, `--h2-size`, etc.
   - Line height: `--line-height`
   - Spacing: `--p-spacing`, `--heading-spacing`

3. **Rebuild the theme**:
   ```bash
   npx grunt build
   ```

**Note**: The Oxygen Theme Settings plugin can override these with user settings, but the base values come from the theme files.

### How to Modify Feature Styles

**To change how features look** (focus mode, colorful headings, workspace borders, etc.):

1. **Edit feature files** in `src/scss/features/*.scss`:
   - Focus mode: `src/scss/features/focus-mode.scss`
   - Colorful headings: `src/scss/features/colorful-headings.scss`
   - Active line: `src/scss/features/active-line.scss`
   - Workspace borders: `src/scss/features/borders.scss`
   - etc.

2. **Rebuild the theme**:
   ```bash
   npx grunt build
   ```

**Important Notes**:
- **Theme Implements Features**: The theme provides the actual CSS implementation for all features
- **Plugin Toggles Features**: The plugin adds/removes CSS classes to enable/disable features
- **Plugin May Override**: The plugin's `styles.css` may provide additional overrides for advanced features
- **Base Theme First**: Implement features in the base Oxygen theme (and potentially other color schemes if needed)
- **Plugin Handles Settings**: The plugin manages user settings, UI controls, and class toggling
- **Style Settings**: Only add features to `style-settings.css` if they're part of the original Minimal theme

### How to Modify Layout Styles

**To change layout, spacing, or UI structure**:

1. **Edit app files** in `src/scss/app/*.scss`:
   - Workspace: `src/scss/app/workspace.scss`
   - Editor: `src/scss/app/editor.scss`
   - Tabs: `src/scss/app/tab-stacks.scss`
   - etc.

2. **Rebuild the theme**:
   ```bash
   npx grunt build
   ```

### Summary: Base Theme Modification Workflow

```
1. Identify what to change:
   ├─ Colors → src/scss/variables/dynamic-color.scss
   ├─ Fonts → src/scss/variables/root.scss
   ├─ Typography → src/scss/variables/theme.scss
   ├─ Features → src/scss/features/*.scss
   └─ Layout → src/scss/app/*.scss

2. Edit the appropriate SCSS file(s)

3. Rebuild:
   npx grunt build

4. Verify:
   - Check Oxygen.css for changes
   - Test in Obsidian with no color scheme selected
   - Ensure color schemes still work correctly
```

### Common Pitfalls

❌ **Don't confuse base theme with color schemes**:
- Base theme = default Oxygen colors (in `dynamic-color.scss`)
- Color schemes = overrides (in `color-schemes/*.scss`)

❌ **Don't modify `oxygen.scss`**:
- It's intentionally empty - Oxygen is the base, not an override

❌ **Don't assume changes in `src/css/main.css` are final**:
- Always check `Oxygen.css` after building
- The build process concatenates multiple files

❌ **Don't forget to rebuild**:
- SCSS changes require `npx grunt build` to take effect
- Development watch (`npx grunt`) only updates `src/css/main.css`, not final theme files

## Maintenance Guidelines

### For Oxygen Color Changes

**Understanding the Architecture:**
- Base color VALUES are defined in `.theme-light` (lines 54-98) and `.theme-dark` (lines 224-266)
- Additional CSS RULES may be needed to apply those colors to specific UI elements
- Global feature files (in `src/scss/features/` and `src/scss/app/`) use CSS variables
- Sometimes you need to override which variable is used in specific contexts

**What to Modify:**
1. **Color values** in the base theme classes (lines 54-98 for light, 224-266 for dark)
2. **CSS rules** that apply those colors to specific elements (e.g., lines 100-105 for light tab containers, 278-283 for dark tab containers)
3. **Build command**: Use `npx grunt build` (for production) or `npx grunt` (for fast dev watch)

### 🚨 CRITICAL: NEVER Hard-Code Accent Colors 🚨

**THIS IS EXTREMELY IMPORTANT - READ CAREFULLY:**

The Oxygen theme uses an HSL-based accent color system that:
- ✅ Respects Obsidian's accent color settings
- ✅ Allows theme features like "Colorful headings" to work
- ✅ Enables users to customize accent colors
- ✅ Properly calculates text-on-accent contrast

**❌ NEVER DO THIS - WILL BREAK THE THEME:**
```scss
/* WRONG - Hard-coded hex values break Obsidian's accent system */
--ax1: #2c7aaa;
--ax2: #246290;
--ax3: #3894c4;
```

**✅ ALWAYS DO THIS - HSL calculations:**
```scss
/* CORRECT - HSL calculations respect Obsidian's accent system */
--ax1: hsl(var(--accent-h), var(--accent-s), var(--accent-l));
--ax2: hsl(var(--accent-h), var(--accent-s), calc(var(--accent-l) - 8%));
--ax3: hsl(var(--accent-h), var(--accent-s), calc(var(--accent-l) + 6%));
```

**To change the DEFAULT accent color:**
1. ✅ Modify the BASE accent HSL values in the `body` selector (lines 24-27):
   ```scss
   --accent-h: 201;   /* Hue (0-360): 0=red, 120=green, 240=blue */
   --accent-s: 59%;   /* Saturation (0-100%): 0=gray, 100=vibrant */
   --accent-l: 42%;   /* Lightness (0-100%): 0=black, 50=pure, 100=white */
   ```
2. ✅ The HSL calculations in `.theme-light` and `.theme-dark` will automatically use these values
3. ✅ All accent-based features (headings, buttons, links) will update automatically

**Why this matters:**
- Hard-coding hex values breaks Obsidian's accent color picker
- It breaks theme features like colorful headings
- It causes incorrect text contrast on buttons
- Users lose the ability to customize accent colors
- The theme becomes disconnected from Obsidian's native settings

**If you accidentally hard-code accent colors:**
1. Immediately revert to HSL calculations
2. Update only the base `--accent-h`, `--accent-s`, `--accent-l` values
3. Rebuild and verify all accent-based features work

**ALWAYS use this prompt for DARK MODE:**
```
I want to modify the base Oxygen color scheme in DARK MODE. Please:
1. Update the Oxygen color values in src/scss/variables/dynamic-color.scss in the .theme-dark class (lines 224-269)
2. Check if any additional CSS rules are needed to apply these colors to specific UI elements (like tab containers around lines 278-283)
3. Do NOT modify src/scss/color-schemes/oxygen.scss - it should remain empty
4. Do NOT modify any other color scheme files (minimal.scss, atom.scss, etc.)
5. Build with: npx grunt build
6. Verify changes appear in Oxygen.css, NOT just in src/css/main.css

Make sure the changes ONLY affect the base Oxygen theme and do not interfere with other color schemes like Minimal, Atom, Things, etc.
```

**ALWAYS use this prompt for LIGHT MODE:**
```
I want to modify the base Oxygen color scheme in LIGHT MODE. Please:
1. Update the Oxygen color values in src/scss/variables/dynamic-color.scss in the .theme-light class (lines 54-98)
2. Check if any additional CSS rules are needed to apply these colors to specific UI elements (like tab containers around lines 100-105)
3. Do NOT modify src/scss/color-schemes/oxygen.scss - it should remain empty
4. Do NOT modify any other color scheme files (minimal.scss, atom.scss, etc.)
5. Build with: npx grunt build
6. Verify changes appear in Oxygen.css, NOT just in src/css/main.css

Make sure the changes ONLY affect the base Oxygen theme and do not interfere with other color schemes like Minimal, Atom, Things, etc.
```

**For BOTH light and dark mode changes:**
```
I want to modify the base Oxygen color scheme for BOTH light and dark modes. Please:
1. Update the Oxygen color values in src/scss/variables/dynamic-color.scss:
   - Light mode: .theme-light class (lines 54-98)
   - Dark mode: .theme-dark class (lines 224-269)
2. Check if any additional CSS rules are needed to apply these colors to specific UI elements:
   - Light mode tab containers: around lines 100-105
   - Dark mode tab containers: around lines 278-283
3. Do NOT modify src/scss/color-schemes/oxygen.scss - it should remain empty
4. Do NOT modify any other color scheme files (minimal.scss, atom.scss, etc.)
5. Build with: npx grunt build
6. Verify changes appear in Oxygen.css, NOT just in src/css/main.css

Make sure the changes ONLY affect the base Oxygen theme and do not interfere with other color schemes like Minimal, Atom, Things, etc.
```

### Example: Updating Accent Color in Dark Mode

Here's a concrete example of how to update the cyan accent color in dark mode:

**Prompt:**
```
I want to modify the base Oxygen color scheme in DARK MODE. Please:
1. Update the accent color in src/scss/variables/dynamic-color.scss in the .theme-dark class:
   - Change --ax1 from #3d9db5 to #4ac9e3 (brighter cyan)
   - Change --ax2 from #2e7a8f to #38a3b8 (brighter hover state)
   - Keep --ax3 as is
2. Check if any additional CSS rules are needed (they shouldn't be for accent colors)
3. Do NOT modify src/scss/color-schemes/oxygen.scss - it should remain empty
4. Do NOT modify any other color scheme files (minimal.scss, atom.scss, etc.)
5. Build with: npx grunt build
6. Verify changes appear in Oxygen.css by checking for the new hex values

Make sure the changes ONLY affect the base Oxygen theme and do not interfere with other color schemes.
```

**What this will do:**
- Updates the cyan accent used for links, active states, and interactive elements
- Only affects dark mode
- Leaves light mode untouched
- Doesn't affect Minimal, Atom, or other color schemes
- Properly builds and concatenates into final theme files

### For Style Settings Integration
**When adding new Obsidian native variables:**
1. Add the variable mapping in `src/scss/variables/dynamic-color.scss` (lines 425-472)
2. Add the Style Settings configuration in `src/css/style-settings.css`
3. Ensure the mapping uses appropriate Oxygen custom variables as sources

**When modifying existing variables:**
- **Oxygen variables**: Modify in the base theme sections (lines 54-98 for light, 224-266 for dark)
- **Obsidian native variables**: The mapping layer will automatically update
- **Style Settings defaults**: Update in `src/css/style-settings.css` if needed

### Single Source of Truth
- **Oxygen light colors**: Defined in `src/scss/variables/dynamic-color.scss` (lines 54-98)
- **Oxygen dark colors**: Defined in `src/scss/variables/dynamic-color.scss` (lines 224-266)
- **Oxygen style variants**: Defined in `src/scss/variables/dynamic-color.scss` (lines 158-203) - tonal, true black, contrast modes
- **Variable mapping**: Defined in `src/scss/variables/dynamic-color.scss` (lines 412-490)
- **Style Settings config**: Defined in `src/css/style-settings.css`
- **Oxygen scheme file**: `src/scss/color-schemes/oxygen.scss` (intentionally empty - Oxygen is base, not override)
- **Other schemes**: Each has complete definitions in their respective files

### What NOT to Do
- ❌ Don't modify `oxygen.scss` at all - it's intentionally empty (Oxygen is the base theme, not an override)
- ❌ Don't duplicate Oxygen colors in multiple files (single source of truth: lines 54-98 light, 224-269 dark)
- ❌ Don't use Oxygen colors as a base for other schemes (each scheme is self-contained)
- ❌ **NEVER hard-code accent colors with hex values** - ALWAYS use HSL calculations (`hsl(var(--accent-h), var(--accent-s), var(--accent-l))`)
- ❌ **NEVER replace `--ax1`, `--ax2`, `--ax3` with hex values** - this breaks Obsidian's accent system, colorful headings, and button text contrast
- ❌ Don't use aggressive `!important` overrides - let CSS cascade work naturally
- ❌ Don't modify the variable mapping layer (lines 412-490) unless adding new mappings
- ❌ Don't break the CSS cascade hierarchy: User Customizations > Obsidian Native > Oxygen Custom > Base Colors
- ❌ Don't modify `src/css/style-settings.css` unless adding new Style Settings options
- ❌ Don't run build tasks separately - always use: `npx grunt build` (production) or `npx grunt` (dev watch)
- ❌ Don't assume color changes in `src/css/main.css` mean they're in the final theme - always check `Oxygen.css`
- ❌ Don't modify other color scheme files (minimal.scss, atom.scss, etc.) when updating Oxygen

## Build Process

```bash
# Fast development watch (unminified only, auto-reloads in vault)
npx grunt

# Full production build (compiles SCSS, minifies, and concatenates)
npx grunt build

# Note: Development watch is optimized for speed:
# - Only compiles unminified CSS (src/css/main.css)
# - Only concatenates Oxygen.css (unminified dev version)
# - Skips minification and theme.css generation
# - ~50% faster on each file save

# Production build creates both versions:
# - sass:unminified: Compiles SCSS to unminified CSS (src/css/main.css)
# - sass:dist: Compiles SCSS to minified CSS (src/css/main.min.css)
# - cssmin: Further minifies the output
# - concat_css: Concatenates into theme.css (minified) and Oxygen.css (unminified)
```

## Color Scheme Files

| File | Purpose | Contains |
|------|---------|----------|
| `dynamic-color.scss` | Base Oxygen theme | All Oxygen base colors (lines 54-98 light, 224-266 dark), variants (158-203), and mapping layer (412-490) |
| `oxygen.scss` | Oxygen scheme file | Intentionally empty - Oxygen is the base theme, not an override |
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
9. **Theme Implements, Plugin Controls**: The theme provides CSS implementations for features; the plugin toggles classes and manages settings
10. **Style Settings for Minimal Only**: Only add features to `style-settings.css` if they're part of the original Minimal theme; new features should only be in the plugin

## Troubleshooting

### Colors change when toggling Style Settings plugin
- **Cause**: Oxygen colors not properly defined in base theme
- **Fix**: Ensure all Oxygen colors are in `src/scss/variables/dynamic-color.scss` (lines 54-98 for light, 224-266 for dark)

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

### Tab containers or UI elements not showing new colors
- **Cause**: Global feature files use CSS variables, and you need to override which variable is used in specific contexts
- **Fix**: Check if additional CSS rules are needed (e.g., `.theme-dark .mod-left-split .mod-top .workspace-tab-header-container { --background-secondary: var(--bg-tab); }`)
- **Example**: If top bars aren't showing `--bg-tab`, you may need to tell the specific element to use that variable instead of `--background-secondary`

### Changes appear in src/css/main.css but not in Oxygen.css
- **Cause**: Forgot to run the concatenation step
- **Fix**: Always use the complete build command: `npx grunt build` (or `npx grunt` for dev watch)
