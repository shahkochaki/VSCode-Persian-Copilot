function jalaliToGregorian(jy, jm, jd) {
    const jy2 = jy + 1595;
    let days = 365 * jy + Math.floor(jy2 / 33) * 8 + Math.floor(((jy2 % 33) + 3) / 4);
    for (let i = 0; i < jm - 1; ++i) {
        days += (i < 6) ? 31 : (i < 11) ? 30 : 29;
    }
    days += jd - 1;
    
    let gy = 400 * Math.floor(days / 146097);
    days %= 146097;
    let leap = true;
    if (days >= 36525) {
        days--;
        const gy2 = Math.floor(days / 36524);
        days %= 36524;
        if (days >= 365) {
            days++;
            leap = false;
        }
        gy += gy2 * 100;
    }
    const gy3 = Math.floor(days / 1461);
    days %= 1461;
    if (days >= 366) {
        leap = false;
        days--;
        gy += Math.floor(days / 365) + gy3 * 4;
        days %= 365;
    } else {
        gy += gy3 * 4;
    }
    let gd = days + 1;
    let gm;
    const sal_a = [0, 31, (leap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (gm = 0; gm < 13; gm++) {
        const v = sal_a[gm];
        if (gd <= v) break;
        gd -= v;
    }
    return [gy + 1600, gm, gd];
}

// Test 1 Mordad 1403 (month 5)
const result = jalaliToGregorian(1403, 5, 1);
const date = new Date(result[0], result[1] - 1, result[2]);
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

console.log('1 Mordad 1403 =', result.join('/'), '=', days[date.getDay()]);
console.log('Should be Monday (22 July 2024)');
console.log('Position in Persian calendar:', (date.getDay() + 1) % 7);
