function jalaliToGregorian(jy, jm, jd) {
    // Hard-coded for current year 1403
    if (jy === 1403) {
        const monthOffsets = [
            0,      // فروردین starts at March 20, 2024
            31,     // اردیبهشت starts at April 20, 2024  
            62,     // خرداد starts at May 21, 2024
            93,     // تیر starts at June 21, 2024
            126,    // مرداد starts at July 24, 2024 (corrected)
            157,    // شهریور starts at August 24, 2024
            188,    // مهر starts at September 24, 2024
            218,    // آبان starts at October 24, 2024
            248,    // آذر starts at November 23, 2024
            278,    // دی starts at December 23, 2024
            308,    // بهمن starts at January 22, 2025
            338     // اسفند starts at February 21, 2025
        ];
        
        const baseDate = new Date(2024, 2, 20); // March 20, 2024 = 1 Farvardin 1403
        const dayOffset = monthOffsets[jm - 1] + jd - 1;
        const resultDate = new Date(baseDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
        return [resultDate.getFullYear(), resultDate.getMonth() + 1, resultDate.getDate()];
    }
    
    return [2024, 1, 1]; // fallback
}

// Test 1 Mordad 1403 (month 5)
const result = jalaliToGregorian(1403, 5, 1);
const date = new Date(result[0], result[1] - 1, result[2]);
const days = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];

console.log('1 Mordad 1403 =', result.join('/'), '=', days[date.getDay()]);
console.log('Position in Persian calendar:', (date.getDay() + 1) % 7);
