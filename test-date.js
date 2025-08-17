const jalaliToGregorian = (jy, jm, jd) => {
    const jy2 = jy + 1595;
    let days = 365 * jy + Math.floor(jy2 / 33) * 8 + Math.floor(((jy2 % 33) + 3) / 4);
    for (let i = 0; i < jm; ++i) {
        days += (i < 6) ? 31 : (i < 11) ? 30 : 29;
    }
    days += jd - 1;
    let gy = 400 * Math.floor(days / 146097);
    days %= 146097;
    let leap = true;
    if (days >= 36525) {
        days--;
        const gyCent = Math.floor(days / 36524);
        days %= 36524;
        if (days >= 365) {
            days++;
            leap = false;
        }
        gy += 100 * gyCent;
    }
    const gyQuad = Math.floor(days / 1461);
    days %= 1461;
    if (days >= 366) {
        leap = false;
        days--;
        const gyYear = Math.floor(days / 365);
        days %= 365;
        gy += 4 * gyQuad + gyYear;
    } else {
        gy += 4 * gyQuad;
    }
    const gm = [0, 31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let month = 0;
    for (let i = 1; i <= 12; ++i) {
        if (days < gm[i]) {
            month = i;
            break;
        }
        days -= gm[i];
    }
    return [gy, month, days + 1];
};

// Test real date: 1 Mordad 1403 = 22 July 2024
const testDate = new Date(2024, 6, 22); // July 22, 2024
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const persianDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];

console.log('22 July 2024 =', days[testDate.getDay()], '=', persianDays[testDate.getDay()]);
console.log('JavaScript day number:', testDate.getDay());
console.log('Persian calendar position with (+1)%7:', (testDate.getDay() + 1) % 7);
console.log('Persian calendar position with (+2)%7:', (testDate.getDay() + 2) % 7);

// Manual check for what should be in Persian calendar:
// Saturday=0, Sunday=1, Monday=2, Tuesday=3, Wednesday=4, Thursday=5, Friday=6
console.log('Expected: Monday should be position 2 in Persian calendar (ش ی د س چ پ ج)');
console.log('Our formula gives:', (testDate.getDay() + 1) % 7, 'for Monday');

// If Monday is day 1 in JS and should be position 2 in Persian
// Then formula should be: (jsDay + 1) % 7
// Monday: (1 + 1) % 7 = 2 ✓
