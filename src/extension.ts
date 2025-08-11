import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

let isAutoApplyEnabled = true;
let cssInjectionInterval: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext) {
	// --- Read settings ---
	const config = getPersianCopilotConfig();
	
	// Tools enable/disable
	const enableTools = {
		dateConverter: config.get('enableDateConverter', true),
		numberConvert: config.get('enableNumberConvert', true),
		calendar: config.get('enableCalendar', true),
		arabicToPersian: config.get('enableArabicToPersian', true),
		lorem: config.get('enableLorem', true),
		moneyConvert: config.get('enableMoneyConvert', true),
		numberToWords: config.get('enableNumberToWords', true),
		ipDetails: config.get('enableIpDetails', true),
		jsonParser: config.get('enableJsonParser', true),
	};
	const showToolsHubIcon = config.get('showToolsHubIcon', true);
	const autoApply = config.get('autoApply', true);
	const showDevToolsGuide = config.get('showDevToolsGuide', true);

	// Persian Tools Hub command
	if (showToolsHubIcon) {
		const disposableToolsHub = vscode.commands.registerCommand('vscode-persian-copilot.openToolsHub', () => {
			openToolsHubWebview();
		});
		context.subscriptions.push(disposableToolsHub);
		
		// Persian Copilot Activity Bar Icon (View Container)
		vscode.window.registerWebviewViewProvider?.('persianCopilot.toolsView', {
			resolveWebviewView(webviewView) {
				const htmlPath = path.join(__dirname, 'webviews', 'hub.html');
				let html = '';
				try {
					html = fs.readFileSync(htmlPath, 'utf8');
				} catch (e) {
					html = '<h2>Could not load Persian Tools Hub UI.</h2>';
				}
				webviewView.webview.options = { enableScripts: true };
				webviewView.webview.html = html;
			}
		});
	}

	// Register tools commands
	if (enableTools.numberConvert) {
		const disposableNumberConvert = vscode.commands.registerCommand('vscode-persian-copilot.numberConvert', () => {
			openSimpleWebview('numberConvert', 'Number Converter', 'numberConvert.html');
		});
		context.subscriptions.push(disposableNumberConvert);
	}
	if (enableTools.calendar) {
		const disposableCalendar = vscode.commands.registerCommand('vscode-persian-copilot.calendar', () => {
			openSimpleWebview('calendar', 'Persian Calendar', 'calendar.html');
		});
		context.subscriptions.push(disposableCalendar);
	}
	if (enableTools.arabicToPersian) {
		const disposableArabicToPersian = vscode.commands.registerCommand('vscode-persian-copilot.arabicToPersian', () => {
			openSimpleWebview('arabicToPersian', 'Arabic to Persian', 'arabicToPersian.html');
		});
		context.subscriptions.push(disposableArabicToPersian);
	}
	if (enableTools.lorem) {
		const disposableLorem = vscode.commands.registerCommand('vscode-persian-copilot.lorem', () => {
			openSimpleWebview('lorem', 'Persian Lorem Ipsum', 'lorem.html');
		});
		context.subscriptions.push(disposableLorem);
	}
	if (enableTools.moneyConvert) {
		const disposableMoneyConvert = vscode.commands.registerCommand('vscode-persian-copilot.moneyConvert', () => {
			openSimpleWebview('moneyConvert', 'Money Converter', 'moneyConvert.html');
		});
		context.subscriptions.push(disposableMoneyConvert);
	}
	if (enableTools.numberToWords) {
		const disposableNumberToWords = vscode.commands.registerCommand('vscode-persian-copilot.numberToWords', () => {
			openSimpleWebview('numberToWords', 'Number to Persian Words', 'numberToWords.html');
		});
		context.subscriptions.push(disposableNumberToWords);
	}
	if (enableTools.ipDetails) {
		const disposableIpDetails = vscode.commands.registerCommand('vscode-persian-copilot.ipDetails', () => {
			openIpDetailsWebview();
		});
		context.subscriptions.push(disposableIpDetails);
	}
	if (enableTools.jsonParser) {
		const disposableJsonParser = vscode.commands.registerCommand('vscode-persian-copilot.jsonParser', () => {
			openSimpleWebview('jsonParser', 'JSON Parser', 'jsonParser.html');
		});
		context.subscriptions.push(disposableJsonParser);
	}
	if (enableTools.dateConverter) {
		const disposableDateConverter = vscode.commands.registerCommand('vscode-persian-copilot.dateConverter', () => {
			openDateConverterWebview();
		});
		context.subscriptions.push(disposableDateConverter);
	}

	// Register always-available commands (CSS/RTL)
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

	context.subscriptions.push(disposableRTL, disposableToggle, disposableDisable, disposableTest);

	// --- CSS/RTL/Guide logic based on settings ---
	isAutoApplyEnabled = autoApply;
	if (isAutoApplyEnabled && showDevToolsGuide) {
		startAutoApply();
	}

	console.log('VSCode Persian Copilot is now active!');
}

// --- Helper Functions ---

function getPersianCopilotConfig(): vscode.WorkspaceConfiguration {
	return vscode.workspace.getConfiguration('persianCopilot');
}

// Persian number conversion utilities
function convertPersianToEnglish(input: string): string {
	const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
	const englishDigits = '0123456789';
	let result = input;
	for (let i = 0; i < persianDigits.length; i++) {
		result = result.replace(new RegExp(persianDigits[i], 'g'), englishDigits[i]);
	}
	return result;
}

function convertEnglishToPersian(input: string): string {
	const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
	const englishDigits = '0123456789';
	let result = input;
	for (let i = 0; i < englishDigits.length; i++) {
		result = result.replace(new RegExp(englishDigits[i], 'g'), persianDigits[i]);
	}
	return result;
}

function convertDate(input: string, type: string): string {
	// Simple date conversion placeholder
	// You can implement proper Jalali/Gregorian conversion here
	return `Converted ${type}: ${input}`;
}

// Open webview for tools
function openSimpleWebview(type: string, title: string, htmlFile: string) {
	const panel = vscode.window.createWebviewPanel(
		type,
		title,
		vscode.ViewColumn.One,
		{ enableScripts: true }
	);
	const htmlPath = path.join(__dirname, 'webviews', htmlFile);
	let html = '';
	try {
		html = fs.readFileSync(htmlPath, 'utf8');
	} catch (e) {
		html = `<h2>Could not load ${title}.</h2>`;
	}
	panel.webview.html = html;

	// Handle messages from webview
	panel.webview.onDidReceiveMessage(
		message => {
			switch (message.command) {
				case 'convertFa2En':
					const englishNum = convertPersianToEnglish(message.value);
					panel.webview.postMessage({ command: 'result', result: `English: ${englishNum}` });
					break;
				case 'convertEn2Fa':
					const persianNum = convertEnglishToPersian(message.value);
					panel.webview.postMessage({ command: 'result', result: `Persian: ${persianNum}` });
					break;
				case 'convertDate':
					const convertedDate = convertDate(message.value, message.type);
					panel.webview.postMessage({ command: 'result', result: convertedDate });
					break;
			}
		}
	);
}

// Tools Hub Webview
function openToolsHubWebview() {
	const panel = vscode.window.createWebviewPanel(
		'persianToolsHub',
		'Persian Tools Hub',
		vscode.ViewColumn.One,
		{ enableScripts: true }
	);
	const htmlPath = path.join(__dirname, 'webviews', 'hub.html');
	let html = '';
	try {
		html = fs.readFileSync(htmlPath, 'utf8');
	} catch (e) {
		html = '<h2>Could not load Persian Tools Hub UI.</h2>';
	}
	panel.webview.html = html;
}

function openDateConverterWebview() {
	const panel = vscode.window.createWebviewPanel(
		'dateConverter',
		'Date Converter',
		vscode.ViewColumn.One,
		{ enableScripts: true }
	);
	const htmlPath = path.join(__dirname, 'webviews', 'dateConverter.html');
	let html = '';
	try {
		html = fs.readFileSync(htmlPath, 'utf8');
	} catch (e) {
		html = '<h2>Could not load Date Converter.</h2>';
	}
	panel.webview.html = html;
}

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
