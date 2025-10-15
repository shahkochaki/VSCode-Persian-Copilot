# TODO API - نمونه cURL Commands با ورودی و خروجی

## 🔐 مقدمات:

```bash
# Base URL
BASE_URL="http://localhost:8000/api/v1"

# JWT Token (باید از endpoint های authentication بگیرید)
JWT_TOKEN="your_jwt_token_here"
```

---

## 📝 1. ایجاد TODO جدید

### ورودی:

```bash
curl -X POST "${BASE_URL}/todos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -d '{
    "title": "تکمیل پروژه Todo",
    "description": "باید API های Todo را کامل کنم و تست کنم",
    "priority": "high",
    "color": "red",
    "due_date": "2024-12-01 10:00:00",
    "is_favorite": true,
    "progress_percentage": 25,
    "estimated_time": 120,
    "notes": "این کار فوری است و باید زودتر تمام شود"
  }'
```

### خروجی موفق:

```json
{
    "success": true,
    "message": "Todo created successfully",
    "data": {
        "id": 1,
        "title": "تکمیل پروژه Todo",
        "description": "باید API های Todo را کامل کنم و تست کنم",
        "completed": false,
        "priority": "high",
        "color": "red",
        "category_id": null,
        "order_index": 0,
        "is_favorite": true,
        "notes": "این کار فوری است و باید زودتر تمام شود",
        "progress_percentage": 25,
        "estimated_time": 120,
        "actual_time": null,
        "reminder_at": null,
        "due_date": "2024-12-01T10:00:00.000000Z",
        "user_id": 1,
        "created_at": "2024-10-15T12:00:00.000000Z",
        "updated_at": "2024-10-15T12:00:00.000000Z",
        "color_code": "#ef4444",
        "priority_label": "زیاد",
        "status_label": "در انتظار"
    }
}
```

---

## 📋 2. دریافت لیست TODO ها

### ورودی:

```bash
curl -X GET "${BASE_URL}/todos?search=پروژه&priority=high&completed=false&per_page=10" \
  -H "Authorization: Bearer ${JWT_TOKEN}"
```

### خروجی موفق:

```json
{
    "success": true,
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": 1,
                "title": "تکمیل پروژه Todo",
                "description": "باید API های Todo را کامل کنم و تست کنم",
                "completed": false,
                "priority": "high",
                "color": "red",
                "category_id": null,
                "order_index": 0,
                "is_favorite": true,
                "notes": "این کار فوری است و باید زودتر تمام شود",
                "progress_percentage": 25,
                "estimated_time": 120,
                "actual_time": null,
                "reminder_at": null,
                "due_date": "2024-12-01T10:00:00.000000Z",
                "user_id": 1,
                "created_at": "2024-10-15T12:00:00.000000Z",
                "updated_at": "2024-10-15T12:00:00.000000Z",
                "color_code": "#ef4444",
                "priority_label": "زیاد",
                "status_label": "در انتظار"
            }
        ],
        "first_page_url": "http://localhost:8000/api/v1/todos?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://localhost:8000/api/v1/todos?page=1",
        "links": [
            {
                "url": null,
                "label": "&laquo; Previous",
                "active": false
            },
            {
                "url": "http://localhost:8000/api/v1/todos?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": null,
                "label": "Next &raquo;",
                "active": false
            }
        ],
        "next_page_url": null,
        "path": "http://localhost:8000/api/v1/todos",
        "per_page": 10,
        "prev_page_url": null,
        "to": 1,
        "total": 1
    }
}
```

---

## ✅ 3. تغییر وضعیت TODO (تکمیل کردن)

### ورودی:

```bash
curl -X PATCH "${BASE_URL}/todos/1/complete" \
  -H "Authorization: Bearer ${JWT_TOKEN}"
```

### خروجی موفق:

```json
{
    "success": true,
    "message": "Todo marked as completed",
    "data": {
        "id": 1,
        "title": "تکمیل پروژه Todo",
        "description": "باید API های Todo را کامل کنم و تست کنم",
        "completed": true,
        "priority": "high",
        "color": "red",
        "category_id": null,
        "order_index": 0,
        "is_favorite": true,
        "notes": "این کار فوری است و باید زودتر تمام شود",
        "progress_percentage": 100,
        "estimated_time": 120,
        "actual_time": null,
        "reminder_at": null,
        "due_date": "2024-12-01T10:00:00.000000Z",
        "user_id": 1,
        "created_at": "2024-10-15T12:00:00.000000Z",
        "updated_at": "2024-10-15T12:05:00.000000Z",
        "color_code": "#ef4444",
        "priority_label": "زیاد",
        "status_label": "انجام شده"
    }
}
```

---

## 📊 4. دریافت آمار TODO ها

### ورودی:

```bash
curl -X GET "${BASE_URL}/todos-stats" \
  -H "Authorization: Bearer ${JWT_TOKEN}"
```

### خروجی موفق:

```json
{
    "success": true,
    "data": {
        "total_todos": 5,
        "completed_todos": 2,
        "pending_todos": 3,
        "due_soon_todos": 1,
        "completion_rate": 40.0,
        "priority_stats": {
            "low": 1,
            "medium": 2,
            "high": 1,
            "urgent": 1
        }
    }
}
```

---

## 🔄 5. بروزرسانی TODO

### ورودی:

```bash
curl -X PUT "${BASE_URL}/todos/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -d '{
    "title": "تکمیل پروژه Todo - بروزرسانی شده",
    "progress_percentage": 75,
    "actual_time": 90,
    "notes": "کار تقریباً تمام شده، فقط تست باقی مانده"
  }'
```

### خروجی موفق:

```json
{
    "success": true,
    "message": "Todo updated successfully",
    "data": {
        "id": 1,
        "title": "تکمیل پروژه Todo - بروزرسانی شده",
        "description": "باید API های Todo را کامل کنم و تست کنم",
        "completed": false,
        "priority": "high",
        "color": "red",
        "category_id": null,
        "order_index": 0,
        "is_favorite": true,
        "notes": "کار تقریباً تمام شده، فقط تست باقی مانده",
        "progress_percentage": 75,
        "estimated_time": 120,
        "actual_time": 90,
        "reminder_at": null,
        "due_date": "2024-12-01T10:00:00.000000Z",
        "user_id": 1,
        "created_at": "2024-10-15T12:00:00.000000Z",
        "updated_at": "2024-10-15T12:10:00.000000Z",
        "color_code": "#ef4444",
        "priority_label": "زیاد",
        "status_label": "در انتظار"
    }
}
```

---

## 🗑️ 6. حذف TODO

### ورودی:

```bash
curl -X DELETE "${BASE_URL}/todos/1" \
  -H "Authorization: Bearer ${JWT_TOKEN}"
```

### خروجی موفق:

```json
{
    "success": true,
    "message": "Todo deleted successfully"
}
```

---

## ⚡ 7. عملیات Bulk (حذف چندتایی)

### ورودی:

```bash
curl -X POST "${BASE_URL}/todos/bulk-action" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -d '{
    "action": "complete",
    "todo_ids": [1, 2, 3]
  }'
```

### خروجی موفق:

```json
{
    "success": true,
    "message": "Successfully marked 3 todos as completed",
    "affected_count": 3
}
```

---

## ❌ نمونه خروجی خطا (Validation Error):

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "title": ["The title field is required."],
        "priority": ["The selected priority is invalid."]
    }
}
```

---

## ❌ نمونه خروجی خطا (Authentication):

```json
{
    "success": false,
    "message": "Unauthenticated"
}
```

---

## ❌ نمونه خروجی خطا (Not Found):

```json
{
    "success": false,
    "message": "Todo not found"
}
```

---

## 🎨 مقادیر مجاز:

### رنگ‌ها:

`red`, `orange`, `yellow`, `green`, `blue`, `purple`, `pink`, `gray`, `indigo`, `teal`

### اولویت‌ها:

`low`, `medium`, `high`, `urgent`

### فیلترهای موجود:

-   `search`: جستجو در عنوان، توضیحات و یادداشت‌ها
-   `completed`: `true`/`false`
-   `priority`: سطح اولویت
-   `color`: رنگ TODO
-   `due_soon`: TODO های نزدیک به سررسید
-   `sort_by`: `created_at`, `updated_at`, `title`, `priority`, `due_date`
-   `sort_order`: `asc`, `desc`
-   `per_page`: تعداد آیتم در هر صفحه (پیش‌فرض: 15)

---

## 🚀 برای تست سریع:

```bash
# 1. ایجاد TODO ساده
curl -X POST "http://localhost:8000/api/v1/todos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"تست TODO","priority":"medium","color":"blue"}'

# 2. دریافت لیست
curl -X GET "http://localhost:8000/api/v1/todos" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
