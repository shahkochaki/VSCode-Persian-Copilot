// بررسی تاریخ‌های ژوئیه 2024
for (let day = 20; day <= 25; day++) {
    const date = new Date(2024, 6, day);
    const days = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    console.log(`${day} July 2024 = ${days[date.getDay()]}`);
}
