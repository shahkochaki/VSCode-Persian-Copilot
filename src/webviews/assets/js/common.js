/**
 * Common JavaScript Functions
 * توابع مشترک برای همه webview ها
 */

// VS Code API - باید در هر صفحه فراخوانی شود
const vscode = acquireVsCodeApi();

/**
 * نمایش پیام Toast
 * @param {string} message - متن پیام
 * @param {string} type - نوع پیام: 'success', 'error', 'info'
 */
function showMessage(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  const toastStyles = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${
      type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#007acc"
    };
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    z-index: 10000;
    max-width: 300px;
    word-wrap: break-word;
    animation: slideIn 0.3s ease-out;
  `;

  toast.style.cssText = toastStyles;
  document.body.appendChild(toast);

  // Add slide-in animation
  if (!document.getElementById("toast-styles")) {
    const style = document.createElement("style");
    style.id = "toast-styles";
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 4000);
}

/**
 * Escape HTML برای جلوگیری از XSS
 * @param {string} text - متن ورودی
 * @returns {string} متن ایمن
 */
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * باز کردن مودال
 * @param {string} modalId - شناسه مودال
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";

    // Clear form errors
    const errorElements = modal.querySelectorAll(".error-message");
    errorElements.forEach((el) => (el.style.display = "none"));
  }
}

/**
 * بستن مودال
 * @param {string} modalId - شناسه مودال
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

/**
 * بستن مودال‌ها با کلید Escape
 */
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (modal.style.display === "block") {
        modal.style.display = "none";
      }
    });
  }
});

/**
 * درخواست داده کاربر از extension
 */
function requestUserData() {
  vscode.postMessage({
    command: "getUserData",
  });
}

/**
 * باز کردن ابزار دیگر
 * @param {string} tool - نام ابزار
 */
function openTool(tool) {
  vscode.postMessage({
    command: "openTool",
    tool: tool,
  });
}

/**
 * باز کردن لینک خارجی
 * @param {string} url - آدرس URL
 */
function openExternal(url) {
  vscode.postMessage({
    command: "openExternal",
    url: url,
  });
}

/**
 * کپی کردن متن به کلیپبورد
 * @param {string} text - متن برای کپی
 * @param {string} successMessage - پیام موفقیت
 */
async function copyToClipboard(text, successMessage = "کپی شد!") {
  try {
    await navigator.clipboard.writeText(text);
    showMessage(successMessage, "success");
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    showMessage("خطا در کپی کردن", "error");
  }
}

/**
 * فرمت کردن تاریخ فارسی
 * @param {string|Date} date - تاریخ
 * @returns {string} تاریخ فرمت شده
 */
function formatPersianDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/**
 * فرمت کردن عدد فارسی
 * @param {number} number - عدد
 * @returns {string} عدد فرمت شده
 */
function formatPersianNumber(number) {
  if (number === null || number === undefined) return "";
  return number.toLocaleString("fa-IR");
}

/**
 * Debounce برای محدود کردن فراخوانی توابع
 * @param {Function} func - تابع
 * @param {number} wait - زمان انتظار (میلی‌ثانیه)
 * @returns {Function}
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * بررسی خالی بودن شیء
 * @param {Object} obj - شیء
 * @returns {boolean}
 */
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * کلاس سرویس پایه برای API
 */
class BaseApiService {
  constructor(baseUrl = "https://console.helpix.app/api/v1") {
    this.baseUrl = baseUrl;
  }

  getHeaders(token = null) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  async makeRequest(url, options = {}, token = null) {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        headers: {
          ...this.getHeaders(token),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }
}

// Export برای استفاده در سایر فایل‌ها
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    showMessage,
    escapeHtml,
    openModal,
    closeModal,
    requestUserData,
    openTool,
    openExternal,
    copyToClipboard,
    formatPersianDate,
    formatPersianNumber,
    debounce,
    isEmpty,
    BaseApiService,
  };
}
