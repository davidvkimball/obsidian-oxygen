#!/usr/bin/env node

/**
 * Comprehensive theme upgrade script
 * 
 * This script upgrades an existing theme to match the template standards:
 * 1. Detects and converts npm projects to pnpm (if needed)
 * 2. Upgrades package.json (adds type: module, fixes scripts, etc.)
 * 3. Upgrades lint-wrapper.mjs (flexible pnpm/npx detection for Stylelint)
 * 
 * Usage:
 *   pnpm run upgrade [project-directory]
 *   or
 *   node scripts/upgrade.mjs [project-directory]
 * 
 * If no directory is provided, uses current directory.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import process from 'process';

const packageManagerVersion = 'pnpm@10.20.0';
const preinstallScript = 'node scripts/npm-proxy.mjs';

const FLEXIBLE_LINT_WRAPPER = `#!/usr/bin/env node

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
		console.error('\\n⚠ SCSS files detected, but SCSS linting is not properly set up.\\n');
		
		if (!scssPluginInstalled) {
			console.error('Missing: stylelint-scss package');
			console.error('  Install it: pnpm add -D stylelint-scss@^5.0.0\\n');
		}
		
		if (!postcssScssInstalled) {
			console.error('Missing: postcss-scss package (required for SCSS syntax parsing)');
			console.error('  Install it: pnpm add -D postcss-scss@^4.0.0\\n');
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
		console.error('After installing and configuring, run: pnpm run lint\\n');
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

function detectNpmProject(projectDir) {
	const packageJsonPath = join(projectDir, 'package.json');
	const packageLockPath = join(projectDir, 'package-lock.json');
	
	if (!existsSync(packageJsonPath)) {
		return { isNpm: false, reason: 'No package.json found' };
	}
	
	try {
		const content = readFileSync(packageJsonPath, 'utf8');
		const packageJson = JSON.parse(content);
		
		if (packageJson.packageManager && packageJson.packageManager.includes('pnpm')) {
			return { isNpm: false, reason: 'Already using pnpm' };
		}
		
		const hasPackageLock = existsSync(packageLockPath);
		const isNpm = hasPackageLock || 
		              !packageJson.packageManager || 
		              packageJson.packageManager.includes('npm');
		
		return {
			isNpm,
			hasPackageLock,
			packageJson
		};
	} catch (error) {
		return { isNpm: false, reason: `Error reading package.json: ${error.message}` };
	}
}

function upgradeProject(projectDir) {
	const absDir = resolve(projectDir);
	const packageJsonPath = join(absDir, 'package.json');
	const lintWrapperPath = join(absDir, 'scripts', 'lint-wrapper.mjs');
	
	console.log(`\n🚀 Upgrading theme: ${absDir}\n`);
	
	if (!existsSync(packageJsonPath)) {
		console.error(`❌ Error: package.json not found at ${packageJsonPath}`);
		process.exit(1);
	}
	
	try {
		// Step 1: Detect and convert npm to pnpm if needed
		console.log('Step 1: Checking package manager...\n');
		const detection = detectNpmProject(absDir);
		
		if (detection.isNpm) {
			console.log('📦 Detected npm-based project. Converting to pnpm...\n');
		} else {
			console.log('✓ Project is already configured for pnpm.\n');
		}
		
		// Step 2: Upgrade package.json
		console.log('Step 2: Upgrading package.json...\n');
		const content = readFileSync(packageJsonPath, 'utf8');
		const packageJson = detection.packageJson || JSON.parse(content);
		
		let updated = false;
		const changes = [];
		
		// Add "type": "module" if missing
		if (!packageJson.type) {
			packageJson.type = 'module';
			updated = true;
			changes.push('✓ Added "type": "module"');
		}
		
		// Ensure scripts object exists
		if (!packageJson.scripts) {
			packageJson.scripts = {};
			updated = true;
		}
		
		// Add/update preinstall script
		if (!packageJson.scripts.preinstall || packageJson.scripts.preinstall !== preinstallScript) {
			const scripts = { preinstall: preinstallScript, ...packageJson.scripts };
			packageJson.scripts = scripts;
			updated = true;
			changes.push('✓ Added/updated preinstall script');
		}
		
		// Add version script if missing (but only if version-bump.mjs exists)
		if (!packageJson.scripts.version) {
			const versionBumpPath = join(absDir, 'version-bump.mjs');
			if (existsSync(versionBumpPath)) {
				packageJson.scripts.version = 'node version-bump.mjs && git add manifest.json versions.json';
				updated = true;
				changes.push('✓ Added version script');
			}
		}
		
		// Remove keywords field
		if ('keywords' in packageJson) {
			delete packageJson.keywords;
			updated = true;
			changes.push('✓ Removed keywords field');
		}
		
		// Ensure packageManager field exists and is correct
		if (!packageJson.packageManager || packageJson.packageManager !== packageManagerVersion) {
			packageJson.packageManager = packageManagerVersion;
			updated = true;
			if (!packageJson.packageManager) {
				changes.push('✓ Added packageManager field');
			}
		}
		
		// Reorder fields: move packageManager to end
		const orderedJson = {};
		const fieldOrder = [
			'name', 'version', 'description', 'main', 'type',
			'scripts', 'author', 'license',
			'devDependencies', 'dependencies',
			'packageManager'
		];
		
		for (const field of fieldOrder) {
			if (packageJson[field] !== undefined) {
				orderedJson[field] = packageJson[field];
			}
		}
		
		for (const [key, value] of Object.entries(packageJson)) {
			if (!(key in orderedJson)) {
				orderedJson[key] = value;
			}
		}
		
		// Write updated package.json
		if (updated) {
			const newContent = JSON.stringify(orderedJson, null, '\t') + '\n';
			writeFileSync(packageJsonPath, newContent, 'utf8');
			
			if (changes.length > 0) {
				console.log('✅ package.json upgraded!\n');
				changes.forEach(change => console.log(`   ${change}`));
			}
		} else {
			console.log('✓ package.json already up to date.\n');
		}
		
		// Step 3: Upgrade lint-wrapper.mjs (add flexible pnpm/npx detection)
		console.log('\nStep 3: Upgrading lint-wrapper.mjs...\n');
		if (existsSync(lintWrapperPath)) {
			const currentContent = readFileSync(lintWrapperPath, 'utf8');
			
			// Check if it's the correct Stylelint version with flexible detection
			const isStylelint = currentContent.includes('Stylelint') || currentContent.includes('stylelint');
			const hasFlexibleDetection = currentContent.includes('usePnpm') && currentContent.includes('execSync');
			
			if (isStylelint && hasFlexibleDetection) {
				console.log('✓ lint-wrapper.mjs already uses flexible Stylelint detection.\n');
			} else {
				// For themes, we need to preserve the Stylelint-specific logic
				// but add flexible pnpm/npx detection
				writeFileSync(lintWrapperPath, FLEXIBLE_LINT_WRAPPER, 'utf8');
				console.log('✅ lint-wrapper.mjs upgraded!');
				console.log('   Now uses flexible pnpm/npx detection (no npm warnings)\n');
			}
		} else {
			console.log('ℹ️  lint-wrapper.mjs not found (skipping)\n');
		}
		
		// Final summary
		if (detection.hasPackageLock) {
			console.log('⚠️  Note: package-lock.json detected');
			console.log('   Consider removing it: rm package-lock.json\n');
		}
		
		console.log('✅ Upgrade complete!\n');
		console.log('💡 Next steps:');
		console.log('   1. Review the changes');
		console.log('   2. Run: pnpm install (to update dependencies)');
		console.log('   3. Run: pnpm lint (to verify linting works)');
		console.log('');
		
	} catch (error) {
		console.error(`❌ Error: ${error.message}`);
		process.exit(1);
	}
}

// Get project directory from command line or use current directory
const projectDir = process.argv[2] || process.cwd();

upgradeProject(projectDir);

