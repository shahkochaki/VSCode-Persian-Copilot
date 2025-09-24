# سرویس مدیریت چیت شیت‌های شخصی و عمومی

این سرویس قابلیت مدیریت چیت شیت‌های شخصی و عمومی را برای VSCode Extension فراهم می‌کند.

## ویژگی‌ها

### احراز هویت کاربر

- ورود و ثبت‌نام کاربران
- مدیریت توکن‌های JWT
- پشتیبانی از حالت لاگین/لاگ‌اوت
- تشخیص خودکار تغییرات وضعیت احراز هویت

### مدیریت چیت شیت‌ها

- مشاهده چیت شیت‌های عمومی (برای همه کاربران)
- ایجاد چیت شیت‌های شخصی (فقط کاربران لاگین)
- ویرایش و حذف چیت شیت‌های شخصی
- جستجو و فیلتر بر اساس دسته‌بندی
- مدیریت آیتم‌های داخل چیت شیت‌ها

## فایل‌های سرویس

### 1. CheatSheetService.js

کلاس اصلی برای مدیریت چیت شیت‌ها شامل:

```javascript
// ایجاد نمونه سرویس
const cheatSheetService = new CheatSheetService();

// دریافت لیست چیت شیت‌ها
const result = await cheatSheetService.getCheatSheets();

// ایجاد چیت شیت جدید (نیاز به لاگین)
const newCheatSheet = await cheatSheetService.createCheatSheet({
  title: "چیت شیت من",
  description: "توضیحات چیت شیت",
  category: "JavaScript",
  is_public: false,
});
```

### 2. AuthenticationManager.js

کلاس مدیریت احراز هویت شامل:

```javascript
// ایجاد نمونه مدیر احراز هویت
const authManager = new AuthenticationManager();

// ورود کاربر
const loginResult = await authManager.login("user@example.com", "password");

// ثبت‌نام کاربر جدید
const registerResult = await authManager.register({
  name: "نام کاربر",
  email: "user@example.com",
  password: "password123",
  password_confirmation: "password123",
});

// خروج از سیستم
await authManager.logout();
```

## تنظیمات API

سرویس‌ها از API اصلی پروژه استفاده می‌کنند:

```javascript
// آدرس API اصلی که در پروژه استفاده میشه
const API_BASE_URL = "https://console.helpix.app/api/v1";
```

## مدیریت Token

سرویس‌ها از همان localStorage key استفاده می‌کنند که در سایر بخش‌های پروژه:

- `helpix_user_data`: شامل token و اطلاعات کاربر

```javascript
// فرمت ذخیره‌سازی
{
    "token": "jwt_token_here",
    "user": {
        "id": 1,
        "name": "نام کاربر",
        "email": "user@example.com"
        // سایر اطلاعات کاربر
    }
}
```

## مسیرهای API مورد انتظار

بر اساس کنترلر Laravel ارائه شده، این مسیرها باید در بکند تعریف شوند:

### احراز هویت

- `POST /api/auth/login` - ورود کاربر
- `POST /api/auth/register` - ثبت‌نام کاربر
- `POST /api/auth/logout` - خروج کاربر
- `GET /api/auth/me` - دریافت اطلاعات کاربر فعلی

### چیت شیت‌ها

- `GET /api/cheat-sheets` - دریافت لیست چیت شیت‌ها
- `POST /api/cheat-sheets` - ایجاد چیت شیت جدید
- `GET /api/cheat-sheets/{id}` - دریافت جزئیات چیت شیت
- `PUT /api/cheat-sheets/{id}` - بروزرسانی چیت شیت
- `DELETE /api/cheat-sheets/{id}` - حذف چیت شیت

### آیتم‌های چیت شیت

- `GET /api/cheat-sheets/{id}/items` - دریافت آیتم‌ها
- `POST /api/cheat-sheets/{id}/items` - اضافه کردن آیتم جدید
- `PUT /api/cheat-sheets/{id}/items/{itemId}` - ویرایش آیتم
- `DELETE /api/cheat-sheets/{id}/items/{itemId}` - حذف آیتم

## قوانین دسترسی

### کاربران غیرلاگین:

- فقط مشاهده چیت شیت‌های عمومی (`is_public = true`)
- عدم دسترسی به ایجاد، ویرایش، حذف

### کاربران لاگین:

- مشاهده چیت شیت‌های عمومی + چیت شیت‌های شخصی خود
- ایجاد چیت شیت‌های جدید
- ویرایش و حذف فقط چیت شیت‌های خودی

## نحوه استفاده در HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- CSS و سایر تنظیمات -->
  </head>
  <body>
    <!-- محتوای HTML -->

    <script src="services/AuthenticationManager.js"></script>
    <script src="services/CheatSheetService.js"></script>
    <script>
      // مقداردهی سرویس‌ها
      const authManager = new AuthenticationManager();
      const cheatSheetService = new CheatSheetService();

      // تنظیم URL (از API موجود پروژه استفاده میکنیم)
      const API_URL = "https://console.helpix.app/api/v1";

      // سرویس‌ها خودکار از این API استفاده می‌کنند

      // استفاده از سرویس‌ها
      // ...
    </script>
  </body>
</html>
```

## ذخیره‌سازی محلی

سرویس‌ها از localStorage key موجود در پروژه استفاده می‌کنند:

- `helpix_user_data`: شامل توکن احراز هویت و اطلاعات کاربر لاگین شده

این امر باعث سازگاری کامل با سایر بخش‌های پروژه می‌شود.

## مدیریت خطاها

تمام متدهای async مناسب‌سازی شده‌اند و خطاهای مناسب را بازمی‌گردانند:

```javascript
try {
  const result = await cheatSheetService.createCheatSheet(data);
  if (result.success) {
    console.log("موفق!");
  }
} catch (error) {
  console.error("خطا:", error.message);
}
```

## events و callbacks

AuthenticationManager از callback pattern برای اطلاع‌رسانی تغییرات وضعیت احراز هویت استفاده می‌کند:

```javascript
authManager.onAuthStateChange((isAuthenticated, user) => {
  if (isAuthenticated) {
    console.log("کاربر وارد شد:", user);
    // بروزرسانی UI
  } else {
    console.log("کاربر خارج شد");
    // بروزرسانی UI
  }
});
```

## نکات امنیتی

1. حتماً HTTPS برای API استفاده کنید
2. توکن‌ها دارای انقضا باشند
3. از CORS مناسب استفاده کنید
4. ولیدیشن ورودی‌ها در سمت سرور انجام دهید

## تست

برای تست سرویس‌ها می‌توانید:

1. یک API mock ایجاد کنید
2. از Postman برای تست endpoint ها استفاده کنید
3. Console log ها را برای debug کردن بررسی کنید
