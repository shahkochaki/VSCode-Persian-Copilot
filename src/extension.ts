// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';

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

	context.subscriptions.push(disposableRTL, disposableToggle, disposableDisable, disposableTest);
}

function startAutoApply() {
	// Show initial setup message
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
	
	// Set up interval to remind user every 2 minutes if CSS is not applied
	cssInjectionInterval = setInterval(() => {
		vscode.window.showInformationMessage(
			'💡 Reminder: Apply Persian CSS for RTL support',
			'Apply Now',
			'Don\'t remind'
		).then(selection => {
			if (selection === 'Apply Now') {
				applyCSS();
			} else if (selection === 'Don\'t remind') {
				stopAutoApply();
			}
		});
	}, 120000); // Every 2 minutes
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
	// Simply copy the CSS script to clipboard for manual injection
	const script = getCSSInjectionScript();
	vscode.env.clipboard.writeText(script);
	
	// Show instruction to user
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
		
		// Test if CSS is working by checking elements
		setTimeout(function() {
			const markdownElements = document.querySelectorAll('.rendered-markdown');
			console.log('📊 Found', markdownElements.length, 'markdown elements');
			
			markdownElements.forEach(function(el, index) {
				const computedStyle = window.getComputedStyle(el);
				console.log('Element ' + index + ': direction=' + computedStyle.direction + ', text-align=' + computedStyle.textAlign);
			});
			
			if (markdownElements.length > 0) {
				console.log('🎉 Persian RTL should now be active!');
			} else {
				console.log('⚠️ No markdown elements found. Try opening a chat conversation.');
			}
		}, 1000);
		
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
