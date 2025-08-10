# Change Log

All notable changes to the "vscode-persian-copilot" extension will be documented in this file.

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