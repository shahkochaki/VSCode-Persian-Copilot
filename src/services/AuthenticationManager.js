/**
 * Authentication Manager برای مدیریت ورود و خروج کاربران
 */
class AuthenticationManager {
  constructor() {
    this.baseUrl = "https://console.helpix.app/api/v1"; // آدرس API اصلی
    this.token = this.getStoredToken();
    this.user = this.getStoredUser();
    this.onAuthStateChangeCallbacks = [];
  }

  /**
   * تنظیم آدرس API
   */
  setApiUrl(url) {
    this.baseUrl = url;
  }

  /**
   * دریافت توکن ذخیره شده
   */
  getStoredToken() {
    const userData = localStorage.getItem("helpix_user_data");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        return parsedData.token;
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
    return null;
  }

  /**
   * دریافت اطلاعات کاربر ذخیره شده
   */
  getStoredUser() {
    const userData = localStorage.getItem("helpix_user_data");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        return parsedData.user;
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
    return null;
  }

  /**
   * ذخیره توکن و اطلاعات کاربر
   */
  storeAuthData(token, user) {
    this.token = token;
    this.user = user;

    // ذخیره در فرمت مشابه login.html
    const userData = {
      token: token,
      user: user,
    };

    localStorage.setItem("helpix_user_data", JSON.stringify(userData));
    this.notifyAuthStateChange(true);
  }

  /**
   * پاک کردن اطلاعات احراز هویت
   */
  clearAuthData() {
    this.token = null;
    this.user = null;
    localStorage.removeItem("helpix_user_data");
    this.notifyAuthStateChange(false);
  }

  /**
   * بررسی وضعیت لاگین
   */
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  /**
   * دریافت کاربر فعلی
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * دریافت توکن فعلی
   */
  getToken() {
    return this.token;
  }

  /**
   * Headers برای درخواست‌های API
   */
  getAuthHeaders() {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * درخواست HTTP عمومی
   */
  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // اگر توکن منقضی شده باشد
        if (response.status === 401) {
          this.clearAuthData();
        }
        throw new Error(data.message || `خطا: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("Authentication Request Error:", error);
      throw error;
    }
  }

  /**
   * ورود کاربر
   * @param {string} email - ایمیل کاربر
   * @param {string} password - رمز عبور
   */
  async login(email, password) {
    try {
      const response = await this.makeRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response.success && response.data.token) {
        this.storeAuthData(response.data.token, response.data.user);
        return {
          success: true,
          user: response.data.user,
          message: "با موفقیت وارد شدید",
        };
      } else {
        throw new Error(response.message || "خطا در ورود به سیستم");
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * ثبت‌نام کاربر جدید
   * @param {Object} userData - اطلاعات کاربر
   */
  async register(userData) {
    try {
      const response = await this.makeRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      if (response.success && response.data.token) {
        this.storeAuthData(response.data.token, response.data.user);
        return {
          success: true,
          user: response.data.user,
          message: "حساب کاربری با موفقیت ایجاد شد",
        };
      } else {
        throw new Error(response.message || "خطا در ایجاد حساب کاربری");
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * خروج کاربر از سیستم
   */
  async logout() {
    try {
      if (this.token) {
        await this.makeRequest("/auth/logout", {
          method: "POST",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearAuthData();
      return {
        success: true,
        message: "با موفقیت خارج شدید",
      };
    }
  }

  /**
   * تازه‌سازی توکن
   */
  async refreshToken() {
    try {
      const response = await this.makeRequest("/auth/refresh", {
        method: "POST",
      });

      if (response.success && response.data.token) {
        this.storeAuthData(response.data.token, response.data.user);
        return true;
      } else {
        this.clearAuthData();
        return false;
      }
    } catch (error) {
      this.clearAuthData();
      return false;
    }
  }

  /**
   * بررسی وضعیت کاربر فعلی
   */
  async checkAuthStatus() {
    if (!this.token) {
      return false;
    }

    try {
      const response = await this.makeRequest("/auth/me");
      if (response.success && response.data) {
        this.user = response.data;
        localStorage.setItem("cheatsheet_user", JSON.stringify(this.user));
        return true;
      } else {
        this.clearAuthData();
        return false;
      }
    } catch (error) {
      this.clearAuthData();
      return false;
    }
  }

  /**
   * اضافه کردن callback برای تغییر وضعیت احراز هویت
   */
  onAuthStateChange(callback) {
    this.onAuthStateChangeCallbacks.push(callback);
  }

  /**
   * حذف callback
   */
  removeAuthStateChangeListener(callback) {
    const index = this.onAuthStateChangeCallbacks.indexOf(callback);
    if (index > -1) {
      this.onAuthStateChangeCallbacks.splice(index, 1);
    }
  }

  /**
   * اطلاع‌رسانی تغییر وضعیت احراز هویت
   */
  notifyAuthStateChange(isAuthenticated) {
    this.onAuthStateChangeCallbacks.forEach((callback) => {
      try {
        callback(isAuthenticated, this.user);
      } catch (error) {
        console.error("Auth state change callback error:", error);
      }
    });
  }

  /**
   * بروزرسانی اطلاعات کاربر
   */
  async updateProfile(userData) {
    try {
      const response = await this.makeRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(userData),
      });

      if (response.success && response.data) {
        this.user = response.data;
        localStorage.setItem("cheatsheet_user", JSON.stringify(this.user));
        return {
          success: true,
          user: response.data,
          message: "پروفایل با موفقیت بروزرسانی شد",
        };
      } else {
        throw new Error(response.message || "خطا در بروزرسانی پروفایل");
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * تغییر رمز عبور
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await this.makeRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      return {
        success: response.success,
        message: response.message || "رمز عبور با موفقیت تغییر کرد",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

// ایجاد instance سراسری
const authManager = new AuthenticationManager();
