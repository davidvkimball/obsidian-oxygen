#!/usr/bin/env node

/**
 * Setup Stylelint for Obsidian Theme
 * 
 * This script:
 * - Updates package.json with Stylelint devDependencies and scripts
 * - Generates .stylelintrc.json configuration file
 * - Generates .stylelintignore file
 * - Copies lint-wrapper.mjs for helpful linting success messages
 * 
 * Usage: node scripts/setup-stylelint.mjs
 */

import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const STYLELINT_DEPS = {
	"stylelint": "^15.11.0",
	"stylelint-config-recommended": "^13.0.0",
	"stylelint-no-unsupported-browser-features": "^7.0.0"
};

// Optional dependencies for SCSS themes (version 5.x is compatible with stylelint 15)
const STYLELINT_SCSS_DEP = "stylelint-scss";
const STYLELINT_SCSS_VERSION = "^5.0.0";
const POSTCSS_SCSS_DEP = "postcss-scss";
const POSTCSS_SCSS_VERSION = "^4.0.0";

const STYLELINT_SCRIPTS = {
	"lint": "node scripts/lint-wrapper.mjs",
	"lint:fix": "node scripts/lint-wrapper.mjs --fix"
};

function generateLintWrapper() {
	return `#!/usr/bin/env node

/**
 * Stylelint wrapper that detects theme structure and lints appropriately
 * 
 * Handles two theme patterns:
 * 1. Simple CSS themes: theme.css in root (no build step)
 * 2. Complex themes: SCSS in src/scss/ (with build tools like Grunt)
 */

import { spawn } from 'child_process';
import { existsSync, statSync, readFileSync } from 'fs';
import { join } from 'path';
import process from 'process';

const args = process.argv.slice(2);
const hasFix = args.includes('--fix');

// Detect theme structure
const hasThemeCss = existsSync('theme.css');
const hasScssSource = existsSync('src/scss') && statSync('src/scss').isDirectory();

// Determine what to lint
let filesToLint = [];
let needsScssPlugin = false;

if (hasScssSource) {
	// Complex theme with SCSS source files
	filesToLint.push('src/scss/**/*.scss');
	needsScssPlugin = true;
	
	// Also lint compiled CSS if it exists
	if (hasThemeCss) {
		filesToLint.push('theme.css');
	}
} else if (hasThemeCss) {
	// Simple CSS theme - just lint theme.css
	filesToLint.push('theme.css');
} else {
	console.error('Error: No theme.css or src/scss/ directory found.');
	console.error('Expected either:');
	console.error('  - Simple CSS theme: theme.css in root');
	console.error('  - Complex theme: src/scss/ directory with SCSS files');
	process.exit(1);
}

// Check if SCSS linting dependencies are needed and configured
if (needsScssPlugin) {
	let scssPluginInstalled = false;
	let postcssScssInstalled = false;
	let scssPluginConfigured = false;
	let customSyntaxConfigured = false;
	
	// Check if required packages are installed
	try {
		const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
		const allDeps = {
			...packageJson.dependencies || {},
			...packageJson.devDependencies || {}
		};
		scssPluginInstalled = 'stylelint-scss' in allDeps;
		postcssScssInstalled = 'postcss-scss' in allDeps;
	} catch (error) {
		// If we can't read package.json, continue anyway
	}
	
	// Check if SCSS configuration is set up in .stylelintrc.json
	try {
		if (existsSync('.stylelintrc.json')) {
			const stylelintConfig = JSON.parse(readFileSync('.stylelintrc.json', 'utf8'));
			const plugins = stylelintConfig.plugins || [];
			scssPluginConfigured = Array.isArray(plugins) && plugins.includes('stylelint-scss');
			
			// Check for customSyntax at root level (legacy) or in overrides section (Stylelint v15 best practice)
			customSyntaxConfigured = stylelintConfig.customSyntax === 'postcss-scss';
			if (!customSyntaxConfigured && stylelintConfig.overrides && Array.isArray(stylelintConfig.overrides)) {
				customSyntaxConfigured = stylelintConfig.overrides.some(override => {
					if (override.customSyntax === 'postcss-scss') {
						// Check if files array includes SCSS patterns
						if (override.files && Array.isArray(override.files)) {
							return override.files.some(pattern => 
								typeof pattern === 'string' && (pattern.includes('*.scss') || pattern.includes('**/*.scss') || pattern.includes('scss'))
							);
						}
						// If no files specified, assume it applies to all files (including SCSS)
						return true;
					}
					return false;
				});
			}
		}
	} catch (error) {
		// If we can't read config, continue anyway
	}
	
	// Provide helpful guidance if anything is missing
	if (!scssPluginInstalled || !postcssScssInstalled || !scssPluginConfigured || !customSyntaxConfigured) {
		console.error('\\n⚠ SCSS files detected, but SCSS linting is not properly set up.\\n');
		
		if (!scssPluginInstalled) {
			console.error('Missing: stylelint-scss package');
			console.error('  Install it: npm install --save-dev stylelint-scss@^5.0.0\\n');
		}
		
		if (!postcssScssInstalled) {
			console.error('Missing: postcss-scss package (required for SCSS syntax parsing)');
			console.error('  Install it: npm install --save-dev postcss-scss@^4.0.0\\n');
		}
		
		if (!scssPluginConfigured || !customSyntaxConfigured) {
			console.error('Missing: SCSS configuration in .stylelintrc.json');
			console.error('  Add "stylelint-scss" to the "plugins" array');
			console.error('  Add "customSyntax": "postcss-scss" in an "overrides" section (Stylelint v15 best practice)\\n');
		}
		
		console.error('Example .stylelintrc.json configuration:');
		console.error(JSON.stringify({
			extends: ['stylelint-config-recommended'],
			plugins: ['stylelint-scss', 'stylelint-no-unsupported-browser-features'],
			rules: {
				'at-rule-no-unknown': [true, {
					ignoreAtRules: ['use', 'import', 'mixin', 'include', 'function', 'if', 'else', 'each', 'for', 'while', 'extend']
				}]
			},
			overrides: [{
				files: ['**/*.scss'],
				customSyntax: 'postcss-scss'
			}]
		}, null, 2));
		console.error('');
		console.error('After installing and configuring, run: npm run lint\\n');
		process.exit(1);
	}
}

// Build stylelint command
const stylelintArgs = ['stylelint', ...filesToLint, ...args];

// Run Stylelint
const stylelint = spawn('npx', stylelintArgs, {
	stdio: 'inherit',
	shell: true
});

stylelint.on('close', (code) => {
	if (code === 0) {
		const message = hasFix 
			? '\\n✓ CSS/SCSS linting complete! All issues fixed automatically.\\n'
			: '\\n✓ CSS/SCSS linting passed! No issues found.\\n';
		console.log(message);
		process.exit(0);
	} else {
		// Stylelint already printed errors, just exit with the code
		process.exit(code);
	}
});
`;
}

function generateStylelintConfig(customRules = {}, hasScssFiles = false) {
	// Default configuration for Obsidian themes
	const plugins = ["stylelint-no-unsupported-browser-features"];
	
	const defaultConfig = {
		"extends": ["stylelint-config-recommended"],
		"plugins": plugins,
		"rules": {
			"plugin/no-unsupported-browser-features": [
				true,
				{
					"browsers": ["last 10 Chrome versions", "last 3 iOS versions"],
					"ignore": ["css-masks", "css-selection"],
					"ignorePartialSupport": true
				}
			]
		}
	};
	
	// Add SCSS-specific configuration if SCSS files are detected
	if (hasScssFiles) {
		plugins.unshift("stylelint-scss"); // Add at beginning for better visibility
		// Allow SCSS-specific at-rules
		defaultConfig.rules["at-rule-no-unknown"] = [
			true,
			{
				"ignoreAtRules": [
					"use",
					"import",
					"forward",
					"mixin",
					"include",
					"function",
					"return",
					"if",
					"else",
					"each",
					"for",
					"while",
					"extend",
					"warn",
					"error",
					"debug",
					"at-root",
					"content"
				]
			}
		];
		
		// Use overrides section for SCSS files (Stylelint v15 best practice)
		// This applies customSyntax only to SCSS files, not CSS files
		defaultConfig.overrides = [
			{
				"files": ["**/*.scss"],
				"customSyntax": "postcss-scss"
			}
		];
	}
	
	// Merge custom rules with defaults (custom rules take precedence)
	const rules = { ...defaultConfig.rules, ...customRules };
	
	return {
		...defaultConfig,
		rules
	};
}

function generateStylelintIgnore(hasScssFiles = false) {
	let ignoreContent = `node_modules/**
*.min.css
dist/**
build/**
scripts/**
`;
	
	// If SCSS files exist, theme.css is compiled output and shouldn't be linted
	if (hasScssFiles) {
		ignoreContent += `theme.css
`;
	}
	
	return ignoreContent;
}

function migrateStylelintrc(stylelintrcPath) {
	try {
		const stylelintrcContent = readFileSync(stylelintrcPath, 'utf8');
		const stylelintrc = JSON.parse(stylelintrcContent);
		
		// Extract custom rules from existing config
		const customRules = stylelintrc.rules || {};
		
		console.log('✓ Found existing Stylelint config - migrating rules');
		
		return customRules;
	} catch (error) {
		if (error instanceof SyntaxError) {
			console.log('⚠ Warning: Stylelint config file is not valid JSON, using default rules');
		} else {
			console.log('⚠ Warning: Could not read Stylelint config file, using default rules');
		}
		return {};
	}
}

function setupStylelint() {
	// Check Node.js version (requires v14+, but v16+ recommended for security)
	// Stylelint 15.x supports Node.js 14+, but Node.js 14 is EOL
	// Requiring v16+ ensures security updates and compatibility with modern tooling
	const nodeVersion = process.version;
	const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
	if (majorVersion < 14) {
		console.error(`❌ Error: Node.js v14+ is required for Stylelint (found ${nodeVersion})`);
		console.error('Node.js v16+ is recommended for security and compatibility');
		console.error('Please upgrade Node.js from https://nodejs.org/');
		process.exit(1);
	}
	if (majorVersion < 16) {
		console.warn(`⚠ Warning: Node.js v16+ is recommended (found ${nodeVersion})`);
		console.warn('Node.js v14 is EOL and may have security vulnerabilities');
	}
	
	// Get the directory where this script is located
	const scriptDir = dirname(fileURLToPath(import.meta.url));
	// Resolve project root (one level up from scripts folder)
	const projectRoot = join(scriptDir, '..');
	const packageJsonPath = join(projectRoot, 'package.json');
	const stylelintConfigPath = join(projectRoot, '.stylelintrc.json');
	const stylelintIgnorePath = join(projectRoot, '.stylelintignore');
	const stylelintrcPath = join(projectRoot, '.stylelintrc');
	
	try {
		// Read package.json
		const packageJsonContent = readFileSync(packageJsonPath, 'utf8');
		const packageJson = JSON.parse(packageJsonContent);
		
		let updated = false;
		let customRules = {};
		
		// Check for existing Stylelint config and migrate rules
		if (existsSync(stylelintrcPath)) {
			customRules = migrateStylelintrc(stylelintrcPath);
		} else if (existsSync(stylelintConfigPath)) {
			customRules = migrateStylelintrc(stylelintConfigPath);
		}
		
		// Detect if SCSS files exist
		const scssSourcePath = join(projectRoot, 'src', 'scss');
		const hasScssFiles = existsSync(scssSourcePath) && statSync(scssSourcePath).isDirectory();
		
		// Add or update Stylelint devDependencies
		if (!packageJson.devDependencies) {
			packageJson.devDependencies = {};
			updated = true;
		}
		
		// Add required Stylelint dependencies
		for (const [dep, version] of Object.entries(STYLELINT_DEPS)) {
			if (!packageJson.devDependencies[dep] || packageJson.devDependencies[dep] !== version) {
				packageJson.devDependencies[dep] = version;
				updated = true;
				console.log(`✓ Added/updated devDependency: ${dep}@${version}`);
			}
		}
		
		// Add stylelint-scss and postcss-scss if SCSS files are detected
		if (hasScssFiles) {
			if (!packageJson.devDependencies[STYLELINT_SCSS_DEP] || packageJson.devDependencies[STYLELINT_SCSS_DEP] !== STYLELINT_SCSS_VERSION) {
				packageJson.devDependencies[STYLELINT_SCSS_DEP] = STYLELINT_SCSS_VERSION;
				updated = true;
				console.log(`✓ Added/updated devDependency: ${STYLELINT_SCSS_DEP}@${STYLELINT_SCSS_VERSION} (detected SCSS files)`);
			}
			if (!packageJson.devDependencies[POSTCSS_SCSS_DEP] || packageJson.devDependencies[POSTCSS_SCSS_DEP] !== POSTCSS_SCSS_VERSION) {
				packageJson.devDependencies[POSTCSS_SCSS_DEP] = POSTCSS_SCSS_VERSION;
				updated = true;
				console.log(`✓ Added/updated devDependency: ${POSTCSS_SCSS_DEP}@${POSTCSS_SCSS_VERSION} (required for SCSS syntax parsing)`);
			}
		}
		
		// Add or update scripts
		if (!packageJson.scripts) {
			packageJson.scripts = {};
			updated = true;
		}
		
		for (const [script, command] of Object.entries(STYLELINT_SCRIPTS)) {
			const currentCommand = packageJson.scripts[script];
			if (!currentCommand || currentCommand !== command) {
				packageJson.scripts[script] = command;
				updated = true;
				if (currentCommand) {
					console.log(`✓ Updated script: ${script}`);
				} else {
					console.log(`✓ Added script: ${script}`);
				}
			}
		}
		
		// Generate .stylelintrc.json file
		let stylelintConfigUpdated = false;
		const config = generateStylelintConfig(customRules, hasScssFiles);
		const newConfig = JSON.stringify(config, null, '\t') + '\n';
		
		if (!existsSync(stylelintConfigPath)) {
			writeFileSync(stylelintConfigPath, newConfig, 'utf8');
			console.log('✓ Created .stylelintrc.json configuration file');
			stylelintConfigUpdated = true;
		} else {
			// Update existing file to ensure it has the correct config
			const existingContent = readFileSync(stylelintConfigPath, 'utf8');
			const existingConfig = JSON.parse(existingContent);
			
			// Check if config needs updating
			// Compare key aspects: ignore list, overrides, plugins, and rules
			const needsUpdate = 
				// Check if ignore list is missing css-selection
				(!existingConfig.rules?.["plugin/no-unsupported-browser-features"]?.[1]?.ignore?.includes("css-selection") && 
				 config.rules["plugin/no-unsupported-browser-features"][1].ignore.includes("css-selection")) ||
				// Check if SCSS overrides are missing when SCSS files exist
				(hasScssFiles && !existingConfig.overrides) ||
				// Check if overrides structure is incorrect
				(hasScssFiles && existingConfig.overrides && 
				 (!existingConfig.overrides[0]?.files?.includes("**/*.scss") || 
				  existingConfig.overrides[0]?.customSyntax !== "postcss-scss")) ||
				// Check if customSyntax is at root level when it should be in overrides
				(hasScssFiles && existingConfig.customSyntax && !existingConfig.overrides) ||
				// Full comparison as fallback
				JSON.stringify(existingConfig, null, '\t') !== JSON.stringify(config, null, '\t');
			
			if (needsUpdate) {
				writeFileSync(stylelintConfigPath, newConfig, 'utf8');
				console.log('✓ Updated .stylelintrc.json configuration file');
				stylelintConfigUpdated = true;
			}
		}
		
		// Remove legacy .stylelintrc file after migration
		if (existsSync(stylelintrcPath) && stylelintrcPath !== stylelintConfigPath) {
			try {
				unlinkSync(stylelintrcPath);
				console.log('✓ Removed legacy .stylelintrc file (migrated to .stylelintrc.json)');
			} catch {
				console.log('⚠ Warning: Could not remove .stylelintrc file');
			}
		}
		
		// Generate .stylelintignore file
		let stylelintIgnoreUpdated = false;
		const ignoreContent = generateStylelintIgnore(hasScssFiles);
		
		if (!existsSync(stylelintIgnorePath)) {
			writeFileSync(stylelintIgnorePath, ignoreContent, 'utf8');
			console.log('✓ Created .stylelintignore file');
			stylelintIgnoreUpdated = true;
		} else {
			const existingContent = readFileSync(stylelintIgnorePath, 'utf8');
			if (existingContent !== ignoreContent) {
				writeFileSync(stylelintIgnorePath, ignoreContent, 'utf8');
				console.log('✓ Updated .stylelintignore file');
				stylelintIgnoreUpdated = true;
			}
		}
		
		// Generate and copy lint-wrapper.mjs if it doesn't exist or needs updating
		const lintWrapperPath = join(projectRoot, 'scripts', 'lint-wrapper.mjs');
		const lintWrapperSource = generateLintWrapper();
		let lintWrapperUpdated = false;
		
		// Ensure scripts directory exists
		const scriptsDir = join(projectRoot, 'scripts');
		if (!existsSync(scriptsDir)) {
			mkdirSync(scriptsDir, { recursive: true });
		}
		
		if (!existsSync(lintWrapperPath)) {
			writeFileSync(lintWrapperPath, lintWrapperSource, 'utf8');
			console.log('✓ Created scripts/lint-wrapper.mjs');
			lintWrapperUpdated = true;
		} else {
			// Update if content differs (in case of updates)
			const existingContent = readFileSync(lintWrapperPath, 'utf8');
			if (existingContent !== lintWrapperSource) {
				writeFileSync(lintWrapperPath, lintWrapperSource, 'utf8');
				console.log('✓ Updated scripts/lint-wrapper.mjs');
				lintWrapperUpdated = true;
			}
		}
		
		if (updated) {
			// Write back to package.json with proper formatting
			const updatedContent = JSON.stringify(packageJson, null, '\t') + '\n';
			writeFileSync(packageJsonPath, updatedContent, 'utf8');
			console.log('\n✓ package.json updated successfully!');
		}
		
		if (updated || stylelintConfigUpdated || stylelintIgnoreUpdated || lintWrapperUpdated) {
			console.log('\n✓ Stylelint setup complete!');
			if (hasScssFiles) {
				console.log('  Detected SCSS files - stylelint-scss has been configured');
			}
			console.log('\nNext steps:');
			console.log('  1. Run: npm install');
			console.log('  2. Run: npm run lint');
		} else {
			console.log('✓ Everything is already set up correctly!');
			if (hasScssFiles) {
				console.log('  SCSS files detected - stylelint-scss is configured');
			}
			console.log('  Run: npm run lint');
		}
		
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.error('❌ Error: package.json not found in project root');
			process.exit(1);
		} else if (error instanceof SyntaxError) {
			console.error('❌ Error: package.json is not valid JSON');
			console.error(error.message);
			process.exit(1);
		} else {
			console.error('❌ Error:', error.message);
			process.exit(1);
		}
	}
}

setupStylelint();

