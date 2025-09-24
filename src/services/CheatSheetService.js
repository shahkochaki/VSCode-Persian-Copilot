/**
 * CheatSheet Service برای مدیریت چیت شیت‌های شخصی و عمومی
 * برای کار با Laravel API backend
 */
class CheatSheetService {
  constructor() {
    this.baseUrl = "https://console.helpix.app/api/v1"; // آدرس API اصلی
    this.token = this.getStoredToken();
    this.currentUser = null;
  }

  /**
   * تنظیم توکن احراز هویت
   */
  setAuthToken(token) {
    this.token = token;
    // بروزرسانی localStorage با فرمت موجود
    if (token) {
      const existingData = this.getStoredUserData();
      if (existingData) {
        existingData.token = token;
        localStorage.setItem("helpix_user_data", JSON.stringify(existingData));
      }
    }
  }

  /**
   * دریافت اطلاعات کاربر ذخیره شده
   */
  getStoredUserData() {
    const userData = localStorage.getItem("helpix_user_data");
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
    return null;
  }

  /**
   * دریافت توکن ذخیره شده
   */
  getStoredToken() {
    // استفاده از همان localStorage key که در login.html استفاده میشه
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
   * بررسی وضعیت لاگین کاربر
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Headers پیش‌فرض برای درخواست‌ها
   */
  getHeaders() {
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
   * درخواست عمومی HTTP
   */
  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
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

  /**
   * دریافت لیست چیت شیت‌ها
   * @param {Object} params - پارامترهای جستجو و فیلتر
   */
  async getCheatSheets(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `/cheat-sheets?${queryParams}` : "/cheat-sheets";

    return await this.makeRequest(url);
  }

  /**
   * دریافت جزئیات یک چیت شیت
   * @param {number} id - شناسه چیت شیت
   */
  async getCheatSheet(id) {
    return await this.makeRequest(`/cheat-sheets/${id}`);
  }

  /**
   * ایجاد چیت شیت جدید (فقط برای کاربران لاگین)
   * @param {Object} cheatSheetData - اطلاعات چیت شیت
   */
  async createCheatSheet(cheatSheetData) {
    if (!this.isAuthenticated()) {
      throw new Error("برای ایجاد چیت شیت شخصی باید وارد شوید");
    }

    return await this.makeRequest("/cheat-sheets", {
      method: "POST",
      body: JSON.stringify(cheatSheetData),
    });
  }

  /**
   * بروزرسانی چیت شیت (فقط مالک)
   * @param {number} id - شناسه چیت شیت
   * @param {Object} updateData - اطلاعات بروزرسانی
   */
  async updateCheatSheet(id, updateData) {
    if (!this.isAuthenticated()) {
      throw new Error("برای ویرایش چیت شیت باید وارد شوید");
    }

    return await this.makeRequest(`/cheat-sheets/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  /**
   * حذف چیت شیت (فقط مالک)
   * @param {number} id - شناسه چیت شیت
   */
  async deleteCheatSheet(id) {
    if (!this.isAuthenticated()) {
      throw new Error("برای حذف چیت شیت باید وارد شوید");
    }

    return await this.makeRequest(`/cheat-sheets/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * دریافت آیتم‌های یک چیت شیت
   * @param {number} id - شناسه چیت شیت
   */
  async getCheatSheetItems(id) {
    return await this.makeRequest(`/cheat-sheets/${id}/items`);
  }

  /**
   * اضافه کردن آیتم جدید به چیت شیت (فقط مالک)
   * @param {number} id - شناسه چیت شیت
   * @param {Object} itemData - اطلاعات آیتم
   */
  async addCheatSheetItem(id, itemData) {
    if (!this.isAuthenticated()) {
      throw new Error("برای اضافه کردن آیتم باید وارد شوید");
    }

    return await this.makeRequest(`/cheat-sheets/${id}/items`, {
      method: "POST",
      body: JSON.stringify(itemData),
    });
  }

  /**
   * بروزرسانی آیتم چیت شیت (فقط مالک)
   * @param {number} id - شناسه چیت شیت
   * @param {number} itemId - شناسه آیتم
   * @param {Object} updateData - اطلاعات بروزرسانی
   */
  async updateCheatSheetItem(id, itemId, updateData) {
    if (!this.isAuthenticated()) {
      throw new Error("برای ویرایش آیتم باید وارد شوید");
    }

    return await this.makeRequest(`/cheat-sheets/${id}/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  /**
   * حذف آیتم از چیت شیت (فقط مالک)
   * @param {number} id - شناسه چیت شیت
   * @param {number} itemId - شناسه آیتم
   */
  async deleteCheatSheetItem(id, itemId) {
    if (!this.isAuthenticated()) {
      throw new Error("برای حذف آیتم باید وارد شوید");
    }

    return await this.makeRequest(`/cheat-sheets/${id}/items/${itemId}`, {
      method: "DELETE",
    });
  }

  /**
   * جستجوی چیت شیت‌ها
   * @param {string} searchTerm - عبارت جستجو
   * @param {Object} filters - فیلترهای اضافی
   */
  async searchCheatSheets(searchTerm, filters = {}) {
    const params = {
      search: searchTerm,
      ...filters,
    };

    return await this.getCheatSheets(params);
  }

  /**
   * فیلتر بر اساس دسته‌بندی
   * @param {string} category - دسته‌بندی
   */
  async getCheatSheetsByCategory(category) {
    return await this.getCheatSheets({ category });
  }

  /**
   * دریافت چیت شیت‌های خودی کاربر (فقط کاربران لاگین)
   */
  async getMyCheatSheets() {
    if (!this.isAuthenticated()) {
      throw new Error("برای دریافت چیت شیت‌های شخصی باید وارد شوید");
    }

    return await this.getCheatSheets({ owner: "me" });
  }

  /**
   * خروج کاربر از سیستم
   */
  logout() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem("helpix_user_data");
  }

  /**
   * دریافت کاربر فعلی
   */
  getCurrentUser() {
    if (!this.currentUser) {
      const userData = this.getStoredUserData();
      this.currentUser = userData ? userData.user : null;
    }
    return this.currentUser;
  }
}
