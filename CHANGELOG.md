# Change Log

All notable changes to the "vscode-persian-copilot" extension will be documented in this file.

## [1.4.0] - 2025-08-12

### Enhanced
- 🔥 **JSON Parser Complete Redesign**: Next.js-style modern interface with two-column layout
- 🌳 **Tree View Default**: Professional JSON tree visualization as default view mode
- 🔍 **Advanced Search**: Real-time search with highlighting across JSON structure
- 📁 **File Operations**: Import JSON files and export formatted results
- 🎨 **Better Tooltips**: Fixed positioning and improved visual design
- ⚡ **Real-time Processing**: Instant JSON validation and formatting
- 📊 **Smart Analytics**: Key count, file size, and detailed status reporting
- 🎭 **Modern Animations**: Smooth transitions and professional card effects

### Fixed
- ✅ **Calendar Months**: Gregorian months now display in English (January, February, etc.)
- ✅ **Hub Animations**: Enhanced icon effects with float, pulse, rotate, bounce, swing, glow
- ✅ **Tooltip Overflow**: Fixed tooltip positioning to appear above elements properly
- ✅ **Tree View Navigation**: Collapsible JSON objects for better large data handling

### Technical Improvements
- Material Icons integration for consistent UI
- Enhanced CSS with better color schemes and gradients
- Improved responsive design for mobile and desktop
- Better accessibility and keyboard navigation support

## [0.0.1] - 2024-12-28

### Added
- Initial release of VSCode Persian Copilot
- RTL support for chat interface with `.interactive-item-container` targeting
- Vazirmatn Google Fonts integration for beautiful Persian text rendering
- Automatic CSS injection when extension activates
- Manual command "Apply Persian RTL to Chat Interface" for on-demand application
- Developer Tools console injection method for manual CSS application
- Complete RTL styling with `direction: rtl` and `text-align: right`
- Font family override with Vazirmatn as primary Persian font

### Features
- **Persian RTL Chat**: Transforms VS Code chat interface to support right-to-left Persian text
- **Beautiful Typography**: Uses Vazirmatn font for optimal Persian text readability
- **Easy Application**: Automatic activation and manual command options
- **Developer-Friendly**: Includes console injection method for power users

## [1.3.1] - 2025-08-10

### Changed
- حذف فونت فارسی از CSS افزونه (سازگاری بیشتر)
- افزودن margin fix برای کد بلاک‌ها:
  ```css
  .interactive-item-container .value .rendered-markdown ul .interactive-result-code-block {
      margin-right: -24px !important;
      margin-left: 0;
  }
  ```