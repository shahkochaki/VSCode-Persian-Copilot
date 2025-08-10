import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let isAutoApplyEnabled = true;
let cssInjectionInterval: NodeJS.Timeout | undefined;

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('VSCode Persian Copilot is now active!');
	
	// Get saved preference
	isAutoApplyEnabled = context.globalState.get('autoApplyEnabled', true);
	
	// Auto-apply CSS if enabled (but actually just guide user)
	if (isAutoApplyEnabled) {
		startAutoApply();
	} else {
		vscode.window.showInformationMessage(
			'🎉 VSCode Persian Copilot activated!',
			'Apply CSS',
			'Enable Auto-Guide'
		).then(selection => {
			if (selection === 'Apply CSS') {
				applyCSS();
			} else if (selection === 'Enable Auto-Guide') {
				toggleAutoApply(context);
			}
		});
	}

	// Register commands
	const disposableRTL = vscode.commands.registerCommand('vscode-persian-copilot.applyChatRTL', () => {
		applyCSS();
		vscode.window.showInformationMessage('✅ Persian CSS applied successfully!');
	});

	const disposableToggle = vscode.commands.registerCommand('vscode-persian-copilot.toggleAutoApply', () => {
		toggleAutoApply(context);
	});

	const disposableDisable = vscode.commands.registerCommand('vscode-persian-copilot.disableCSS', () => {
		removeCSS();
		vscode.window.showInformationMessage('❌ Persian CSS removed!');
	});

	const disposableTest = vscode.commands.registerCommand('vscode-persian-copilot.testCSS', () => {
		const testScript = 
`(function() {
	try {
		console.log('🔍 Testing Persian RTL CSS...');
		
		// Check if our CSS is loaded
		const persianCSS = document.querySelector('style[data-persian-rtl]');
		console.log('🎨 Persian CSS loaded:', !!persianCSS);
		if (persianCSS) {
			console.log('CSS content length:', persianCSS.textContent.length, 'characters');
		}
		
		// Find elements
		const markdownElements = document.querySelectorAll('.rendered-markdown');
		const interactiveElements = document.querySelectorAll('.interactive-item-container');
		const chatElements = document.querySelectorAll('.chat-list-container, .copilot-chat-response');
		
		console.log('📊 Elements found:');
		console.log('- .rendered-markdown:', markdownElements.length);
		console.log('- .interactive-item-container:', interactiveElements.length);
		console.log('- Chat containers:', chatElements.length);
		
		// Show current CSS for first markdown element
		if (markdownElements.length > 0) {
			const firstEl = markdownElements[0];
			const style = window.getComputedStyle(firstEl);
			console.log('📝 First markdown element CSS:');
			console.log('- direction:', style.direction);
			console.log('- text-align:', style.textAlign);
			console.log('- font-family:', style.fontFamily.substring(0, 50) + '...');
		} else {
			console.log('⚠️ No markdown elements found. Try opening GitHub Copilot chat.');
		}
		
		return true;
	} catch(error) {
		console.error('❌ Test error:', error);
		return false;
	}
})();`;

		vscode.env.clipboard.writeText(testScript);
		vscode.window.showInformationMessage(
			'🔍 CSS Test script copied! Paste in DevTools Console to debug',
			'Open DevTools'
		).then(selection => {
			if (selection === 'Open DevTools') {
				vscode.commands.executeCommand('workbench.action.toggleDevTools');
			}
		});
	});

	// Date Converter command
	const disposableDateConverter = vscode.commands.registerCommand('vscode-persian-copilot.dateConverter', () => {
		openDateConverterWebview();
	});

	context.subscriptions.push(disposableRTL, disposableToggle, disposableDisable, disposableTest, disposableDateConverter);
// --- Date Converter Webview ---
function openDateConverterWebview() {
	const panel = vscode.window.createWebviewPanel(
		'persianDateConverter',
		'Persian Date Converter',
		vscode.ViewColumn.One,
		{ enableScripts: true }
	);

	// Load HTML from external file
	const htmlPath = path.join(__dirname, 'webviews', 'dateConverter.html');
	let html = '';
	try {
		html = fs.readFileSync(htmlPath, 'utf8');
	} catch (e) {
		html = '<h2>Could not load date converter UI.</h2>';
	}
	panel.webview.html = html;

	// Handle messages from the webview
	panel.webview.onDidReceiveMessage(
		message => {
			if (message.command === 'convert') {
				const { type, value } = message;
				let result = '';
				try {
					if (type === 'toJalali') {
						result = toJalaliString(value);
					} else if (type === 'toGregorian') {
						result = toGregorianString(value);
					}
				} catch (e) {
					result = 'Invalid date!';
				}
				panel.webview.postMessage({ command: 'result', result });
			}
		},
		undefined
	);



// --- Date conversion logic ---
// Minimal Jalali/Gregorian conversion (using algorithm from jalaali-js)
// Source: https://github.com/jalaali/jalaali-js (MIT License)
function toJalaliString(gregorian: string): string {
	const [gy, gm, gd] = gregorian.split('-').map(Number);
	const { jy, jm, jd } = toJalali(gy, gm, gd);
	return `${jy}-${pad(jm)}-${pad(jd)}`;
}
function toGregorianString(jalali: string): string {
	const [jy, jm, jd] = jalali.split('-').map(Number);
	const { gy, gm, gd } = toGregorian(jy, jm, jd);
	return `${gy}-${pad(gm)}-${pad(gd)}`;
}
function pad(n: number) { return n < 10 ? '0' + n : n; }

// --- Jalaali conversion core ---
// (Minimal, inlined for extension)
function toJalali(gy: number, gm: number, gd: number) {
	   const g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];
	   let jy = (gy <= 1600) ? 0 : 979;
	   gy -= (gy <= 1600) ? 621 : 1600;
	   let gy2 = (gm > 2) ? (gy + 1) : gy;
	   let days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
	   jy += 33 * Math.floor(days / 12053);
	   days %= 12053;
	   jy += 4 * Math.floor(days / 1461);
	   days %= 1461;
	   if (days > 365) {
		   jy += Math.floor((days - 1) / 365);
		   days = (days - 1) % 365;
	   }
	   const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
	   const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
	   return { jy: jy + 1, jm, jd };
	}
}
function toGregorian(jy: number, jm: number, jd: number) {
	jy -= (jy <= 979) ? 0 : 979;
	let gy = (jy <= 979) ? 621 : 1600;
	let days = (365 * jy) + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? ((jm - 1) * 31) : (((jm - 7) * 30) + 186));
	gy += 400 * Math.floor(days / 146097);
	days %= 146097;
	if (days > 36524) {
		gy += 100 * Math.floor(--days / 36524);
		days %= 36524;
		if (days >= 365) { days++; }
	}
	gy += 4 * Math.floor(days / 1461);
	days %= 1461;
	   if (days > 365) {
		   gy += Math.floor((days - 1) / 365);
		   days = (days - 1) % 365;
	   }
	   let gm = 0;
	   let gd = 0;
	   const sal_a = [0,31,((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28,31,30,31,30,31,31,30,31,30,31];
	   for (let i = 1; i <= 12; i++) {
		   if (days < sal_a[i]) {
			   gm = i;
			   gd = days + 1;
			   break;
		   } else {
			   days -= sal_a[i];
		   }
	   }
	   return { gy, gm, gd };
	}

// --- Persian Tools Hub navigation handler ---


// --- IP Details Webview ---
function openIpDetailsWebview() {
	const panel = vscode.window.createWebviewPanel(
		'ipDetails',
		'IP/URL Details Lookup',
		vscode.ViewColumn.One,
		{ enableScripts: true }
	);
	const htmlPath = path.join(__dirname, 'webviews', 'ipDetails.html');
	let html = '';
	try {
		html = fs.readFileSync(htmlPath, 'utf8');
	} catch (e) {
		html = '<h2>Could not load IP Details UI.</h2>';
	}
	panel.webview.html = html;

	panel.webview.onDidReceiveMessage(
		async message => {
			if (message.command === 'ipDetailsLookup') {
				const { token, url } = message;
				try {
					const res = await fetch('https://console.helpix.app/api/v1/tools/ip/details', {
						method: 'POST',
						headers: {
							'Authorization': 'Bearer ' + token,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ url })
					});
					const data = await res.json();
					panel.webview.postMessage({ command: 'ipDetailsResult', data });
				} catch (e) {
					panel.webview.postMessage({ command: 'ipDetailsResult', error: 'Request failed!' });
				}
			}
		},
		undefined
	);
}
}

function startAutoApply() {
	// Show initial setup message only once
	setTimeout(() => {
		vscode.window.showInformationMessage(
			'🚀 Persian Copilot is ready! Click "Apply CSS" to activate RTL support.',
			'Apply CSS',
			'Setup Guide'
		).then(selection => {
			if (selection === 'Apply CSS') {
				applyCSS();
			} else if (selection === 'Setup Guide') {
				showSetupGuide();
			}
		});
	}, 2000);
}

function showSetupGuide() {
	const panel = vscode.window.createWebviewPanel(
		'persianSetupGuide',
		'Persian Copilot Setup Guide',
		vscode.ViewColumn.One,
		{
			enableScripts: true
		}
	);
	
	panel.webview.html = getSetupGuideHTML();
}

function getSetupGuideHTML(): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Persian Copilot Setup</title>
	<style>
		body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; }
		.step { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
		.code { background: #2d2d30; color: #cccccc; padding: 10px; border-radius: 4px; font-family: 'Courier New', monospace; }
		.highlight { background: #007acc; color: white; padding: 2px 6px; border-radius: 3px; }
	</style>
</head>
<body>
	<h1>🇮🇷 Persian Copilot Setup Guide</h1>
	
	<div class="step">
		<h3>Step 1: Open Developer Tools</h3>
		<p>Press <span class="highlight">F12</span> or go to <strong>Help → Toggle Developer Tools</strong></p>
	</div>
	
	<div class="step">
		<h3>Step 2: Go to Console Tab</h3>
		<p>Click on the <strong>Console</strong> tab in Developer Tools</p>
	</div>
	
	<div class="step">
		<h3>Step 3: Apply CSS</h3>
		<p>Use Command Palette (<span class="highlight">Ctrl+Shift+P</span>) → Search <strong>"Apply Persian CSS"</strong></p>
		<p>Then paste the copied script in Console and press Enter</p>
	</div>
	
	<div class="step">
		<h3>✨ That's it!</h3>
		<p>Your VS Code chat interface now supports Persian RTL text!</p>
	</div>
	
	<p><strong>💡 Tip:</strong> You only need to do this once per VS Code session.</p>
</body>
</html>`;
}

function stopAutoApply() {
	if (cssInjectionInterval) {
		clearInterval(cssInjectionInterval);
		cssInjectionInterval = undefined;
	}
}

function toggleAutoApply(context: vscode.ExtensionContext) {
	isAutoApplyEnabled = !isAutoApplyEnabled;
	context.globalState.update('autoApplyEnabled', isAutoApplyEnabled);
	
	if (isAutoApplyEnabled) {
		startAutoApply();
		vscode.window.showInformationMessage('✅ Auto-guide enabled! You\'ll get helpful reminders.');
	} else {
		stopAutoApply();
		vscode.window.showInformationMessage('❌ Auto-guide disabled. Use Command Palette to apply CSS manually.');
	}
}

function applyCSS() {
	// Method 1: Try to copy CSS file to VS Code styles directory
	const cssMethod = vscode.window.showQuickPick([
		{ 
			label: '📋 Copy Script (Current Method)',
			description: 'Copy JavaScript to clipboard for DevTools',
			detail: 'Requires manual paste in DevTools Console'
		},
		{
			label: '📁 Copy CSS File',
			description: 'Copy CSS file to system and show instructions',
			detail: 'Direct CSS file approach'
		},
		{
			label: '🔧 Advanced Auto-Inject',
			description: 'Try automatic injection via VS Code API',
			detail: 'Experimental - may work better'
		}
	], {
		placeHolder: 'Choose CSS application method'
	});

	cssMethod.then(selection => {
		if (!selection) {
			return;
		}

		switch (selection.label) {
			case '📋 Copy Script (Current Method)':
				copyScriptMethod();
				break;
			case '📁 Copy CSS File':
				copyCSSFileMethod();
				break;
			case '🔧 Advanced Auto-Inject':
				advancedInjectMethod();
				break;
		}
	});
}

function copyScriptMethod() {
	// Original method
	const script = getCSSInjectionScript();
	vscode.env.clipboard.writeText(script);
	
	vscode.window.showInformationMessage(
		'CSS script copied to clipboard! Please open DevTools (F12) → Console → Paste & Enter',
		'Open DevTools'
	).then(selection => {
		if (selection === 'Open DevTools') {
			vscode.commands.executeCommand('workbench.action.toggleDevTools');
		}
	});
}

function copyCSSFileMethod() {
	try {
		// Read CSS file from extension
		const extensionPath = vscode.extensions.getExtension('shahkochaki.vscode-persian-copilot')?.extensionPath;
		if (!extensionPath) {
			vscode.window.showErrorMessage('Could not find extension path');
			return;
		}

		const cssPath = path.join(extensionPath, 'assets', 'persian-rtl.css');
		const cssContent = fs.readFileSync(cssPath, 'utf8');
		
		// Copy CSS content to clipboard
		vscode.env.clipboard.writeText(cssContent);
		
		vscode.window.showInformationMessage(
			'✅ Pure CSS copied to clipboard! Create a .css file and paste this content, then inject it manually.',
			'Show Instructions'
		).then(selection => {
			if (selection === 'Show Instructions') {
				showCSSFileInstructions();
			}
		});
	} catch (error) {
		vscode.window.showErrorMessage('Error reading CSS file: ' + error);
	}
}

function advancedInjectMethod() {
	// Try using webview to inject CSS
	const panel = vscode.window.createWebviewPanel(
		'persianCSSInjector',
		'Persian CSS Injector',
		{ viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
		{
			enableScripts: true,
			retainContextWhenHidden: true
		}
	);

	const cssContent = getCSSContent();
	
	panel.webview.html = `
<!DOCTYPE html>
<html>
<head>
	<style>
		body { font-family: Arial, sans-serif; padding: 20px; }
		.css-code { background: #2d2d30; color: #cccccc; padding: 15px; border-radius: 8px; white-space: pre-wrap; }
		button { padding: 10px 20px; margin: 10px 5px; border: none; border-radius: 5px; cursor: pointer; }
		.inject-btn { background: #007acc; color: white; }
	</style>
</head>
<body>
	<h2>🇮🇷 Persian RTL CSS Injector</h2>
	<p>This CSS will be applied to make Persian text RTL in VS Code chat:</p>
	
	<div class="css-code">${cssContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
	
	<button class="inject-btn" onclick="injectToParent()">🚀 Try Auto-Inject</button>
	<button onclick="copyToClipboard()">📋 Copy CSS</button>
	
	<script>
		function injectToParent() {
			try {
				// Try to access parent window (VS Code main window)
				if (window.parent && window.parent !== window) {
					const style = window.parent.document.createElement('style');
					style.setAttribute('data-persian-rtl', 'true');
					style.textContent = \`${cssContent.replace(/`/g, '\\`')}\`;
					window.parent.document.head.appendChild(style);
					alert('✅ CSS injected successfully!');
				} else {
					alert('❌ Cannot access parent window. Use DevTools method instead.');
				}
			} catch(e) {
				alert('❌ Injection failed: ' + e.message);
			}
		}
		
		function copyToClipboard() {
			navigator.clipboard.writeText(\`${cssContent.replace(/`/g, '\\`')}\`).then(() => {
				alert('✅ CSS copied to clipboard!');
			});
		}
	</script>
</body>
</html>`;

	// Auto close after 30 seconds
	setTimeout(() => {
		panel.dispose();
	}, 30000);
}

function showCSSFileInstructions() {
	const panel = vscode.window.createWebviewPanel(
		'cssFileInstructions',
		'CSS File Instructions',
		vscode.ViewColumn.One,
		{ enableScripts: true }
	);
	
	panel.webview.html = `<!DOCTYPE html>
<html>
<head>
	<style>
		body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
		.step { margin: 15px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
		.highlight { background: #007acc; color: white; padding: 2px 6px; border-radius: 3px; }
		code { background: #eee; padding: 2px 5px; border-radius: 3px; }
	</style>
</head>
<body>
	<h1>📁 CSS File Method Instructions</h1>
	
	<div class="step">
		<h3>Method 1: Browser Extension</h3>
		<p>1. Install a browser extension like <strong>"User CSS"</strong> or <strong>"Stylish"</strong></p>
		<p>2. Create a new style for <code>vscode://</code> or VS Code domain</p>
		<p>3. Paste the CSS content (already copied to clipboard)</p>
	</div>
	
	<div class="step">
		<h3>Method 2: VS Code Custom CSS Extension</h3>
		<p>1. Install <strong>"Custom CSS and JS Loader"</strong> extension</p>
		<p>2. Create a <code>.css</code> file with the copied content</p>
		<p>3. Configure the extension to load your CSS file</p>
	</div>
	
	<div class="step">
		<h3>Method 3: Direct File Modification</h3>
		<p>⚠️ <strong>Advanced users only!</strong></p>
		<p>1. Navigate to VS Code installation directory</p>
		<p>2. Find <code>workbench.desktop.main.css</code></p>
		<p>3. Append the CSS content (backup first!)</p>
	</div>
</body>
</html>`;
}

function getCSSContent(): string {
	return `/* Persian Copilot RTL Styles */
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap');

.rendered-markdown {
    direction: rtl !important;
    text-align: right !important;
    font-family: "Vazirmatn", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}

.rendered-markdown pre,
.rendered-markdown code {
    direction: ltr !important;
    text-align: left !important;
}`;
}

function removeCSS() {
	const removeScript = 
`(function() {
	try {
		console.log('🗑️ Removing Persian RTL CSS...');
		const existingStyles = document.querySelectorAll('style[data-persian-rtl]');
		existingStyles.forEach(function(style) {
			style.remove();
		});
		console.log('✅ Removed', existingStyles.length, 'Persian RTL styles');
		return true;
	} catch(error) {
		console.error('❌ Error removing Persian RTL CSS:', error);
		return false;
	}
})();`;
	
	vscode.env.clipboard.writeText(removeScript);
	vscode.window.showInformationMessage(
		'CSS removal script copied to clipboard! Please open DevTools (F12) → Console → Paste & Enter',
		'Open DevTools'
	).then(selection => {
		if (selection === 'Open DevTools') {
			vscode.commands.executeCommand('workbench.action.toggleDevTools');
		}
	});
}

function getCSSInjectionScript(): string {
	// Separate CSS content without template literals to avoid escaping issues
	const cssContent = `/* Persian Copilot RTL Styles */
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap');

/* Main chat container RTL support */
.interactive-session .interactive-item-container .value .rendered-markdown {
    direction: rtl !important;
    text-align: right !important;
    font-family: "Vazirmatn", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}

/* Alternative selectors for different VS Code versions */
.chat-list-container .rendered-markdown,
.interactive-list .rendered-markdown,
.chat-item .rendered-markdown {
    direction: rtl !important;
    text-align: right !important;
    font-family: "Vazirmatn", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}

/* Keep code blocks and special elements LTR */
.rendered-markdown pre,
.rendered-markdown code,
.rendered-markdown .progress-step,
.rendered-markdown .interactive-result-editor,
.rendered-markdown .codicon,
.rendered-markdown .monaco-editor {
    direction: ltr !important;
    text-align: left !important;
    font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace !important;
}

/* Enhanced chat bubble support */
.chat-response-container,
.interactive-response-container {
    direction: rtl !important;
}

/* Copilot specific selectors */
.copilot-chat-response .rendered-markdown,
.github-copilot-chat .rendered-markdown {
    direction: rtl !important;
    text-align: right !important;
    font-family: "Vazirmatn", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}`;

	// Create injection script without template literals
	const injectionScript = 
`(function() {
	try {
		console.log('🚀 Starting Persian RTL injection...');
		
		// Remove any existing Persian RTL styles
		const existingStyles = document.querySelectorAll('style[data-persian-rtl]');
		existingStyles.forEach(style => style.remove());
		console.log('🗑️ Removed', existingStyles.length, 'existing styles');
		
		// Create and inject new style
		const style = document.createElement('style');
		style.setAttribute('data-persian-rtl', 'true');
		style.type = 'text/css';
		style.textContent = ` + JSON.stringify(cssContent) + `;
		
		// Inject into head
		document.head.appendChild(style);
		console.log('✅ Persian RTL CSS successfully injected!');
		
		// No test or repeated code. Only inject CSS once.
		
		return true;
	} catch(error) {
		console.error('❌ Persian RTL injection error:', error);
		return false;
	}
})();`;

	return injectionScript;
}

// This method is called when your extension is deactivated
export function deactivate() {
	stopAutoApply();
}
