const esbuild = require("esbuild");
const fs = require('fs');
const path = require('path');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		build.onStart(() => {
			console.log('[watch] build started');
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				console.error(`    ${location.file}:${location.line}:${location.column}:`);
			});
			console.log('[watch] build finished');
		});
	},
};

async function main() {
	// Copy webview files
	const webviewsSource = 'src/webviews';
	const webviewsTarget = 'dist/webviews';
	
	// Create target directory if it doesn't exist
	if (!fs.existsSync('dist')) {
		fs.mkdirSync('dist');
	}
	if (!fs.existsSync(webviewsTarget)) {
		fs.mkdirSync(webviewsTarget);
	}
	
	// Copy all HTML files
	if (fs.existsSync(webviewsSource)) {
		const files = fs.readdirSync(webviewsSource);
		files.forEach(file => {
			if (file.endsWith('.html')) {
				fs.copyFileSync(
					path.join(webviewsSource, file),
					path.join(webviewsTarget, file)
				);
				console.log(`Copied ${file} to dist/webviews/`);
			}
		});
	}

	const ctx = await esbuild.context({
		entryPoints: [
			'src/extension.ts'
		],
		bundle: true,
		format: 'cjs',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'node',
		outfile: 'dist/extension.js',
		external: ['vscode'],
		logLevel: 'silent',
		plugins: [
			/* add to the end of plugins array */
			esbuildProblemMatcherPlugin,
		],
	});
	if (watch) {
		await ctx.watch();
	} else {
		await ctx.rebuild();
		await ctx.dispose();
	}
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
