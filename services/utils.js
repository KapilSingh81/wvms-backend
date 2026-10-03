const DT_RE = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?(Z|[+-]\d{2}:?\d{2})?$/;
const IST_OFFSET = "+05:30";

// "YYYY-MM-DD" ya "YYYY-MM-DDTHH:mm[:ss]" -> Date. Offset na ho to IST maanta hai.
export const parseDateTime = (value, isEnd) => {
    const m = DT_RE.exec(String(value).trim());
    if (!m) return null;

    const [, date, hh, mm, ss, tzRaw] = m;

    let time;
    if (hh === undefined) {
        time = isEnd ? "23:59:59.999" : "00:00:00";
    } else if (ss === undefined) {
        time = `${hh}:${mm}:${isEnd ? "59.999" : "00"}`;
    } else {
        time = `${hh}:${mm}:${ss}${isEnd ? ".999" : ""}`;
    }

    let tz = tzRaw || IST_OFFSET;
    if (/^[+-]\d{4}$/.test(tz)) tz = `${tz.slice(0, 3)}:${tz.slice(3)}`;

    const d = new Date(`${date}T${time}${tz}`);
    return isNaN(d) ? null : d;
};

// Aaj ki date India ke hisaab se, YYYY-MM-DD format mein
export const todayStr = () =>
    new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });