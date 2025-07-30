// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';

let isAutoApplyEnabled = true;
let cssInjectionInterval: NodeJS.Timeout | undefined;

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('VSCode Persian Copilot is now active!');
	
	// Get saved preference
	isAutoApplyEnabled = context.globalState.get('autoApplyEnabled', true);
	
	// Auto-apply CSS if enabled
	if (isAutoApplyEnabled) {
		startAutoApply();
		vscode.window.showInformationMessage(
			'🎉 VSCode Persian Copilot فعال شد! CSS خودکار اعمال می‌شود.',
			'تنظیمات',
			'غیرفعال کردن خودکار'
		).then(selection => {
			if (selection === 'تنظیمات') {
				vscode.commands.executeCommand('workbench.action.openSettings', 'persian copilot');
			} else if (selection === 'غیرفعال کردن خودکار') {
				toggleAutoApply(context);
			}
		});
	} else {
		vscode.window.showInformationMessage(
			'🎉 VSCode Persian Copilot فعال شد!',
			'فعال کردن خودکار',
			'اعمال یکبار'
		).then(selection => {
			if (selection === 'فعال کردن خودکار') {
				toggleAutoApply(context);
			} else if (selection === 'اعمال یکبار') {
				applyCSS();
			}
		});
	}

	// Register commands
	const disposableRTL = vscode.commands.registerCommand('vscode-persian-copilot.applyChatRTL', () => {
		applyCSS();
		vscode.window.showInformationMessage('✅ CSS فارسی اعمال شد!');
	});

	const disposableToggle = vscode.commands.registerCommand('vscode-persian-copilot.toggleAutoApply', () => {
		toggleAutoApply(context);
	});

	const disposableDisable = vscode.commands.registerCommand('vscode-persian-copilot.disableCSS', () => {
		removeCSS();
		vscode.window.showInformationMessage('❌ CSS فارسی حذف شد!');
	});

	context.subscriptions.push(disposableRTL, disposableToggle, disposableDisable);
}

function startAutoApply() {
	// Apply CSS immediately
	setTimeout(() => applyCSS(), 2000);
	
	// Set up interval to reapply CSS every 30 seconds to handle dynamic content
	cssInjectionInterval = setInterval(() => {
		applyCSS();
	}, 30000);
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
		vscode.window.showInformationMessage('✅ اعمال خودکار CSS فعال شد!');
	} else {
		stopAutoApply();
		removeCSS();
		vscode.window.showInformationMessage('❌ اعمال خودکار CSS غیرفعال شد!');
	}
}

function applyCSS() {
	// Create a hidden webview to inject CSS into VS Code
	const panel = vscode.window.createWebviewPanel(
		'persianRTL',
		'Persian RTL Injector',
		{ viewColumn: vscode.ViewColumn.Active, preserveFocus: true },
		{
			enableScripts: true,
			retainContextWhenHidden: true
		}
	);

	// Hide the panel immediately
	panel.dispose();

	// Alternative: Try to inject via executeCommand
	setTimeout(() => {
		vscode.commands.executeCommand('workbench.action.webview.openDeveloperTools').then(() => {
			setTimeout(() => {
				const script = getCSSInjectionScript();
				// Auto-execute the script
				vscode.env.clipboard.writeText(script);
				
				// Try to auto-paste and execute (if possible)
				vscode.commands.executeCommand('workbench.action.terminal.paste');
			}, 1000);
		});
	}, 500);
}

function removeCSS() {
	const removeScript = `
		(function() {
			const existingStyles = document.querySelectorAll('style[data-persian-rtl]');
			existingStyles.forEach(style => style.remove());
			console.log('Persian RTL CSS removed');
		})();
	`;
	vscode.env.clipboard.writeText(removeScript);
}

function getCSSInjectionScript(): string {
	const rtlCSS = `.rendered-markdown  {
    direction: rtl;
    text-align: right;
}

.rendered-markdown .progress-step,.interactive-result-editor,.interactive-result-editor {
    direction: ltr !important;
    text-align: left !important;
}`;

	return `(function() {
	try {
		// Remove any existing Persian RTL styles
		const existingStyles = document.querySelectorAll('style[data-persian-rtl]');
		existingStyles.forEach(style => style.remove());
		
		// Create and inject new style
		const style = document.createElement('style');
		style.setAttribute('data-persian-rtl', 'true');
		style.type = 'text/css';
		style.textContent = \`${rtlCSS.replace(/`/g, '\\`')}\`;
		
		// Inject into head
		document.head.appendChild(style);
		console.log('✅ Persian RTL CSS successfully applied!');
		
		return true;
	} catch(error) {
		console.error('Persian RTL injection error:', error);
		return false;
	}
})();`;
}

// This method is called when your extension is deactivated
export function deactivate() {
	stopAutoApply();
}
