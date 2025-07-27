# VSCode Persian Copilot

![Version](https://img.shields.io/badge/version-0.1.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)

VSCode Persian Copilot extension provides RTL (Right-to-Left) support for Persian/Farsi text in Visual Studio Code chat interface.

## 🌟 Features

- **🔄 RTL Chat Interface**: Automatically applies RTL direction to chat interface elements
- **📝 Easy CSS Injection**: Simple CSS injection for markdown elements  
- **⚡ Manual Control**: Command to manually apply RTL styles when needed
- **🇮🇷 Persian Support**: Optimized for Persian/Farsi text reading experience

## 📦 Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "VSCode Persian Copilot"
4. Click Install

## 🚀 Usage

### Automatic Application
1. Install the extension
2. VS Code will show a welcome message
3. Click "اعمال CSS خودکار" to apply RTL styles

### Manual Application  
1. Use Command Palette (`Ctrl+Shift+P`)
2. Search for "Apply Persian RTL to Chat Interface"
3. Follow the instructions to inject CSS via DevTools

## CSS Applied

The extension applies the following CSS to make chat interface RTL:

```css
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap');

.interactive-item-container .value .rendered-markdown:not(.progress-step,.interactive-result-editor) {
	direction: rtl;
	text-align: right !important;
	font-family: "Vazirmatn", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}

.interactive-item-container .chat-tool-invocation-part {
	direction: ltr !important;
	text-align: right !important;
	font-family: inherit !important;
}
```

## Manual CSS Injection

If needed, you can manually inject the CSS using VS Code Developer Tools Console:

1. Open Developer Tools (`Help > Toggle Developer Tools`)
2. Go to Console tab
3. Run this command:

```javascript
const style = document.createElement('style');
style.textContent = `
.rendered-markdown:not(.progress-step,.interactive-result-editor) {
    direction: rtl;
    text-align: right !important;
    font-family: "Vazirmatn", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}
.rendered-markdown .progress-step,.interactive-result-editor {
    direction: ltr !important;
    text-align: right !important;
    font-family: inherit !important;
}`;
document.head.appendChild(style);
```
    direction: rtl;
    text-align: right !important;
    font-family: "Vazirmatn", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}
.rendered-markdown .progress-step,.interactive-result-editor {
    direction: ltr !important;
    text-align: right !important;
    font-family: inherit !important;
}`;
document.head.appendChild(style);
```

## Requirements

- Visual Studio Code 1.102.0 or higher

## Extension Settings

This extension contributes the following commands:

- `vscode-persian-copilot.applyChatRTL`: Apply Persian RTL to Chat Interface

## Known Issues

- CSS injection works best when applied through VS Code Developer Tools Console
- Some UI elements may require page refresh to fully apply RTL styles

## Release Notes

### 0.1.1

Latest release with improved CSS selectors and better RTL support.

### 0.0.1

Initial release of VSCode Persian Copilot with RTL support for chat interface.

## 👨‍💻 Author

**Ali Shahkochaki**
- GitHub: [@shahkochaki](https://github.com/shahkochaki)
- Email: ali.shahkochaki7@gmail.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Enjoy using Persian text in VS Code with proper RTL support!** 🇮🇷
