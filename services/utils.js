import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}


const DT_RE = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?(Z|[+-]\d{2}:?\d{2})?$/;

export const parseDateTime = (value, isEnd) => {
    const m = DT_RE.exec(value.trim());
    if (!m) return null;

    const [, date, hh, mm, ss, tzRaw = ""] = m;

    let time;
    if (hh === undefined) {
        time = isEnd ? "23:59:59.999" : "00:00:00";
    } else if (ss === undefined) {
        time = `${hh}:${mm}:${isEnd ? "59.999" : "00"}`;
    } else {
        time = `${hh}:${mm}:${ss}${isEnd ? ".999" : ""}`;
    }

    const tz = /^[+-]\d{4}$/.test(tzRaw) ? `${tzRaw.slice(0, 3)}:${tzRaw.slice(3)}` : tzRaw;

    const d = new Date(`${date}T${time}${tz}`); 
    return isNaN(d) ? null : d;
};

 export const todayStr = () => new Date().toLocaleDateString("en-US");
