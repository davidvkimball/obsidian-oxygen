# Oxygen Theme for Obsidian

A fork of [Minimal](https://github.com/kepano/obsidian-minimal) with a custom Oxygen color scheme as the default. Oxygen extends Minimal's excellent foundation with enhanced color scheme management and custom preset functionality.

## What Makes Oxygen Different

- **Custom default color scheme**: Oxygen's carefully crafted color palette replaces Minimal's default colors
- **Advanced custom presets**: Create, import, and share custom color schemes with an intuitive interface
- **Seamless Minimal access**: Switch to the original Minimal color scheme anytime via color scheme selector
- **Enhanced theme management**: Import colors from any Obsidian theme automatically
- **Full Style Settings integration**: Deep customization support for creating your own color schemes

For general features and documentation, see [minimal.guide](https://minimal.guide).

## Installation

**Install using BRAT**

Oxygen is not yet available in the Community Themes section. Install using [BRAT](https://github.com/TfTHacker/obsidian42-brat):

1. Install the BRAT plugin from Community Plugins
2. Open BRAT settings (Settings → BRAT)
3. Click "Add Beta Theme" and enter: `https://github.com/david/obsidian-oxygen`
4. Go to `Appearance` settings and select "Oxygen" from the theme dropdown

**Install the Companion Plugin** (Recommended)

The Oxygen Theme Settings plugin is also not yet in Community Plugins. Install via BRAT:

1. In BRAT settings, click "Add Beta plugin"
2. Enter: `https://github.com/david/obsidian-oxygen-settings`
3. Enable the plugin in Settings → Community Plugins

## Companion Plugins

- [Oxygen Theme Settings](https://github.com/david/obsidian-oxygen-settings) - Recommended for accessing color schemes, custom presets, and theme features. Includes advanced color management functionality.
- [Style Settings](https://github.com/mgmeyers/obsidian-style-settings) - Optional. Create custom color schemes through a visual interface with full variable customization.
- [Hider](https://github.com/kepano/obsidian-hider) - Optional. Hide UI elements like window frame, scrollbars, and tooltips.

For general features like focus mode, image grids, helper classes, alternate checkboxes, and more, see the [Minimal documentation](https://minimal.guide).

## Color Schemes

Oxygen offers the same color schemes as Minimal, with Oxygen as the default instead. Switch between schemes using [Oxygen Theme Settings](https://github.com/david/obsidian-oxygen-settings).

**Built-in schemes:** Oxygen (default), Minimal (original), Atom, Ayu, Catppuccin, Dracula, Eink, Everforest, Flexoki, Gruvbox, macOS, Nord, Rose Pine, Sky, Solarized, and Things.

All schemes can be separately selected for light and dark mode.

## Custom Presets

Oxygen's custom preset functionality extends beyond Minimal's capabilities:

- **Create custom color schemes** with an intuitive color picker interface
- **Import any Obsidian theme** and extract its color palette automatically
- **Export and share** presets as JSON or CSS files
- **Smart color mapping** that automatically detects light/dark mode colors
- **Live preview** of changes as you design

Access custom presets through the "Custom Presets" tab in Oxygen Theme Settings. See `CUSTOM_PRESET_GUIDE.md` for detailed documentation.

### Using Style Settings

For even deeper customization, use the [Style Settings plugin](https://github.com/mgmeyers/obsidian-style-settings) to modify individual CSS variables. This gives you granular control over colors, fonts, sizes, and spacing.

## Developers

**Build Setup**

```bash
sudo gem install sass
npm install -g grunt-cli
npm install
```

**Local Development**

Rename `.env.example` to `.env` and update `OBSIDIAN_PATH` to your vault's theme folder for live reload.

```bash
npx grunt
```

This creates `obsidian.css` (minified, for distribution) and `Oxygen.css` (unminified, for development).

## License

Oxygen is licensed under the MIT License. You may modify and redistribute the code, but must preserve the copyright and license notice in your CSS file.

**If you distribute a fork of Oxygen, please keep [@kepano](https://github.com/kepano)'s [Buy me a coffee](https://www.buymeacoffee.com/kepano) link from Minimal in your README.**

Oxygen is based on the Minimal theme and is regularly updated to stay current with Obsidian releases. To stay up-to-date with improvements, consider using [GitHub's fork feature](https://docs.github.com/en/get-started/quickstart/fork-a-repo) to merge updates into your fork.

## Disclaimer

This theme is provided as-is. It modifies significant parts of the Obsidian interface and may break with future Obsidian updates or conflict with custom CSS snippets.
