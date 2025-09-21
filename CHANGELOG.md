# Change Log

All notable changes to the "vscode-persian-copilot" extension will be documented in this file.

## [1.7.0] - 2025-09-21

### ✨ New Features

- **🆕 Cheat Sheets Hub**: Added comprehensive cheat sheets service with API integration
  - Browse and view developer cheat sheets from curated collection
  - Clean, responsive card-based interface for easy navigation
  - Code examples with one-click copy functionality
  - Real-time data from console.helpix.app API
  - Support for multiple programming languages and frameworks

### 🎨 Design Improvements

- **Enhanced UI/UX**: Modern, clean design matching VS Code's native interface
- **Professional Styling**: Consistent typography using Vazirmatn font family
- **Responsive Layout**: Optimized for different screen sizes and VS Code themes
- **Keyboard Navigation**: Added Escape key support for better accessibility

### 🔧 Technical Enhancements

- **API Integration**: Seamless integration with external cheat sheets API
- **Error Handling**: Robust error handling with user-friendly messages
- **Loading States**: Smooth loading animations and state management
- **Code Safety**: Proper HTML escaping and input sanitization

### 📋 Extension Updates

- **New Command**: Added `vscode-persian-copilot.cheatSheet` command
- **Configuration**: Added `enableCheatSheet` setting for tool toggle
- **Menu Integration**: Cheat sheets accessible from command palette and activity bar

---

## [1.6.4] - 2025-09-18

### ✨ New Features

- **Enhanced JSON Parser**: Implemented feature X with significant performance optimizations
- **Comprehensive Documentation**: Added detailed readme.html with responsive design, installation instructions, and feature showcase

### 🔧 Technical Improvements

- **Performance Optimizations**: Enhanced user experience with improved response times
- **Dependency Cleanup**: Removed @vscode/vsce dependency to reduce package size
- **JSON Processing**: Enhanced JSON parser with advanced features and better error handling

### 📝 Documentation

- **User Guide**: Added comprehensive HTML readme with detailed feature descriptions
- **Installation Instructions**: Clear step-by-step setup guide for users
- **Feature Showcase**: Visual demonstrations of all Persian tools and RTL capabilities

---

## [1.5.2] - 2025-08-17

### 🔧 Bug Fixes

- **Calendar Day Alignment**: Fixed Persian calendar grid alignment - days now start on correct weekdays
- **Hub User Info Updates**: Fixed automatic user data refresh in hub interface
- **Month Start Position**: Corrected calculation for first day of month display in calendar widget

### 🎯 Technical Improvements

- Improved calendar date conversion algorithm accuracy
- Enhanced webview data synchronization for real-time user info updates
- Optimized Persian calendar rendering for better visual alignment

---

## [1.5.1] - 2025-08-17 ✨

### 🗓️ Enhanced Persian Calendar Widget

- **Interactive Calendar Grid**: Beautiful monthly calendar with clickable Persian dates
- **Smart Date Selection**: Click any date to automatically convert and fill forms
- **Today Highlighting**: Special animated styling for current date with pulse effect
- **Selected Date Indicator**: Green highlighting with checkmark for chosen dates
- **Month Navigation**: Easy navigation between months with arrow buttons
- **Gregorian Month Fix**: All Gregorian months now display in English (August, not اوت)
- **Improved Visual Design**: Modern gradient backgrounds and smooth animations
- **Enhanced Date Display**: Beautiful today section with star icon and inspiring messages

### 🎨 UI/UX Improvements

- **Visual Feedback**: Better highlighting and selection states
- **Responsive Design**: Optimized for different screen sizes
- **Animation Effects**: Smooth transitions and engaging micro-interactions
- **Better Typography**: Improved readability and text hierarchy

### 🔧 Bug Fixes

- Fixed Persian months display inconsistency in various components
- Resolved template literal compatibility issues
- Improved date conversion accuracy
- Enhanced calendar initialization reliability

## [1.6.0] - Coming Soon 🚀

### 📝 Persian ToDo Manager (Upcoming)

- **Smart Task Organization**: Create, manage, and organize Persian tasks with priority levels
- **Persian Calendar Integration**: Set deadlines using Persian dates with smart reminders
- **Tag System**: Organize tasks with Persian labels and categories
- **Visual Dashboard**: Beautiful progress tracking with charts and analytics
- **Time Tracking**: Built-in timer for tasks with productivity reports
- **Cross-Device Sync**: Access your tasks across multiple VS Code instances
- **Notification System**: Smart reminders based on Persian calendar

### 📚 Developer Cheat Sheets Hub (Upcoming)

- **Quick Reference Cards**: Instant access to syntax and commands in Persian
- **CSS RTL Properties**: Comprehensive guide for right-to-left styling
- **Web Development**: HTML, CSS, JavaScript references in Persian
- **Python Cheat Sheets**: Complete Python reference with Persian explanations
- **React & Frontend**: Modern framework guides and best practices
- **Database Queries**: SQL and NoSQL reference cards
- **Terminal Commands**: Linux, Windows, and Git command references
- **Algorithm Templates**: Common algorithms and data structures with Persian comments

### 🎯 Enhanced Integration

- **Smart Search**: Find cheat sheets and todos with Persian keyword search
- **Context-Aware Suggestions**: Relevant cheat sheets based on current file type
- **Export Functions**: Export todos and cheat sheets for offline use

---

## [1.5.0] - 2025-08-16

### 🔐 New Authentication System

- **User Login Integration**: Complete OAuth login system with mobile OTP verification
- **Helpix.app API Integration**: Advanced IP lookup features for authenticated users
- **Secure Token Management**: User data stored securely in extension global state
- **Hub User Interface**: Login status display with user profile in Persian Tools Hub

### 🚀 Enhanced Features

- **Advanced IP Details**: Premium API access for authenticated users with threat analysis
- **User Profile Management**: Display user name, mobile, credit balance, and status
- **Smart API Switching**: Automatic fallback to free API for non-authenticated users
- **Login Webview**: Beautiful Persian login interface with OTP verification flow

### 🎨 UI/UX Improvements

- **User Card Interface**: Professional user profile display in hub
- **Login Prompt**: Elegant call-to-action for non-authenticated users
- **Status Indicators**: Clear visual feedback for authentication status
- **Responsive Design**: Mobile-friendly login and user interface

### 🔧 Technical Enhancements

- **VSCode API Integration**: Seamless communication between webviews and extension
- **Global State Management**: Persistent user data across VS Code sessions
- **Message Handling**: Robust webview-to-extension communication system
- **Context Management**: User context passed to all relevant tools

### 🛡️ Security Features

- **Token-based Authentication**: Secure JWT token management
- **Session Persistence**: Automatic login state restoration
- **Secure Storage**: Extension global state for sensitive user data
- **API Integration**: RESTful API communication with error handling

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
  .interactive-item-container
    .value
    .rendered-markdown
    ul
    .interactive-result-code-block {
    margin-right: -24px !important;
    margin-left: 0;
  }
  ```
