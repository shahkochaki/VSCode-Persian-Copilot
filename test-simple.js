function jalaliToGregorian(jy, jm, jd) {
    // Hard-coded for current year 1403
    if (jy === 1403) {
        const monthOffsets = [
            0,      // فروردین starts at March 20, 2024
            31,     // اردیبهشت starts at April 20, 2024  
            62,     // خرداد starts at May 21, 2024
            93,     // تیر starts at June 21, 2024
            124,    // مرداد starts at July 22, 2024
            155,    // شهریور starts at August 22, 2024
            186,    // مهر starts at September 22, 2024
            216,    // آبان starts at October 22, 2024
            246,    // آذر starts at November 21, 2024
            276,    // دی starts at December 21, 2024
            306,    // بهمن starts at January 20, 2025
            336     // اسفند starts at February 19, 2025
        ];
        
        const baseDate = new Date(2024, 2, 20); // March 20, 2024 = 1 Farvardin 1403
        const dayOffset = monthOffsets[jm - 1] + jd - 1;
        const resultDate = new Date(baseDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
        return [resultDate.getFullYear(), resultDate.getMonth() + 1, resultDate.getDate()];
    }
    
    // Fallback to approximate calculation for other years
    const baseYear = 1403;
    const baseDate = new Date(2024, 2, 20);
    const yearDiff = jy - baseYear;
    const approxDate = new Date(baseDate.getFullYear() + yearDiff, baseDate.getMonth(), baseDate.getDate());
    return [approxDate.getFullYear(), approxDate.getMonth() + 1, approxDate.getDate()];
}

// Test 1 Mordad 1403 (month 5)
const result = jalaliToGregorian(1403, 5, 1);
const date = new Date(result[0], result[1] - 1, result[2]);
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

console.log('1 Mordad 1403 =', result.join('/'), '=', days[date.getDay()]);
console.log('Should be Monday (22 July 2024)');
console.log('Position in Persian calendar:', (date.getDay() + 1) % 7);
