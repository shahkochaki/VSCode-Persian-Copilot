import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

let isAutoApplyEnabled = true;
let cssInjectionInterval: NodeJS.Timeout | undefined;

// User management globals
interface UserData {
  token: string;
  user: {
    uuid: number;
    role: string;
    group: string;
    financial: {
      credit: number;
    };
    data: {
      firstName: string;
      lastName: string;
      email: string;
      mobile: string;
    };
  };
}

let currentUser: UserData | null = null;
let hubWebviewProvider: vscode.WebviewViewProvider | null = null;

export function activate(context: vscode.ExtensionContext) {
  // --- Initialize user data ---
  loadUserData(context);

  // --- Read settings ---
  const config = getPersianCopilotConfig();

  // Tools enable/disable
  const enableTools = {
    numberConvert: config.get("enableNumberConvert", true),
    calendar: config.get("enableCalendar", true),
    arabicToPersian: config.get("enableArabicToPersian", true),
    lorem: config.get("enableLorem", true),
    moneyConvert: config.get("enableMoneyConvert", true),
    numberToWords: config.get("enableNumberToWords", true),
    ipDetails: config.get("enableIpDetails", true),
    jsonParser: config.get("enableJsonParser", true),
    cheatSheet: config.get("enableCheatSheet", true),
  };
  const showToolsHubIcon = config.get("showToolsHubIcon", true);
  const autoApply = config.get("autoApply", true);
  const showDevToolsGuide = config.get("showDevToolsGuide", true);

  // Persian Tools Hub command
  if (showToolsHubIcon) {
    const disposableToolsHub = vscode.commands.registerCommand(
      "vscode-persian-copilot.openToolsHub",
      () => {
        openToolsHubWebview();
      }
    );
    context.subscriptions.push(disposableToolsHub);
  }

  // Login command
  const disposableLogin = vscode.commands.registerCommand(
    "vscode-persian-copilot.login",
    () => {
      openLoginWebview(context);
    }
  );
  context.subscriptions.push(disposableLogin);

  // Register openLoginPage command for redirecting from tools
  const disposableOpenLoginPage = vscode.commands.registerCommand(
    "extension.openLoginPage",
    () => {
      openLoginWebview(context);
    }
  );
  context.subscriptions.push(disposableOpenLoginPage);

  // Persian Copilot Activity Bar Icon (View Container) - Always register
  const provider = vscode.window.registerWebviewViewProvider(
    "persian-tools-hub",
    {
      resolveWebviewView(webviewView) {
        // Store reference to webview for updates
        hubWebviewProvider = {
          resolveWebviewView: () => {},
          webview: webviewView.webview,
        } as any;

        const htmlPath = path.join(__dirname, "webviews", "hub.html");
        let html = "";
        try {
          html = fs.readFileSync(htmlPath, "utf8");
        } catch (e) {
          html = "<h2>Could not load Persian Tools Hub UI.</h2>";
        }
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = html;

        // Send user data when webview loads
        setTimeout(() => {
          updateHubWebview();
        }, 500);

        // Handle messages from hub webview in Activity Bar
        webviewView.webview.onDidReceiveMessage((message) => {
          switch (message.command) {
            case "openTool":
              switch (message.tool) {
                case "calendar":
                  openSimpleWebview(
                    "calendar",
                    "Persian Calendar",
                    "calendar.html"
                  );
                  break;
                case "jsonParser":
                  openSimpleWebview(
                    "jsonParser",
                    "JSON Parser",
                    "jsonParser.html"
                  );
                  break;
                case "ipDetails":
                  openIpDetailsWebview();
                  break;
                case "numberConvert":
                  openSimpleWebview(
                    "numberConvert",
                    "Number Converter",
                    "numberConvert.html"
                  );
                  break;
                case "arabicToPersian":
                  openSimpleWebview(
                    "arabicToPersian",
                    "Arabic to Persian",
                    "arabicToPersian.html"
                  );
                  break;
                case "lorem":
                  openSimpleWebview(
                    "lorem",
                    "Persian Lorem Ipsum",
                    "lorem.html"
                  );
                  break;
                case "moneyConvert":
                  openSimpleWebview(
                    "moneyConvert",
                    "Money Converter",
                    "moneyConvert.html"
                  );
                  break;
                case "numberToWords":
                  openSimpleWebview(
                    "numberToWords",
                    "Number to Words",
                    "numberToWords.html"
                  );
                  break;
                case "cheatSheet":
                  openSimpleWebview(
                    "cheatSheet",
                    "Cheat Sheets",
                    "cheatSheet.html"
                  );
                  break;
                case "login":
                  openLoginWebview(context);
                  break;
              }
              break;
            case "openExternal":
              vscode.env.openExternal(vscode.Uri.parse(message.url));
              break;
            case "getUserData":
              webviewView.webview.postMessage({
                command: "setUserData",
                data: currentUser,
              });
              break;
          }
        });
      },
    }
  );
  context.subscriptions.push(provider);

  // Register tools commands
  if (enableTools.numberConvert) {
    const disposableNumberConvert = vscode.commands.registerCommand(
      "vscode-persian-copilot.numberConvert",
      () => {
        openSimpleWebview(
          "numberConvert",
          "Number Converter",
          "numberConvert.html"
        );
      }
    );
    context.subscriptions.push(disposableNumberConvert);
  }
  if (enableTools.calendar) {
    const disposableCalendar = vscode.commands.registerCommand(
      "vscode-persian-copilot.calendar",
      () => {
        openSimpleWebview("calendar", "Persian Calendar", "calendar.html");
      }
    );
    context.subscriptions.push(disposableCalendar);
  }
  if (enableTools.arabicToPersian) {
    const disposableArabicToPersian = vscode.commands.registerCommand(
      "vscode-persian-copilot.arabicToPersian",
      () => {
        openSimpleWebview(
          "arabicToPersian",
          "Arabic to Persian",
          "arabicToPersian.html"
        );
      }
    );
    context.subscriptions.push(disposableArabicToPersian);
  }
  if (enableTools.lorem) {
    const disposableLorem = vscode.commands.registerCommand(
      "vscode-persian-copilot.lorem",
      () => {
        openSimpleWebview("lorem", "Persian Lorem Ipsum", "lorem.html");
      }
    );
    context.subscriptions.push(disposableLorem);
  }
  if (enableTools.moneyConvert) {
    const disposableMoneyConvert = vscode.commands.registerCommand(
      "vscode-persian-copilot.moneyConvert",
      () => {
        openSimpleWebview(
          "moneyConvert",
          "Money Converter",
          "moneyConvert.html"
        );
      }
    );
    context.subscriptions.push(disposableMoneyConvert);
  }
  if (enableTools.numberToWords) {
    const disposableNumberToWords = vscode.commands.registerCommand(
      "vscode-persian-copilot.numberToWords",
      () => {
        openSimpleWebview(
          "numberToWords",
          "Number to Persian Words",
          "numberToWords.html"
        );
      }
    );
    context.subscriptions.push(disposableNumberToWords);
  }
  if (enableTools.ipDetails) {
    const disposableIpDetails = vscode.commands.registerCommand(
      "vscode-persian-copilot.ipDetails",
      () => {
        openIpDetailsWebview();
      }
    );
    context.subscriptions.push(disposableIpDetails);
  }
  if (enableTools.jsonParser) {
    const disposableJsonParser = vscode.commands.registerCommand(
      "vscode-persian-copilot.jsonParser",
      () => {
        openSimpleWebview("jsonParser", "JSON Parser", "jsonParser.html");
      }
    );
    context.subscriptions.push(disposableJsonParser);
  }
  if (enableTools.cheatSheet) {
    const disposableCheatSheet = vscode.commands.registerCommand(
      "vscode-persian-copilot.cheatSheet",
      () => {
        openSimpleWebview("cheatSheet", "Cheat Sheets", "cheatSheet.html");
      }
    );
    context.subscriptions.push(disposableCheatSheet);
  }

  // Register always-available commands (CSS/RTL)
  const disposableRTL = vscode.commands.registerCommand(
    "vscode-persian-copilot.applyChatRTL",
    () => {
      applyCSS();
      vscode.window.showInformationMessage(
        "✅ Persian CSS applied successfully!"
      );
    }
  );
  const disposableToggle = vscode.commands.registerCommand(
    "vscode-persian-copilot.toggleAutoApply",
    () => {
      toggleAutoApply(context);
    }
  );
  const disposableDisable = vscode.commands.registerCommand(
    "vscode-persian-copilot.disableCSS",
    () => {
      removeCSS();
      vscode.window.showInformationMessage("❌ Persian CSS removed!");
    }
  );
  const disposableTest = vscode.commands.registerCommand(
    "vscode-persian-copilot.testCSS",
    () => {
      const testScript = `(function() {
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
      vscode.window
        .showInformationMessage(
          "🔍 CSS Test script copied! Paste in DevTools Console to debug",
          "Open DevTools"
        )
        .then((selection) => {
          if (selection === "Open DevTools") {
            vscode.commands.executeCommand("workbench.action.toggleDevTools");
          }
        });
    }
  );

  context.subscriptions.push(
    disposableRTL,
    disposableToggle,
    disposableDisable,
    disposableTest
  );

  // --- CSS/RTL/Guide logic based on settings ---
  isAutoApplyEnabled = autoApply;
  if (isAutoApplyEnabled && showDevToolsGuide) {
    startAutoApply();
  }

  console.log("VSCode Persian Copilot is now active!");
}

// --- Helper Functions ---

function getPersianCopilotConfig(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration("persianCopilot");
}

// Persian number conversion utilities
function convertPersianToEnglish(input: string): string {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const englishDigits = "0123456789";
  let result = input;
  for (let i = 0; i < persianDigits.length; i++) {
    result = result.replace(
      new RegExp(persianDigits[i], "g"),
      englishDigits[i]
    );
  }
  return result;
}

function convertEnglishToPersian(input: string): string {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const englishDigits = "0123456789";
  let result = input;
  for (let i = 0; i < englishDigits.length; i++) {
    result = result.replace(
      new RegExp(englishDigits[i], "g"),
      persianDigits[i]
    );
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
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.join(__dirname, "webviews"))],
    }
  );
  const htmlPath = path.join(__dirname, "webviews", htmlFile);
  let html = "";
  try {
    html = fs.readFileSync(htmlPath, "utf8");

    // Convert relative paths to webview URIs
    const webviewsPath = path.join(__dirname, "webviews");
    html = html.replace(/href="assets\/(css\/[^"]+)"/g, (match, p1) => {
      const assetPath = vscode.Uri.file(path.join(webviewsPath, "assets", p1));
      return `href="${panel.webview.asWebviewUri(assetPath)}"`;
    });
    html = html.replace(/src="assets\/(js\/[^"]+)"/g, (match, p1) => {
      const assetPath = vscode.Uri.file(path.join(webviewsPath, "assets", p1));
      return `src="${panel.webview.asWebviewUri(assetPath)}"`;
    });
  } catch (e) {
    html = `<h2>Could not load ${title}.</h2>`;
  }
  panel.webview.html = html;

  // Handle messages from webview
  panel.webview.onDidReceiveMessage((message) => {
    switch (message.command) {
      case "convertFa2En":
        const englishNum = convertPersianToEnglish(message.value);
        panel.webview.postMessage({
          command: "result",
          result: `English: ${englishNum}`,
        });
        break;
      case "convertEn2Fa":
        const persianNum = convertEnglishToPersian(message.value);
        panel.webview.postMessage({
          command: "result",
          result: `Persian: ${persianNum}`,
        });
        break;
      case "convertDate":
        const convertedDate = convertDate(message.value, message.type);
        panel.webview.postMessage({ command: "result", result: convertedDate });
        break;
      case "openExternal":
        vscode.env.openExternal(vscode.Uri.parse(message.url));
        break;
      case "getUserData":
        // Send current user data to webview
        panel.webview.postMessage({
          command: "setUserData",
          data: currentUser,
        });
        break;
    }
  });
}

// Tools Hub Webview
function openToolsHubWebview() {
  const panel = vscode.window.createWebviewPanel(
    "persianToolsHub",
    "Persian Tools Hub",
    vscode.ViewColumn.One,
    { enableScripts: true }
  );
  const htmlPath = path.join(__dirname, "webviews", "hub.html");
  let html = "";
  try {
    html = fs.readFileSync(htmlPath, "utf8");
  } catch (e) {
    html = "<h2>Could not load Persian Tools Hub UI.</h2>";
  }
  panel.webview.html = html;

  // Handle messages from hub webview
  panel.webview.onDidReceiveMessage((message) => {
    switch (message.command) {
      case "openTool":
        switch (message.tool) {
          case "calendar":
            openSimpleWebview("calendar", "Persian Calendar", "calendar.html");
            break;
          case "numberConvert":
            openSimpleWebview(
              "numberConvert",
              "Number Converter",
              "numberConvert.html"
            );
            break;
          case "arabicToPersian":
            openSimpleWebview(
              "arabicToPersian",
              "Arabic to Persian",
              "arabicToPersian.html"
            );
            break;
          case "lorem":
            openSimpleWebview("lorem", "Persian Lorem Ipsum", "lorem.html");
            break;
          case "moneyConvert":
            openSimpleWebview(
              "moneyConvert",
              "Money Converter",
              "moneyConvert.html"
            );
            break;
          case "numberToWords":
            openSimpleWebview(
              "numberToWords",
              "Number to Words",
              "numberToWords.html"
            );
            break;
          case "cheatSheet":
            openSimpleWebview("cheatSheet", "Cheat Sheets", "cheatSheet.html");
            break;
          case "jsonParser":
            openSimpleWebview("jsonParser", "JSON Parser", "jsonParser.html");
            break;
          case "ipDetails":
            openIpDetailsWebview();
            break;
          case "login":
            openLoginWebview();
            break;
        }
        break;
      case "getUserData":
        panel.webview.postMessage({
          command: "setUserData",
          data: currentUser,
        });
        break;
    }
  });
}

// --- IP Details Webview ---
function openIpDetailsWebview() {
  const panel = vscode.window.createWebviewPanel(
    "ipDetails",
    "IP/URL Details Lookup",
    vscode.ViewColumn.One,
    { enableScripts: true }
  );
  const htmlPath = path.join(__dirname, "webviews", "ipDetails.html");
  let html = "";
  try {
    html = fs.readFileSync(htmlPath, "utf8");
  } catch (e) {
    html = "<h2>Could not load IP Details UI.</h2>";
  }
  panel.webview.html = html;

  panel.webview.onDidReceiveMessage(async (message) => {
    if (message.command === "ipDetailsLookup") {
      const { token, url } = message;
      try {
        const res = await fetch(
          "https://console.helpix.app/api/v1/tools/ip/details",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
          }
        );
        const data = await res.json();
        panel.webview.postMessage({ command: "ipDetailsResult", data });
      } catch (e) {
        panel.webview.postMessage({
          command: "ipDetailsResult",
          error: "Request failed!",
        });
      }
    } else if (message.command === "getUserData") {
      // Send current user data to webview
      panel.webview.postMessage({
        command: "setUserData",
        data: currentUser,
      });
    }
  }, undefined);
}

function startAutoApply() {
  // Show initial setup message only once
  setTimeout(() => {
    vscode.window
      .showInformationMessage(
        '🚀 Persian Copilot is ready! Click "Apply CSS" to activate RTL support.',
        "Apply CSS",
        "Setup Guide"
      )
      .then((selection) => {
        if (selection === "Apply CSS") {
          applyCSS();
        } else if (selection === "Setup Guide") {
          showSetupGuide();
        }
      });
  }, 2000);
}

function showSetupGuide() {
  const panel = vscode.window.createWebviewPanel(
    "persianSetupGuide",
    "Persian Copilot Setup Guide",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
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
  context.globalState.update("autoApplyEnabled", isAutoApplyEnabled);

  if (isAutoApplyEnabled) {
    startAutoApply();
    vscode.window.showInformationMessage(
      "✅ Auto-guide enabled! You'll get helpful reminders."
    );
  } else {
    stopAutoApply();
    vscode.window.showInformationMessage(
      "❌ Auto-guide disabled. Use Command Palette to apply CSS manually."
    );
  }
}

function applyCSS() {
  const script = getCSSInjectionScript();
  vscode.env.clipboard.writeText(script);

  vscode.window
    .showInformationMessage(
      "CSS script copied to clipboard! Please open DevTools (F12) → Console → Paste & Enter",
      "Open DevTools"
    )
    .then((selection) => {
      if (selection === "Open DevTools") {
        vscode.commands.executeCommand("workbench.action.toggleDevTools");
      }
    });
}

function removeCSS() {
  const removeScript = `(function() {
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
  vscode.window
    .showInformationMessage(
      "CSS removal script copied to clipboard! Please open DevTools (F12) → Console → Paste & Enter",
      "Open DevTools"
    )
    .then((selection) => {
      if (selection === "Open DevTools") {
        vscode.commands.executeCommand("workbench.action.toggleDevTools");
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
		style.textContent = ` +
    JSON.stringify(cssContent) +
    `;
		
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

// --- User Management Functions ---

function loadUserData(context: vscode.ExtensionContext) {
  try {
    const userData = context.globalState.get<UserData>("helpix_user_data");
    if (userData && userData.token) {
      currentUser = userData;
      console.log("Loaded user data for:", userData.user.data.firstName);
      updateHubWebview(); // Update hub after loading data
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
}

function saveUserData(context: vscode.ExtensionContext, userData: UserData) {
  try {
    currentUser = userData;
    context.globalState.update("helpix_user_data", userData);
    console.log("Saved user data for:", userData.user.data.firstName);
    updateHubWebview(); // Update hub after saving data
  } catch (error) {
    console.error("Error saving user data:", error);
  }
}

function clearUserData(context: vscode.ExtensionContext) {
  try {
    currentUser = null;
    context.globalState.update("helpix_user_data", undefined);
    console.log("Cleared user data");
    updateHubWebview(); // Update hub after clearing data
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
}

function updateHubWebview() {
  try {
    if (hubWebviewProvider && (hubWebviewProvider as any).webview) {
      (hubWebviewProvider as any).webview.postMessage({
        command: "setUserData",
        data: currentUser,
      });
      console.log("Updated hub webview with user data");
    }
  } catch (error) {
    console.error("Error updating hub webview:", error);
  }
}

function openLoginWebview(context?: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    "persianLogin",
    "ورود به حساب کاربری",
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  const htmlPath = path.join(__dirname, "webviews", "login.html");
  let html = "";
  try {
    html = fs.readFileSync(htmlPath, "utf8");
  } catch (e) {
    html = "<h2>Could not load Login UI.</h2>";
  }
  panel.webview.html = html;

  // Send current user data if available
  if (currentUser) {
    setTimeout(() => {
      panel.webview.postMessage({
        command: "setUserData",
        data: currentUser,
      });
    }, 500);
  }

  // Handle messages from login webview
  panel.webview.onDidReceiveMessage((message) => {
    if (!context) {
      return;
    }

    switch (message.command) {
      case "loginSuccess":
        saveUserData(context, message.data);
        vscode.window.showInformationMessage(
          `خوش آمدید ${message.data.user.data.firstName}!`
        );
        break;
      case "logout":
        clearUserData(context);
        vscode.window.showInformationMessage("با موفقیت خارج شدید");
        break;
      case "saveUserData":
        saveUserData(context, message.data);
        break;
      case "clearUserData":
        clearUserData(context);
        break;
    }
  });
}

// Helper function to get current user
function getCurrentUser(): UserData | null {
  return currentUser;
}

// Helper function to check if user is logged in
function isUserLoggedIn(): boolean {
  return currentUser !== null && currentUser.token !== undefined;
}

// This method is called when your extension is deactivated
export function deactivate() {
  stopAutoApply();
}
