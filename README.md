# VSCode Persian Copilot

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

VSCode Persian Copilot extension provides **automatic** RTL (Right-to-Left) support for Persian/Farsi text in Visual Studio Code chat interface.

## 🌟 Features

- **� Automatic RTL Application**: CSS automatically applies when VS Code starts (no manual steps needed!)
- **� Smart Auto-Refresh**: Reapplies styles every 30 seconds to handle dynamic content
- **⚡ Manual Control**: Toggle auto-apply on/off anytime
- **🇮🇷 Persian Support**: Optimized for Persian/Farsi text reading experience
- **💾 Remembers Settings**: Your preference is saved between VS Code sessions

## 📦 Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "VSCode Persian Copilot"
4. Click Install

## 🚀 Usage

### ✨ Automatic (Recommended)
Extension works automatically after installation! CSS is applied when VS Code starts and refreshes automatically.

### Manual Control Commands
- **Command Palette** (`Ctrl+Shift+P`):
  - `اعمال CSS فارسی به چت` - Apply CSS once
  - `تغییر حالت اعمال خودکار` - Toggle auto-apply
  - `حذف CSS فارسی` - Remove CSS

### Settings
- **Persian Copilot: Auto Apply** - Control automatic CSS application

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

### 1.0.0 - Major Update! 🎉

**اتوماتیک شدن کامل!** دیگر نیازی به DevTools نیست:
- ✨ **Auto-Apply CSS**: CSS خودکار اعمال می‌شود
- 🔄 **Smart Refresh**: هر 30 ثانیه خودکار تجدید می‌شود  
- 💾 **Save Settings**: تنظیمات ذخیره می‌شود
- 📋 **New Commands**: کنترل کامل از Command Palette
- 🚫 **No More DevTools**: دیگر نیازی به کپی پیست نیست!

### 0.1.1

Latest release with improved CSS selectors and better RTL support.

### 0.0.1

Initial release of VSCode Persian Copilot with RTL support for chat interface.

## 👨‍💻 Author

**Ali Shahkochaki**
- GitHub: [@shahkochaki](https://github.com/shahkochaki)
- Email: shahkochaki@hotmail.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Enjoy using Persian text in VS Code with proper RTL support!** 🇮🇷
