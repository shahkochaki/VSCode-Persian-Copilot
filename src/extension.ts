// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('VSCode Persian Copilot is now active!');
	
	// Show welcome message with automatic CSS injection
	vscode.window.showInformationMessage(
		'🎉 VSCode Persian Copilot فعال شد!',
		'اعمال CSS خودکار',
		'کپی Script'
	).then(selection => {
		if (selection === 'اعمال CSS خودکار') {
			// Open DevTools and show instructions
			vscode.commands.executeCommand('workbench.action.toggleDevTools');
			
			// Copy the script to clipboard
			const script = getCSSInjectionScript();
			vscode.env.clipboard.writeText(script);
			
			// Show clear instructions
			vscode.window.showInformationMessage(
				'✅ Script کپی شد! در DevTools Console:\n1. allow pasting تایپ کنید\n2. Ctrl+V کنید\n3. Enter بزنید',
				'باشه'
			);
		} else if (selection === 'کپی Script') {
			const script = getCSSInjectionScript();
			vscode.env.clipboard.writeText(script);
			vscode.window.showInformationMessage('✅ CSS Script کپی شد! در DevTools Console paste کنید.');
		}
	});

	// Register manual command
	const disposableRTL = vscode.commands.registerCommand('vscode-persian-copilot.applyChatRTL', () => {
		const script = getCSSInjectionScript();
		vscode.env.clipboard.writeText(script);
		
		vscode.window.showInformationMessage(
			'✅ CSS Script آماده! مراحل:\n1. F12 (DevTools)\n2. Console tab\n3. Ctrl+V\n4. Enter',
			'باز کردن DevTools'
		).then(selection => {
			if (selection === 'باز کردن DevTools') {
				vscode.commands.executeCommand('workbench.action.toggleDevTools');
			}
		});
	});

	context.subscriptions.push(disposableRTL);
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
export function deactivate() {}
