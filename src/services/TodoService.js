/**
 * Todo Service برای مدیریت TODO ها با API
 * نیاز به Authentication دارد
 */
class TodoService {
  constructor(authManager) {
    this.authManager = authManager;
    this.baseUrl = "https://console.helpix.app/api/v1"; // همان آدرس API اصلی
  }

  /**
   * تنظیم آدرس API
   */
  setApiUrl(url) {
    this.baseUrl = url;
  }

  /**
   * بررسی احراز هویت
   */
  isAuthenticated() {
    return this.authManager && this.authManager.isLoggedIn();
  }

  /**
   * دریافت لیست TODO ها
   */
  async getTodos(filters = {}) {
    if (!this.isAuthenticated()) {
      throw new Error("برای دسترسی به TODO ها باید ابتدا وارد شوید");
    }

    try {
      const token = this.authManager.getToken();
      const queryParams = new URLSearchParams();

      // اضافه کردن فیلترها
      if (filters.search) {
        queryParams.append("search", filters.search);
      }
      if (filters.priority) {
        queryParams.append("priority", filters.priority);
      }
      if (filters.completed !== undefined) {
        queryParams.append("completed", filters.completed);
      }
      if (filters.per_page) {
        queryParams.append("per_page", filters.per_page);
      }
      if (filters.page) {
        queryParams.append("page", filters.page);
      }

      const url = `${this.baseUrl}/todos${
        queryParams.toString() ? "?" + queryParams.toString() : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("احراز هویت منقضی شده است. لطفاً مجدداً وارد شوید");
        }
        throw new Error(`خطا در دریافت TODO ها: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // اگر پاسخ paginated باشد، data.data را برگردان، وگرنه خود data را
        return data.data.data || data.data || [];
      } else {
        throw new Error(data.message || "خطا در دریافت TODO ها");
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw error;
    }
  }

  /**
   * ایجاد TODO جدید
   */
  async createTodo(todoData) {
    if (!this.isAuthenticated()) {
      throw new Error("برای ایجاد TODO باید ابتدا وارد شوید");
    }

    try {
      const token = this.authManager.getToken();

      const response = await fetch(`${this.baseUrl}/todos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          title: todoData.title,
          description: todoData.description || "",
          priority: todoData.priority || "medium",
          color: this.getPriorityColor(todoData.priority),
          due_date: todoData.due_date || null,
          is_favorite: todoData.is_favorite || false,
          progress_percentage: todoData.progress_percentage || 0,
          estimated_time: todoData.estimated_time || null,
          notes: todoData.notes || "",
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("احراز هویت منقضی شده است. لطفاً مجدداً وارد شوید");
        }
        throw new Error(`خطا در ایجاد TODO: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || "خطا در ایجاد TODO");
      }
    } catch (error) {
      console.error("Error creating todo:", error);
      throw error;
    }
  }

  /**
   * به‌روزرسانی TODO
   */
  async updateTodo(todoId, updateData) {
    if (!this.isAuthenticated()) {
      throw new Error("برای به‌روزرسانی TODO باید ابتدا وارد شوید");
    }

    try {
      const token = this.authManager.getToken();

      const response = await fetch(`${this.baseUrl}/todos/${todoId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("احراز هویت منقضی شده است. لطفاً مجدداً وارد شوید");
        }
        throw new Error(`خطا در به‌روزرسانی TODO: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || "خطا در به‌روزرسانی TODO");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      throw error;
    }
  }

  /**
   * تکمیل/عدم تکمیل TODO
   */
  async toggleTodoComplete(todoId) {
    if (!this.isAuthenticated()) {
      throw new Error("برای تغییر وضعیت TODO باید ابتدا وارد شوید");
    }

    try {
      const token = this.authManager.getToken();

      const response = await fetch(`${this.baseUrl}/todos/${todoId}/complete`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("احراز هویت منقضی شده است. لطفاً مجدداً وارد شوید");
        }
        throw new Error(`خطا در تغییر وضعیت TODO: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || "خطا در تغییر وضعیت TODO");
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
      throw error;
    }
  }

  /**
   * حذف TODO
   */
  async deleteTodo(todoId) {
    if (!this.isAuthenticated()) {
      throw new Error("برای حذف TODO باید ابتدا وارد شوید");
    }

    try {
      const token = this.authManager.getToken();

      const response = await fetch(`${this.baseUrl}/todos/${todoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("احراز هویت منقضی شده است. لطفاً مجدداً وارد شوید");
        }
        throw new Error(`خطا در حذف TODO: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        return true;
      } else {
        throw new Error(data.message || "خطا در حذف TODO");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  }

  /**
   * دریافت آمار TODO ها
   */
  async getTodosStats() {
    if (!this.isAuthenticated()) {
      throw new Error("برای دریافت آمار TODO ها باید ابتدا وارد شوید");
    }

    try {
      const token = this.authManager.getToken();

      const response = await fetch(`${this.baseUrl}/todos-stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("احراز هویت منقضی شده است. لطفاً مجدداً وارد شوید");
        }
        throw new Error(`خطا در دریافت آمار: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || "خطا در دریافت آمار TODO ها");
      }
    } catch (error) {
      console.error("Error fetching todos stats:", error);
      throw error;
    }
  }

  /**
   * دریافت رنگ بر اساس اولویت
   */
  getPriorityColor(priority) {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "yellow";
      case "low":
        return "green";
      default:
        return "gray";
    }
  }

  /**
   * دریافت برچسب فارسی اولویت
   */
  getPriorityLabel(priority) {
    switch (priority) {
      case "high":
        return "زیاد";
      case "medium":
        return "متوسط";
      case "low":
        return "کم";
      default:
        return "متوسط";
    }
  }

  /**
   * اعتبارسنجی داده‌های TODO
   */
  validateTodoData(todoData) {
    const errors = [];

    if (!todoData.title || todoData.title.trim().length === 0) {
      errors.push("عنوان TODO الزامی است");
    }

    if (todoData.title && todoData.title.length > 100) {
      errors.push("عنوان TODO نباید بیش از 100 کاراکتر باشد");
    }

    if (todoData.description && todoData.description.length > 500) {
      errors.push("توضیحات TODO نباید بیش از 500 کاراکتر باشد");
    }

    if (
      todoData.priority &&
      !["low", "medium", "high"].includes(todoData.priority)
    ) {
      errors.push("اولویت TODO باید یکی از مقادیر low, medium, high باشد");
    }

    if (
      todoData.progress_percentage &&
      (todoData.progress_percentage < 0 || todoData.progress_percentage > 100)
    ) {
      errors.push("درصد پیشرفت باید بین 0 تا 100 باشد");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  /**
   * فرمت‌بندی تاریخ برای نمایش
   */
  formatDate(dateString) {
    if (!dateString) {
      return "";
    }

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  }
}

// Export for use in extension
if (typeof module !== "undefined" && module.exports) {
  module.exports = TodoService;
}
