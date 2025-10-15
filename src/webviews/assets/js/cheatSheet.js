// VS Code API Integration
const vscode = acquireVsCodeApi();
let currentUser = null;

// Initialize page
window.addEventListener("load", () => {
  requestUserData();
  loadCheatSheets();
});

function requestUserData() {
  vscode.postMessage({
    command: "getUserData",
  });
}

// Handle messages from extension
window.addEventListener("message", (event) => {
  const message = event.data;

  switch (message.command) {
    case "setUserData":
      updateUserInterface(message.data);
      break;
  }
});

// Import services - در محیط واقعی این کدها را در فایل‌های جداگانه قرار دهید

/**
 * CheatSheet Service برای مدیریت چیت شیت‌ها
 */
class CheatSheetService {
  constructor() {
    this.baseUrl = "https://console.helpix.app/api/v1";
  }

  isAuthenticated() {
    return !!(currentUser && currentUser.token);
  }

  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (currentUser && currentUser.token) {
      headers["Authorization"] = `Bearer ${currentUser.token}`;
    }

    return headers;
  }

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

  async getCheatSheets(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `/cheat-sheets?${queryParams}` : "/cheat-sheets";

    return await this.makeRequest(url);
  }

  async getCheatSheet(id) {
    return await this.makeRequest(`/cheat-sheets/${id}`);
  }

  async createCheatSheet(cheatSheetData) {
    if (!this.isAuthenticated()) {
      throw new Error("برای ایجاد چیت شیت شخصی باید وارد شوید");
    }

    return await this.makeRequest("/cheat-sheets", {
      method: "POST",
      body: JSON.stringify(cheatSheetData),
    });
  }

  async updateCheatSheet(id, updateData) {
    if (!this.isAuthenticated()) {
      throw new Error("برای ویرایش چیت شیت باید وارد شوید");
    }

    return await this.makeRequest(`/cheat-sheets/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async deleteCheatSheet(id) {
    if (!this.isAuthenticated()) {
      throw new Error("برای حذف چیت شیت باید وارد شوید");
    }

    return await this.makeRequest(`/cheat-sheets/${id}`, {
      method: "DELETE",
    });
  }

  async getMyCheatSheets() {
    if (!this.isAuthenticated()) {
      throw new Error("برای دریافت چیت شیت‌های شخصی باید وارد شوید");
    }

    return await this.getCheatSheets({ owner: "me" });
  }

  // Methods for managing items within cheat sheets
  async getCheatSheetItems(cheatSheetId) {
    // Since Laravel controller doesn't have dedicated items endpoint,
    // we'll get the full cheat sheet and extract items
    const result = await this.getCheatSheet(cheatSheetId);
    if (result.success && result.data && result.data.items) {
      return {
        success: true,
        data: result.data.items,
      };
    }
    return { success: false, data: [] };
  }

  async addItem(cheatSheetId, itemData) {
    if (!this.isAuthenticated()) {
      throw new Error("برای افزودن آیتم باید وارد شوید");
    }

    return await this.makeRequest(`/cheat-sheets/${cheatSheetId}/items`, {
      method: "POST",
      body: JSON.stringify(itemData),
    });
  }

  async updateItem(cheatSheetId, itemId, updateData) {
    if (!this.isAuthenticated()) {
      throw new Error("برای ویرایش آیتم باید وارد شوید");
    }

    return await this.makeRequest(
      `/cheat-sheets/${cheatSheetId}/items/${itemId}`,
      {
        method: "PUT",
        body: JSON.stringify(updateData),
      }
    );
  }

  async deleteItem(cheatSheetId, itemId) {
    if (!this.isAuthenticated()) {
      throw new Error("برای حذف آیتم باید وارد شوید");
    }

    return await this.makeRequest(
      `/cheat-sheets/${cheatSheetId}/items/${itemId}`,
      {
        method: "DELETE",
      }
    );
  }
}

// Application Code

let cheatSheetsData = [];
let categories = [];
let currentFilter = "all";
let currentCategory = "";
let currentSearch = "";

// Initialize cheat sheet service
const cheatSheetService = new CheatSheetService();

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
  // loadCheatSheets will be called by updateUserInterface after getting user data
});

function setupEventListeners() {
  // Create new cheat sheet button
  document
    .getElementById("createNewBtn")
    .addEventListener("click", () => openModal("cheatSheetModal"));

  // Search and filter
  document.getElementById("searchBtn").addEventListener("click", performSearch);
  document
    .getElementById("searchInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        performSearch();
      }
    });
  document
    .getElementById("categoryFilter")
    .addEventListener("change", filterByCategory);
  document
    .getElementById("typeFilter")
    .addEventListener("change", filterByType);

  // Form submissions
  document
    .getElementById("cheatSheetForm")
    .addEventListener("submit", handleCheatSheetSubmit);
  document
    .getElementById("itemForm")
    .addEventListener("submit", handleItemSubmit);
}

function updateUserInterface(userData) {
  currentUser = userData;
  console.log("CheatSheet: Received user data:", userData);

  if (userData && userData.token) {
    console.log("CheatSheet: User is logged in, updating interface");
  } else {
    console.log("CheatSheet: User not logged in, showing guest view");
  }

  updateAuthUI();
  loadCheatSheets();
}

function updateAuthUI() {
  const guestSection = document.getElementById("guestSection");
  const userSection = document.getElementById("userSection");
  const myFilter = document.getElementById("myFilter");
  const headerDescription = document.getElementById("headerDescription");
  const addCheatSheetBtn = document.getElementById("addCheatSheetBtn");

  if (currentUser && currentUser.token) {
    guestSection.style.display = "none";
    userSection.style.display = "flex";
    if (myFilter) myFilter.style.display = "block";

    // نمایش دکمه افزودن چیت شیت
    if (addCheatSheetBtn) addCheatSheetBtn.style.display = "block";

    // Extract user name from the user data structure
    let userName = "کاربر";
    if (
      currentUser.user &&
      currentUser.user.data &&
      (currentUser.user.data.firstName || currentUser.user.data.lastName)
    ) {
      userName = `${currentUser.user.data.firstName || ""} ${
        currentUser.user.data.lastName || ""
      }`.trim();
    } else if (currentUser.user && currentUser.user.name) {
      userName = currentUser.user.name;
    }

    document.getElementById(
      "userWelcome"
    ).textContent = `خوش آمدید، ${userName}`;
    headerDescription.textContent = "مجموعه‌ای از چیت شیت‌های عمومی و شخصی شما";
  } else {
    guestSection.style.display = "block";
    userSection.style.display = "none";
    if (myFilter) myFilter.style.display = "none";

    // مخفی کردن دکمه افزودن چیت شیت
    if (addCheatSheetBtn) addCheatSheetBtn.style.display = "none";

    headerDescription.textContent = "مجموعه‌ای از چیت شیت‌های عمومی";
  }
}

async function loadCheatSheets() {
  try {
    showLoading();

    const params = {};

    if (currentSearch) {
      params.search = currentSearch;
    }

    if (currentCategory) {
      params.category = currentCategory;
    }

    let response;

    if (currentFilter === "my" && cheatSheetService.isAuthenticated()) {
      response = await cheatSheetService.getMyCheatSheets();
    } else if (currentFilter === "public") {
      // For public only, we'll handle this in the service
      response = await cheatSheetService.getCheatSheets(params);
    } else {
      response = await cheatSheetService.getCheatSheets(params);
    }

    if (response.success && response.data) {
      const data = response.data.data || response.data;
      cheatSheetsData = Array.isArray(data) ? data : [data];
      extractCategories(cheatSheetsData);
      displayCheatSheets(cheatSheetsData);
    } else {
      throw new Error("پاسخ نامعتبر از سرور");
    }
  } catch (error) {
    showError(error.message);
    console.error("Error loading cheat sheets:", error);
  }
}

function extractCategories(cheatSheets) {
  const categorySet = new Set();
  cheatSheets.forEach((sheet) => {
    if (sheet.category) {
      categorySet.add(sheet.category);
    }
  });

  categories = Array.from(categorySet).sort();
  updateCategoryFilter();
}

function updateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="">همه دسته‌بندی‌ها</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function performSearch() {
  currentSearch = document.getElementById("searchInput").value.trim();
  loadCheatSheets();
}

function filterByCategory() {
  currentCategory = document.getElementById("categoryFilter").value;
  loadCheatSheets();
}

function filterByType() {
  currentFilter = document.getElementById("typeFilter").value;
  loadCheatSheets();
}

function showLoading() {
  document.getElementById("loadingSection").style.display = "block";
  document.getElementById("errorSection").style.display = "none";
  document.getElementById("cheatSheetsSection").style.display = "none";
  document.getElementById("cheatSheetDetail").style.display = "none";
}

function showError(message) {
  document.getElementById("loadingSection").style.display = "none";
  document.getElementById("errorSection").style.display = "block";
  document.getElementById("cheatSheetsSection").style.display = "none";
  document.getElementById("cheatSheetDetail").style.display = "none";
  document.getElementById("errorMessage").textContent = message;
}

function displayCheatSheets(cheatSheets) {
  document.getElementById("loadingSection").style.display = "none";
  document.getElementById("errorSection").style.display = "none";
  document.getElementById("cheatSheetsSection").style.display = "block";
  document.getElementById("cheatSheetDetail").style.display = "none";

  const grid = document.getElementById("cheatSheetsGrid");
  grid.innerHTML = "";

  if (cheatSheets.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">📄</div>
        <div>هیچ چیت شیتی یافت نشد.</div>
        ${
          cheatSheetService.isAuthenticated()
            ? '<button class="auth-button primary" onclick="openModal(\'cheatSheetModal\')">ایجاد اولین چیت شیت</button>'
            : ""
        }
      </div>
    `;
    return;
  }

  cheatSheets.forEach((cheatSheet) => {
    const card = document.createElement("div");
    card.className = "cheat-sheet-card";
    card.onclick = () => showCheatSheetDetail(cheatSheet);

    const itemCount = cheatSheet.items ? cheatSheet.items.length : 0;
    const isOwner =
      cheatSheetService.isAuthenticated() &&
      currentUser &&
      currentUser.user &&
      (cheatSheet.user_id === currentUser.user.id ||
        (currentUser.user.data &&
          cheatSheet.user_id === currentUser.user.data.id));

    const ownerBadge = cheatSheet.is_public
      ? '<span class="badge public">عمومی</span>'
      : '<span class="badge private">شخصی</span>';

    card.innerHTML = `
      <div class="card-header">
        <div class="card-title">${escapeHtml(cheatSheet.title)}</div>
        ${ownerBadge}
      </div>
      <div class="card-description">${escapeHtml(
        cheatSheet.description || ""
      )}</div>
      <div class="card-meta">
        <span class="card-category">${escapeHtml(
          cheatSheet.category || "عمومی"
        )}</span>
        <span class="card-count">${itemCount} آیتم</span>
        ${
          cheatSheet.user
            ? '<span class="card-author">توسط ' +
              escapeHtml(cheatSheet.user.name) +
              "</span>"
            : ""
        }
      </div>
      ${
        isOwner
          ? '<div class="card-actions"><button onclick="editCheatSheet(event, ' +
            cheatSheet.id +
            ')">ویرایش</button><button onclick="deleteCheatSheet(event, ' +
            cheatSheet.id +
            ')">حذف</button></div>'
          : ""
      }
    `;

    grid.appendChild(card);
  });
}

function showCheatSheetDetail(cheatSheet) {
  document.getElementById("cheatSheetsSection").style.display = "none";
  document.getElementById("cheatSheetDetail").style.display = "block";

  document.getElementById("detailTitle").textContent = cheatSheet.title;
  document.getElementById("detailDescription").textContent =
    cheatSheet.description || "توضیحاتی برای این چیت شیت ثبت نشده است.";

  // Display owner information
  const ownerInfo = cheatSheet.user
    ? `توسط: ${cheatSheet.user.name} | ${
        cheatSheet.is_public ? "عمومی" : "شخصی"
      }`
    : cheatSheet.is_public
    ? "چیت شیت عمومی"
    : "چیت شیت شخصی";
  document.getElementById("detailOwner").textContent = ownerInfo;

  // Check if current user is the owner
  const isOwner =
    cheatSheetService.isAuthenticated() &&
    currentUser &&
    currentUser.user &&
    (cheatSheet.user_id === currentUser.user.id ||
      (currentUser.user.data &&
        cheatSheet.user_id === currentUser.user.data.id));

  // Store current cheat sheet for item operations
  window.currentCheatSheet = cheatSheet;

  const itemsContainer = document.getElementById("itemsContainer");
  itemsContainer.innerHTML = "";

  // Add item management buttons for owners
  if (isOwner) {
    const addItemButton = document.createElement("div");
    addItemButton.className = "detail-actions";
    addItemButton.style.cssText = "margin-bottom: 20px; text-align: center;";
    addItemButton.innerHTML = `
      <button class="auth-button primary" onclick="openAddItemModal(${cheatSheet.id})">
        ➕ افزودن آیتم جدید
      </button>
    `;
    itemsContainer.appendChild(addItemButton);
  }

  if (cheatSheet.items && cheatSheet.items.length > 0) {
    cheatSheet.items
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      .forEach((item) => {
        const itemCard = document.createElement("div");
        itemCard.className = "item-card";

        let codeHtml = "";
        if (item.code_example) {
          const safeCode = escapeHtml(item.code_example);
          codeHtml = `
            <div class="code-block">
              <pre>${safeCode}</pre>
            </div>
          `;
        }

        // Item actions for owner
        let itemActions = "";
        if (isOwner) {
          itemActions = `
            <div class="item-actions" style="display: flex; gap: 8px; margin-top: 12px; padding-top: 8px; border-top: 1px solid var(--vscode-panel-border);">
              <button class="btn-secondary" onclick="editItem(${cheatSheet.id}, ${item.id})" style="padding: 4px 8px; font-size: 0.8rem; border: none; border-radius: 3px; cursor: pointer;">✏️ ویرایش</button>
              <button class="btn-danger" onclick="deleteItem(${cheatSheet.id}, ${item.id})" style="padding: 4px 8px; font-size: 0.8rem; border: none; border-radius: 3px; cursor: pointer; background: #dc3545; color: white;">🗑️ حذف</button>
            </div>
          `;
        }

        itemCard.innerHTML = `
          <button class="copy-btn" onclick="copyItemContent(event, '${escapeHtml(
            item.title
          )}', '${escapeHtml(item.content || "")}', '${
          item.code_example ? escapeHtml(item.code_example) : ""
        }')" title="کپی محتوای آیتم">📋</button>
          <div class="item-title">${escapeHtml(item.title)}</div>
          <div class="item-content">${escapeHtml(item.content || "")}</div>
          ${codeHtml}
          ${itemActions}
        `;

        itemsContainer.appendChild(itemCard);
      });
  } else {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerHTML = `
      <div class="empty-state-icon">📄</div>
      <div>هیچ آیتمی برای این چیت شیت موجود نیست.</div>
      ${
        isOwner
          ? `<button class="auth-button primary" onclick="openAddItemModal(${cheatSheet.id})" style="margin-top: 15px;">افزودن اولین آیتم</button>`
          : ""
      }
    `;
    itemsContainer.appendChild(emptyState);
  }
}

function showCheatSheetsList() {
  document.getElementById("cheatSheetDetail").style.display = "none";
  document.getElementById("cheatSheetsSection").style.display = "block";
}

async function copyCheatSheetContent(event, cheatSheetId) {
  event.stopPropagation();

  try {
    const cheatSheet = await cheatSheetService.getCheatSheet(cheatSheetId);
    if (cheatSheet && cheatSheet.items) {
      let content = `${cheatSheet.title}\n`;
      content += `${
        cheatSheet.description ? cheatSheet.description + "\n" : ""
      }`;
      content += "=".repeat(50) + "\n\n";

      cheatSheet.items.forEach((item, index) => {
        content += `${index + 1}. ${item.title}\n`;
        if (item.description) {
          content += `   ${item.description}\n`;
        }
        if (item.code) {
          content += `   کد: ${item.code}\n`;
        }
        content += "\n";
      });

      await navigator.clipboard.writeText(content);
      showMessage("محتوای چیت‌شیت کپی شد!", "success");
    }
  } catch (error) {
    console.error("Error copying cheat sheet:", error);
    showMessage("خطا در کپی کردن محتوا", "error");
  }
}

async function copyItemContent(event, title, content, code) {
  event.stopPropagation();

  try {
    let itemContent = `${title}\n`;
    if (content) {
      itemContent += `${content}\n`;
    }
    if (code) {
      itemContent += `\nکد:\n${code}\n`;
    }

    await navigator.clipboard.writeText(itemContent);
    showMessage("محتوای آیتم کپی شد!", "success");
  } catch (error) {
    console.error("Error copying item:", error);
    showMessage("خطا در کپی کردن آیتم", "error");
  }
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Modal functions
function openCheatSheetModal() {
  openModal("cheatSheetModal");
}

function openModal(modalId) {
  // Check if user is authenticated for cheat sheet modal
  if (modalId === "cheatSheetModal" && !cheatSheetService.isAuthenticated()) {
    showMessage("برای ایجاد چیت شیت شخصی باید وارد حساب کاربری شوید", "error");
    return;
  }

  // Check if user is authenticated for item modal
  if (modalId === "itemModal" && !cheatSheetService.isAuthenticated()) {
    showMessage("برای مدیریت آیتم‌ها باید وارد حساب کاربری شوید", "error");
    return;
  }

  document.getElementById(modalId).style.display = "block";

  // Clear form errors
  const errorElements = document.querySelectorAll(".error-message");
  errorElements.forEach((el) => (el.style.display = "none"));

  // Reset cheat sheet form
  if (modalId === "cheatSheetModal") {
    document.getElementById("cheatSheetForm").reset();
    document.getElementById("cheatSheetModalTitle").textContent =
      "ایجاد چیت شیت جدید";
  }

  // Reset item form (handled in openAddItemModal for creation)
  if (modalId === "itemModal" && !window.currentItemOperation) {
    document.getElementById("itemForm").reset();
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Handle create/edit cheat sheet
async function handleCheatSheetSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("cheatSheetTitle").value;
  const description = document.getElementById("cheatSheetDescription").value;
  const category = document.getElementById("cheatSheetCategory").value;
  const isPublic = document.getElementById("cheatSheetPublic").checked;
  const errorDiv = document.getElementById("cheatSheetError");

  try {
    const cheatSheetData = {
      title,
      description,
      category,
      is_public: isPublic,
    };

    const result = await cheatSheetService.createCheatSheet(cheatSheetData);

    if (result.success) {
      closeModal("cheatSheetModal");
      showMessage("چیت شیت با موفقیت ایجاد شد!", "success");
      loadCheatSheets();
    } else {
      errorDiv.textContent = result.message;
      errorDiv.style.display = "block";
    }
  } catch (error) {
    errorDiv.textContent = "خطا در ایجاد چیت شیت: " + error.message;
    errorDiv.style.display = "block";
  }
}

// Edit cheat sheet
async function editCheatSheet(event, id) {
  event.stopPropagation();

  try {
    const result = await cheatSheetService.getCheatSheet(id);

    if (result.success && result.data) {
      const cheatSheet = result.data;

      document.getElementById("cheatSheetTitle").value = cheatSheet.title;
      document.getElementById("cheatSheetDescription").value =
        cheatSheet.description || "";
      document.getElementById("cheatSheetCategory").value =
        cheatSheet.category || "";
      document.getElementById("cheatSheetPublic").checked =
        cheatSheet.is_public;
      document.getElementById("cheatSheetModalTitle").textContent =
        "ویرایش چیت شیت";

      openModal("cheatSheetModal");

      // Update form handler for editing
      const form = document.getElementById("cheatSheetForm");
      form.onsubmit = async function (e) {
        e.preventDefault();

        const title = document.getElementById("cheatSheetTitle").value;
        const description = document.getElementById(
          "cheatSheetDescription"
        ).value;
        const category = document.getElementById("cheatSheetCategory").value;
        const isPublic = document.getElementById("cheatSheetPublic").checked;
        const errorDiv = document.getElementById("cheatSheetError");

        try {
          const updateData = {
            title,
            description,
            category,
            is_public: isPublic,
          };

          const updateResult = await cheatSheetService.updateCheatSheet(
            id,
            updateData
          );

          if (updateResult.success) {
            closeModal("cheatSheetModal");
            showMessage("چیت شیت با موفقیت بروزرسانی شد!", "success");
            loadCheatSheets();

            // Reset form handler
            form.onsubmit = handleCheatSheetSubmit;
          } else {
            errorDiv.textContent = updateResult.message;
            errorDiv.style.display = "block";
          }
        } catch (error) {
          errorDiv.textContent = "خطا در بروزرسانی چیت شیت: " + error.message;
          errorDiv.style.display = "block";
        }
      };
    }
  } catch (error) {
    showMessage("خطا در دریافت اطلاعات چیت شیت: " + error.message, "error");
  }
}

// Delete cheat sheet
async function deleteCheatSheet(event, id) {
  event.stopPropagation();

  if (!confirm("آیا از حذف این چیت شیت اطمینان دارید؟")) {
    return;
  }

  try {
    const result = await cheatSheetService.deleteCheatSheet(id);

    if (result.success) {
      showMessage("چیت شیت با موفقیت حذف شد", "success");
      loadCheatSheets();
    } else {
      showMessage("خطا در حذف چیت شیت: " + result.message, "error");
    }
  } catch (error) {
    showMessage("خطا در حذف چیت شیت: " + error.message, "error");
  }
}

function showMessage(message, type = "info") {
  // Create a toast notification
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

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const detailSection = document.getElementById("cheatSheetDetail");
    if (detailSection.style.display === "block") {
      showCheatSheetsList();
    }

    // Close modals
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (modal.style.display === "block") {
        modal.style.display = "none";
      }
    });
  }
});

// Item Management Functions

function openAddItemModal(cheatSheetId) {
  document.getElementById("itemModalTitle").textContent = "افزودن آیتم جدید";
  document.getElementById("itemForm").reset();

  // Set default order index
  const currentItems = window.currentCheatSheet?.items || [];
  const maxOrder =
    currentItems.length > 0
      ? Math.max(...currentItems.map((item) => item.order_index || 0))
      : -1;
  document.getElementById("itemOrderIndex").value = maxOrder + 1;

  openModal("itemModal");

  // Store current operation
  window.currentItemOperation = {
    type: "create",
    cheatSheetId: cheatSheetId,
  };
}

async function editItem(cheatSheetId, itemId) {
  try {
    // Find the item in current cheat sheet data
    const item = window.currentCheatSheet?.items?.find(
      (item) => item.id === itemId
    );

    if (!item) {
      showMessage("آیتم مورد نظر یافت نشد", "error");
      return;
    }

    // Populate form with item data
    document.getElementById("itemTitle").value = item.title;
    document.getElementById("itemContent").value = item.content || "";
    document.getElementById("itemCodeExample").value = item.code_example || "";
    document.getElementById("itemCategory").value = item.category || "";
    document.getElementById("itemOrderIndex").value = item.order_index || 0;

    document.getElementById("itemModalTitle").textContent = "ویرایش آیتم";

    openModal("itemModal");

    // Store current operation
    window.currentItemOperation = {
      type: "edit",
      cheatSheetId: cheatSheetId,
      itemId: itemId,
    };
  } catch (error) {
    showMessage("خطا در دریافت اطلاعات آیتم: " + error.message, "error");
  }
}

async function deleteItem(cheatSheetId, itemId) {
  if (!confirm("آیا از حذف این آیتم اطمینان دارید؟")) {
    return;
  }

  try {
    const result = await cheatSheetService.deleteItem(cheatSheetId, itemId);

    if (result.success) {
      showMessage("آیتم با موفقیت حذف شد", "success");

      // Reload the cheat sheet detail
      const updatedSheet = await cheatSheetService.getCheatSheet(cheatSheetId);
      if (updatedSheet.success) {
        showCheatSheetDetail(updatedSheet.data);
      }
    } else {
      showMessage("خطا در حذف آیتم: " + result.message, "error");
    }
  } catch (error) {
    showMessage("خطا در حذف آیتم: " + error.message, "error");
  }
}

async function handleItemSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("itemTitle").value;
  const content = document.getElementById("itemContent").value;
  const codeExample = document.getElementById("itemCodeExample").value;
  const category = document.getElementById("itemCategory").value;
  const orderIndex =
    parseInt(document.getElementById("itemOrderIndex").value) || 0;
  const errorDiv = document.getElementById("itemError");

  try {
    const itemData = {
      title,
      content,
      code_example: codeExample,
      category,
      order_index: orderIndex,
    };

    const operation = window.currentItemOperation;
    let result;

    if (operation.type === "create") {
      result = await cheatSheetService.addItem(
        operation.cheatSheetId,
        itemData
      );
    } else if (operation.type === "edit") {
      result = await cheatSheetService.updateItem(
        operation.cheatSheetId,
        operation.itemId,
        itemData
      );
    }

    if (result.success) {
      closeModal("itemModal");
      const message =
        operation.type === "create"
          ? "آیتم با موفقیت اضافه شد!"
          : "آیتم با موفقیت بروزرسانی شد!";
      showMessage(message, "success");

      // Reload the cheat sheet detail
      const updatedSheet = await cheatSheetService.getCheatSheet(
        operation.cheatSheetId
      );
      if (updatedSheet.success) {
        showCheatSheetDetail(updatedSheet.data);
      }
    } else {
      errorDiv.textContent = result.message;
      errorDiv.style.display = "block";
    }
  } catch (error) {
    errorDiv.textContent = "خطا در عملیات آیتم: " + error.message;
    errorDiv.style.display = "block";
  }
}
