# Custom Preset Plugin - Implementation Guide

## Overview

This guide explains how to structure custom preset CSS to ensure full compatibility with all Oxygen Theme features, including "Colorful frame", "Colorful headings", and "Colorful active states".

## Required CSS Structure

### Minimal Custom Preset (Dark Mode Example)

```css
.theme-dark.oxygen-custom-{preset-id} {
  /* === BASE HSL VALUES (Required for colorful-frame and colorful-headings) === */
  --base-h: 210;      /* Base hue (0-360) - overall theme temperature */
  --base-s: 15%;      /* Base saturation (0-100%) */
  --base-l: 20%;      /* Base lightness for dark mode (15-25% typical) */
  
  --accent-h: 200;    /* Accent hue (0-360) - main accent color */
  --accent-s: 60%;    /* Accent saturation (0-100%) */
  --accent-l: 50%;    /* Accent lightness (40-60% typical) */
  
  /* === OXYGEN CUSTOM VARIABLES (Core theme colors) === */
  /* Backgrounds */
  --bg1: #1f2228;     /* Main content background */
  --bg2: #1f2228;     /* Sidebar background */
  --bg-tab: #1f2228;  /* Top bar background */
  --bg3: rgba(255, 255, 255, 0.12);  /* Hover/interactive background */
  
  /* UI Elements */
  --ui1: #3a3d41;     /* Borders, dividers, buttons */
  --ui2: #434f5b;     /* Hover states */
  --ui3: #4a5568;     /* Active states, shadows */
  
  /* Text Colors */
  --tx1: #dcddde;     /* Primary text */
  --tx2: #999999;     /* Secondary text */
  --tx3: #666666;     /* Tertiary text / subtle */
  --tx4: #aaaaaa;     /* Quaternary text */
  
  /* Accent Colors */
  --ax1: #0d6efd;     /* Primary accent (links, buttons) */
  --ax2: #3d8bfd;     /* Lighter accent (hover) */
  --ax3: #0b5ed7;     /* Darker accent */
  
  /* Highlights */
  --hl1: rgba(13, 110, 253, 0.3);    /* Text selection */
  --hl2: rgba(255, 225, 0, 0.5);     /* Active highlight */
  
  /* Special */
  --sp1: white;       /* Text on accent backgrounds */
  
  /* IMPORTANT: Do NOT set Obsidian native variables here! */
  /* IMPORTANT: Do NOT use !important flags! */
}
```

### Light Mode Example

```css
.theme-light.oxygen-custom-{preset-id} {
  /* === BASE HSL VALUES === */
  --base-h: 210;
  --base-s: 15%;
  --base-l: 98%;      /* Light mode uses high lightness (95-100%) */
  
  --accent-h: 200;
  --accent-s: 60%;
  --accent-l: 50%;
  
  /* === OXYGEN CUSTOM VARIABLES === */
  --bg1: #ffffff;
  --bg2: #ffffff;
  --bg-tab: #ffffff;
  --bg3: rgba(0, 0, 0, 0.12);
  
  --ui1: #e9ecef;
  --ui2: #dee2e6;
  --ui3: #ced4da;
  
  --tx1: #212529;
  --tx2: #6c757d;
  --tx3: #adb5bd;
  --tx4: #495057;
  
  --ax1: #0d6efd;
  --ax2: #0b5ed7;
  --ax3: #3d8bfd;
  
  --hl1: rgba(13, 110, 253, 0.3);
  --hl2: rgba(255, 225, 0, 0.5);
  
  --sp1: white;
}
```

## Hex to HSL Conversion Utility

Use this JavaScript function to convert hex colors to HSL values:

```javascript
/**
 * Converts a hex color to HSL values
 * @param {string} hex - Hex color (e.g., "#0d6efd" or "0d6efd")
 * @returns {object} - { h: number (0-360), s: number (0-100), l: number (0-100) }
 */
function hexToHSL(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;
  
  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Example usage:
 */
const accentColor = hexToHSL('#0d6efd');
console.log(accentColor);
// Output: { h: 211, s: 98, l: 53 }

// Generate CSS:
const css = `
  --accent-h: ${accentColor.h};
  --accent-s: ${accentColor.s}%;
  --accent-l: ${accentColor.l}%;
`;
```

## Complete CSS Generation Example

```javascript
/**
 * Generates complete custom preset CSS
 * @param {string} presetId - Unique preset ID
 * @param {object} colors - Object with hex colors
 * @returns {string} - Complete CSS string
 */
function generatePresetCSS(presetId, colors) {
  const {
    bg1, bg2, bg3,
    ui1, ui2, ui3,
    tx1, tx2, tx3, tx4,
    ax1, ax2, ax3,
    hl1, hl2,
    sp1
  } = colors;
  
  // Convert accent color to HSL for colorful features
  const accentHSL = hexToHSL(ax1);
  
  // Estimate base color from bg1
  const baseHSL = hexToHSL(bg1);
  
  return `.theme-dark.oxygen-custom-${presetId} {
  /* Base HSL values */
  --base-h: ${baseHSL.h};
  --base-s: ${baseHSL.s}%;
  --base-l: ${baseHSL.l}%;
  
  --accent-h: ${accentHSL.h};
  --accent-s: ${accentHSL.s}%;
  --accent-l: ${accentHSL.l}%;
  
  /* Oxygen custom variables */
  --bg1: ${bg1};
  --bg2: ${bg2};
  --bg-tab: ${bg2};
  --bg3: ${bg3};
  
  --ui1: ${ui1};
  --ui2: ${ui2};
  --ui3: ${ui3};
  
  --tx1: ${tx1};
  --tx2: ${tx2};
  --tx3: ${tx3};
  --tx4: ${tx4};
  
  --ax1: ${ax1};
  --ax2: ${ax2};
  --ax3: ${ax3};
  
  --hl1: ${hl1};
  --hl2: ${hl2};
  
  --sp1: ${sp1};
}`;
}

// Example usage:
const presetCSS = generatePresetCSS('midnight-blue', {
  bg1: '#1a1d24',
  bg2: '#15171d',
  bg3: 'rgba(255, 255, 255, 0.12)',
  ui1: '#2a2d35',
  ui2: '#353842',
  ui3: '#40444f',
  tx1: '#e3e4e6',
  tx2: '#b0b3ba',
  tx3: '#7a7d85',
  tx4: '#a0a3aa',
  ax1: '#4a9eff',
  ax2: '#6fb1ff',
  ax3: '#2d86e8',
  hl1: 'rgba(74, 158, 255, 0.3)',
  hl2: 'rgba(255, 225, 0, 0.5)',
  sp1: 'white'
});

console.log(presetCSS);
```

## How Features Use These Variables

### 1. Colorful Headings ✅
- **Uses**: `--accent-h`, `--accent-s`, `--accent-l`
- **Behavior**: Generates a rainbow of heading colors offset from the accent hue
- **Example**: If accent is blue (200°), headings will be blue, cyan, green, yellow, orange, red

### 2. Colorful Frame ✅
- **Uses**: `--accent-h`, `--accent-s`, `--accent-l`
- **Behavior**: Creates a colored window frame using accent color variations
- **Example**: Frame background will be derived from accent color with adjusted lightness

### 3. Colorful Active States ✅
- **Uses**: `--ax1` (via `--interactive-accent`) and `--sp1` (via `--text-on-accent`)
- **Behavior**: Active items in navigation use accent color background
- **Example**: Selected file in sidebar gets accent color background

### 4. Style Settings Integration ✅
- **Uses**: All Oxygen custom variables
- **Behavior**: Oxygen variables are mapped to Obsidian native variables
- **Priority**: Style Settings overrides take precedence over preset colors

## Variable Mapping Reference

When custom preset sets Oxygen variables, they automatically map to Obsidian native variables:

| Oxygen Variable | Obsidian Native Variable | Used By |
|-----------------|--------------------------|---------|
| `--bg1` | `--background-primary` | Main content area |
| `--bg2` | `--background-secondary` | Sidebars, panels |
| `--bg3` | `--background-secondary-alt` | Hover states |
| `--ui1` | `--background-modifier-border` | Borders, dividers |
| `--ui2` | `--interactive-hover` | Button hovers |
| `--tx1` | `--text-normal` | Primary text |
| `--tx2` | `--text-muted` | Secondary text |
| `--tx3` | `--text-faint` | Subtle text |
| `--ax1` | `--text-accent`, `--interactive-accent` | Links, buttons |
| `--ax2` | `--text-accent-hover` | Accent hovers |
| `--sp1` | `--text-on-accent` | Text on colored backgrounds |

## Best Practices

### ✅ DO:
- Set Oxygen custom variables (`--bg1`, `--tx1`, `--ax1`, etc.)
- Include HSL values (`--accent-h`, `--base-h`, etc.)
- Use simple selector: `.theme-dark.oxygen-custom-{id}`
- Test with all colorful features enabled
- Ensure sufficient contrast ratios for accessibility

### ❌ DON'T:
- Set Obsidian native variables (`--background-primary`, etc.) - let the mapping handle it
- Use `!important` flags - they block Style Settings
- Use `body` in the selector - unnecessary specificity
- Skip HSL values - colorful features need them
- Hardcode colors in multiple places - use variables

## CSS Injection Method

Inject the generated CSS as a `<style>` tag in the `<head>`:

```javascript
function injectPresetCSS(presetId, cssContent) {
  // Remove existing preset styles
  const existingStyle = document.querySelector('style[data-custom-preset]');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Inject new preset CSS
  const styleEl = document.createElement('style');
  styleEl.setAttribute('data-custom-preset', presetId);
  styleEl.textContent = cssContent;
  document.head.appendChild(styleEl);
}
```

## Testing Checklist

Test your custom preset with:
- [ ] Base theme (no features enabled)
- [ ] Colorful frame enabled
- [ ] Colorful headings enabled
- [ ] Colorful active states enabled
- [ ] Style Settings modifications on top of preset
- [ ] Light mode and dark mode
- [ ] Different contrast settings (if applicable)

## Support

For issues or questions:
1. Check that HSL values are set correctly
2. Verify Oxygen variables are used (not Obsidian native variables)
3. Confirm no `!important` flags are present
4. Test with a minimal preset first, then add complexity

---

**Last Updated**: 2025-10-29  
**Oxygen Theme Version**: Compatible with Oxygen v1.0+

