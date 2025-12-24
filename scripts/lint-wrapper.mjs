#!/usr/bin/env node

/**
 * Stylelint wrapper that detects theme structure and lints appropriately
 * 
 * Handles two theme patterns:
 * 1. Simple CSS themes: theme.css in root (no build step)
 * 2. Complex themes: SCSS in src/scss/ (with build tools like Grunt)
 */

import { spawn, execSync } from 'child_process';
import { existsSync, statSync, readFileSync } from 'fs';
import { join } from 'path';
import process from 'process';

const args = process.argv.slice(2);
const hasFix = args.includes('--fix');

// Detect which package manager to use
let usePnpm = false;
try {
	execSync('pnpm --version', { stdio: 'ignore', shell: true });
	usePnpm = true;
} catch (error) {
	usePnpm = false;
}

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
		console.error('\n⚠ SCSS files detected, but SCSS linting is not properly set up.\n');
		
		if (!scssPluginInstalled) {
			console.error('Missing: stylelint-scss package');
			console.error('  Install it: pnpm add -D stylelint-scss@^5.0.0\n');
		}
		
		if (!postcssScssInstalled) {
			console.error('Missing: postcss-scss package (required for SCSS syntax parsing)');
			console.error('  Install it: pnpm add -D postcss-scss@^4.0.0\n');
		}
		
		if (!scssPluginConfigured || !customSyntaxConfigured) {
			console.error('Missing: SCSS configuration in .stylelintrc.json');
			console.error('  Add "stylelint-scss" to the "plugins" array');
			console.error('  Add "customSyntax": "postcss-scss" in an "overrides" section (Stylelint v15 best practice)\n');
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
		console.error('After installing and configuring, run: pnpm run lint\n');
		process.exit(1);
	}
}

// Build stylelint command
const stylelintArgs = ['stylelint', ...filesToLint, ...args];
const command = usePnpm ? 'pnpm' : 'npx';
const commandArgs = usePnpm ? ['exec', ...stylelintArgs] : stylelintArgs;

// Run Stylelint
const stylelint = spawn(command, commandArgs, {
	stdio: 'inherit',
	shell: true
});

stylelint.on('close', (code) => {
	if (code === 0) {
		const message = hasFix 
			? '\n✓ CSS/SCSS linting complete! All issues fixed automatically.\n'
			: '\n✓ CSS/SCSS linting passed! No issues found.\n';
		console.log(message);
		process.exit(0);
	} else {
		// Stylelint already printed errors, just exit with the code
		process.exit(code);
	}
});
