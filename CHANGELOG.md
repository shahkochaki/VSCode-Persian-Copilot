# Change Log

All notable changes to the "vscode-persian-copilot" extension will be documented in this file.

## [1.11.0] - 2025-10-15

## [1.11.3] - 2025-12-09

### 🐛 Bug Fix

- Small fix: added layout tweak for code blocks to avoid overlap in some views:

  ```css
  .interactive-result-code-block.no-vulns {
      right: -60px;
  }
  ```

- Reduced verbose console logging in the CSS injection script to avoid noisy DevTools output.


### 🆕 Major New Features

- **📝 TODO Manager**: Complete task management system with authentication
  - Add, edit, complete, and delete TODO items
  - Priority levels (High, Medium, Low) with visual indicators
  - Task statistics and completion tracking
  - Advanced filtering by status and priority
  - Modern Persian RTL-optimized interface
  - Full API integration with backend services
  - Authentication required for secure access

### 🏗️ Technical Improvements

- **📁 Modular File Structure**:
  - Separated TODO styles into `assets/css/todo.css`
  - Separated TODO logic into `assets/js/todo.js`
  - Clean HTML structure with external asset references
- **🔧 Enhanced Build Process**:
  - Added services compilation to esbuild pipeline
  - Improved asset URI handling for webviews
  - Better error handling and module resolution

### 🛠️ Bug Fixes

- Fixed CSS and JavaScript loading issues in webviews
- Resolved "Cannot find module" errors for service files
- Enhanced webview resource loading with proper localResourceRoots

## [1.10.0] - 2025-10-15

### ♻️ Code Architecture Refactoring

- **🏗️ Modular Structure**: Complete separation of concerns
  - Created `assets/css/` and `assets/js/` directories
  - Separated common styles (`common.css`) from feature-specific styles (`cheatSheet.css`)
  - Separated common utilities (`common.js`) from feature logic (`cheatSheet.js`)
  - Reduced HTML file size from 1946 to 220 lines (88% reduction)

### ✨ CheatSheet Enhancements

- **🔐 Authentication Fixes**:

  - Fixed ownership detection using correct `user.uuid` field
  - "Add Item" button now properly displays for cheat sheet owners
  - Improved user data structure handling

- **📊 Smart Display**:

  - Personal cheat sheets now display automatically on initial load
  - Enhanced filter behavior:
    - "All": Shows public + user's private cheat sheets
    - "Public": Shows only public cheat sheets
    - "My Cheat Sheets": Shows only user's private cheat sheets

- **🎨 UI Improvements**:
  - Added scrollable modals with `max-height: 90vh`
  - Better handling of large forms and content
  - Improved modal positioning

### 🔧 Technical Improvements

- Proper `webview.asWebviewUri()` usage for external resources
- Fixed variable conflicts in JavaScript modules
- Enhanced message passing between extension and webview
- Better code organization and maintainability

## [1.9.1] - 2025-09-27

### 📖 Documentation & Community

- **📚 Enhanced README**: Comprehensive documentation update

  - Updated CheatSheets section with latest v1.9.0 features
  - Added detailed feature descriptions and technical specifications
  - Improved visual hierarchy and readability

- **🤝 Community Recognition**: Contributors acknowledgment

  - Special thanks to [@danyal031](https://github.com/danyal031) for forking the project
  - Added comprehensive contributors section
  - Guidelines for community contributions
  - Recognition of Persian developer community support

- **🎯 Feature Highlights**: Better presentation of key features
  - Advanced CheatSheets Management System
  - Complete Laravel backend integration
  - Item management with CRUD operations
  - Modern UI/UX improvements

## [1.9.0] - 2025-09-27

### 🚀 Major Enhancement: Advanced CheatSheets Management System

- **🔧 Complete Laravel Backend Integration**: Full integration with Laravel CheatSheet Controller

  - Updated API endpoints to match Laravel controller routes (`/cheat-sheets`)
  - Proper HTTP methods mapping (GET, POST, PUT, DELETE)
  - Enhanced authentication with Bearer token support
  - Improved error handling and response processing

- **📝 Advanced Item Management**: Full CRUD operations for cheat sheet items

  - Add, edit, and delete items within cheat sheets
  - Support for code examples with syntax highlighting
  - Item ordering and categorization system
  - Rich text content support for descriptions

- **🎨 Enhanced User Interface**: Improved UI/UX for better user experience

  - New modal dialogs for item management
  - Owner-specific action buttons (edit/delete)
  - Better visual feedback with toast notifications
  - Responsive design for mobile and desktop
  - Enhanced owner information display

- **🔒 Improved Access Control**: Better permission handling

  - Precise owner detection for cheat sheets and items
  - Guest user limitations with clear messaging
  - Protected operations with authentication checks
  - Public vs private cheat sheet visibility controls

- **⚡ Performance & Reliability**: System optimizations
  - Better API error handling and retry mechanisms
  - Optimized data loading and caching
  - Improved search and filter functionality
  - Enhanced keyboard navigation and shortcuts

## [1.8.5] - 2025-09-25

### ✨ Improvements

- **📚 CheatSheets Simplified Experience**: Streamlined CheatSheets functionality
  - Removed all login page redirections for cleaner UX
  - Simple information message for guest users
  - Authentication handled seamlessly in background
  - Users can view public cheat sheets without login
  - Login-required features show appropriate feedback messages
  - Matches hub.html authentication pattern exactly

## [1.8.4] - 2025-09-24

### 🔧 Bug Fixes

- **📚 CheatSheets Authentication**: Fixed authentication system in CheatSheets
  - Simplified authentication to match Hub.html behavior exactly
  - Removed complex AuthenticationManager class
  - Direct integration with VS Code API for user data
  - Fixed login state detection and UI updates

## [1.8.3] - 2025-09-24

### 🔧 Improvements

- **📚 CheatSheets Authentication Flow**: Simplified authentication flow in CheatSheets
  - Removed duplicate login/register functionality from CheatSheets page
  - Users are now redirected to Hub page for all authentication needs
  - Simplified UI focused on core CheatSheet functionality
  - Better integration between Hub and CheatSheets components

## [1.8.0] - 2025-09-24

### 🚀 Major Feature: Personal CheatSheets Hub

- **🔐 User Authentication System**: Complete login/registration functionality

  - Secure JWT token-based authentication
  - Seamless integration with existing helpix.app user system
  - Automatic session management and token persistence
  - User-friendly modal dialogs for login/register

- **📝 Personal CheatSheets Management**: Full CRUD operations for personal cheat sheets

  - Create, edit, and delete custom cheat sheets
  - Public/private visibility settings
  - Rich content support with code examples
  - Order management for cheat sheet items

- **🎯 Smart Content Filtering**: Advanced filtering and search capabilities
  - View public cheat sheets (unauthenticated users)
  - View public + personal cheat sheets (authenticated users)
  - Filter by category and search by title/content
  - Real-time filtering with responsive UI

### 🛠️ Technical Architecture

- **Service-Oriented Design**: Modular service architecture

  - `CheatSheetService.js`: Complete API integration for cheat sheet management
  - `AuthenticationManager.js`: Comprehensive authentication handling
  - Clean separation of concerns with reusable components

- **API Integration**: Full Laravel backend compatibility
  - RESTful API endpoints for all CRUD operations
  - Proper authentication headers and error handling
  - Support for pagination and advanced queries
  - Seamless token management across sessions

### 🎨 Enhanced User Experience

- **Responsive UI Components**: Modern, accessible interface design

  - Authentication bar with user status display
  - Modal dialogs for forms and user interactions
  - Toast notifications for user feedback
  - Keyboard shortcuts (ESC to close modals/details)

- **Smart State Management**: Intelligent UI state handling
  - Automatic login state detection
  - Dynamic menu visibility based on authentication
  - Seamless transitions between authenticated/unauthenticated states
  - Persistent user preferences and settings

### 📚 Comprehensive Documentation

- **Developer Guide**: Complete implementation documentation
  - Service usage examples and API documentation
  - Authentication flow diagrams and best practices
  - Security considerations and implementation notes
  - Troubleshooting and debugging guidelines

---

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
