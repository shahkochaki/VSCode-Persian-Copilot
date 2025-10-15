// TODO Manager JavaScript

// Global variables
let currentUser = null;
let todos = [];
let currentFilter = "all";
let isLoading = false;

// VS Code API
const vscode = acquireVsCodeApi();

// Initialize when page loads
window.addEventListener("DOMContentLoaded", function () {
  checkAuthStatus();
});

/**
 * Check if user is authenticated
 */
function checkAuthStatus() {
  // Send message to extension to check if user is logged in
  vscode.postMessage({
    command: "checkAuth",
  });
}

/**
 * Open login page
 */
function openLogin() {
  vscode.postMessage({
    command: "openLogin",
  });
}

/**
 * Show authentication section
 */
function showAuthSection() {
  document.getElementById("authSection").classList.remove("hidden");
  document.getElementById("todoSection").classList.add("hidden");
}

/**
 * Show TODO management section
 */
function showTodoSection() {
  document.getElementById("authSection").classList.add("hidden");
  document.getElementById("todoSection").classList.remove("hidden");
  loadTodos();
}

/**
 * Show message to user
 */
function showMessage(message, type = "info") {
  const container = document.getElementById("messageContainer");
  const messageDiv = document.createElement("div");
  messageDiv.className = type;
  messageDiv.textContent = message;
  container.appendChild(messageDiv);

  setTimeout(() => {
    container.removeChild(messageDiv);
  }, 5000);
}

/**
 * Load todos from API
 */
async function loadTodos() {
  if (isLoading) {
    return;
  }

  isLoading = true;
  document.getElementById("todoList").innerHTML =
    '<div class="loading">در حال بارگذاری TODOها...</div>';

  try {
    vscode.postMessage({
      command: "loadTodos",
    });
  } catch (error) {
    showMessage("خطا در بارگذاری TODOها: " + error.message, "error");
    document.getElementById("todoList").innerHTML = "";
  }

  isLoading = false;
}

/**
 * Add new todo
 */
async function addTodo() {
  const title = document.getElementById("todoTitle").value.trim();
  const description = document.getElementById("todoDescription").value.trim();
  const priority = document.getElementById("todoPriority").value;

  if (!title) {
    showMessage("لطفاً عنوان TODO را وارد کنید", "error");
    return;
  }

  const addBtn = document.getElementById("addBtn");
  addBtn.disabled = true;
  addBtn.textContent = "در حال افزودن...";

  try {
    vscode.postMessage({
      command: "addTodo",
      data: {
        title: title,
        description: description,
        priority: priority,
      },
    });

    // Clear form
    document.getElementById("todoTitle").value = "";
    document.getElementById("todoDescription").value = "";
    document.getElementById("todoPriority").value = "medium";
  } catch (error) {
    showMessage("خطا در افزودن TODO: " + error.message, "error");
  }

  addBtn.disabled = false;
  addBtn.textContent = "افزودن";
}

/**
 * Toggle todo completion status
 */
async function toggleTodo(id, completed) {
  try {
    vscode.postMessage({
      command: "toggleTodo",
      data: { id: id, completed: !completed },
    });
  } catch (error) {
    showMessage("خطا در تغییر وضعیت TODO: " + error.message, "error");
  }
}

/**
 * Delete todo
 */
async function deleteTodo(id) {
  if (!confirm("آیا مطمئن هستید که می‌خواهید این TODO را حذف کنید؟")) {
    return;
  }

  try {
    vscode.postMessage({
      command: "deleteTodo",
      data: { id: id },
    });
  } catch (error) {
    showMessage("خطا در حذف TODO: " + error.message, "error");
  }
}

/**
 * Filter todos by type
 */
function filterTodos(filter) {
  currentFilter = filter;

  // Update button states
  document.querySelectorAll('[id^="filter"]').forEach((btn) => {
    btn.style.background = "none";
    btn.style.color = "var(--vscode-foreground)";
  });

  const activeBtn = document.getElementById(
    "filter" + filter.charAt(0).toUpperCase() + filter.slice(1)
  );
  if (activeBtn) {
    activeBtn.style.background = "var(--vscode-button-background)";
    activeBtn.style.color = "var(--vscode-button-foreground)";
  }

  renderTodos();
}

/**
 * Render todos in the UI
 */
function renderTodos() {
  const container = document.getElementById("todoList");

  if (todos.length === 0) {
    container.innerHTML = '<div class="loading">هیچ TODO ای یافت نشد</div>';
    return;
  }

  let filteredTodos = todos;

  switch (currentFilter) {
    case "pending":
      filteredTodos = todos.filter((todo) => !todo.completed);
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed);
      break;
    case "high":
      filteredTodos = todos.filter((todo) => todo.priority === "high");
      break;
  }

  if (filteredTodos.length === 0) {
    container.innerHTML =
      '<div class="loading">هیچ TODO ای با این فیلتر یافت نشد</div>';
    return;
  }

  container.innerHTML = filteredTodos
    .map(
      (todo) => `
    <div class="todo-item ${todo.completed ? "completed" : ""}">
      <div class="todo-header">
        <div class="todo-title">${escapeHtml(todo.title)}</div>
        <div class="todo-priority priority-${todo.priority}">
          ${getPriorityLabel(todo.priority)}
        </div>
      </div>
      ${
        todo.description
          ? `<div class="todo-description">${escapeHtml(
              todo.description
            )}</div>`
          : ""
      }
      <div class="todo-meta">
        <span>ایجاد شده: ${formatDate(todo.created_at)}</span>
        <div class="todo-actions">
          <button class="action-btn complete-btn" onclick="toggleTodo(${
            todo.id
          }, ${todo.completed})">
            ${todo.completed ? "برگردان" : "تکمیل"}
          </button>
          <button class="action-btn delete-btn" onclick="deleteTodo(${
            todo.id
          })">
            حذف
          </button>
        </div>
      </div>
      ${
        todo.progress_percentage !== null
          ? `
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${todo.progress_percentage}%"></div>
        </div>
      `
          : ""
      }
    </div>
  `
    )
    .join("");

  updateStats();
}

/**
 * Update statistics
 */
function updateStats() {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  document.getElementById("totalTodos").textContent = total;
  document.getElementById("completedTodos").textContent = completed;
  document.getElementById("pendingTodos").textContent = pending;
  document.getElementById("completionRate").textContent = completionRate + "%";
}

/**
 * Get priority label in Persian
 */
function getPriorityLabel(priority) {
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
 * Format date for display
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fa-IR");
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Handle messages from extension
 */
window.addEventListener("message", (event) => {
  const message = event.data;

  switch (message.command) {
    case "authStatus":
      if (message.isAuthenticated) {
        currentUser = message.user;
        showTodoSection();
      } else {
        showAuthSection();
      }
      break;

    case "todosLoaded":
      todos = message.todos || [];
      renderTodos();
      break;

    case "todoAdded":
      if (message.success) {
        showMessage("TODO با موفقیت اضافه شد", "success");
        loadTodos(); // Reload to get updated list
      } else {
        showMessage("خطا در افزودن TODO: " + message.message, "error");
      }
      break;

    case "todoToggled":
      if (message.success) {
        showMessage("وضعیت TODO تغییر کرد", "success");
        loadTodos(); // Reload to get updated list
      } else {
        showMessage("خطا در تغییر وضعیت TODO: " + message.message, "error");
      }
      break;

    case "todoDeleted":
      if (message.success) {
        showMessage("TODO حذف شد", "success");
        loadTodos(); // Reload to get updated list
      } else {
        showMessage("خطا در حذف TODO: " + message.message, "error");
      }
      break;

    case "error":
      showMessage(message.message, "error");
      break;
  }
});

/**
 * Keyboard shortcuts
 */
document.addEventListener("DOMContentLoaded", function () {
  const todoTitleInput = document.getElementById("todoTitle");
  if (todoTitleInput) {
    todoTitleInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        addTodo();
      }
    });
  }
});
