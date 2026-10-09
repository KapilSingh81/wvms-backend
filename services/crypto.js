import crypto from 'crypto';

const KEY = Buffer.from(process.env.ENC_KEY, 'hex');

export const encrypt = (text) => {
    if (text === null || text === undefined || text === '') return text;
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
    const enc = Buffer.concat([cipher.update(String(text), 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${tag.toString('hex')}:${enc.toString('hex')}`;
};

export const decrypt = (payload) => {
    if (!payload) return payload;
    const parts = String(payload).split(':');
    if (parts.length !== 3) return payload; 
    try {
        const [iv, tag, data] = parts.map((p) => Buffer.from(p, 'hex'));
        const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
        decipher.setAuthTag(tag);
        return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
    } catch {
        return payload;
    }
};

export const hashValue = (v) =>
    crypto.createHmac('sha256', process.env.HASH_KEY).update(String(v).trim().toLowerCase()).digest('hex');

export const maskId = (v) => {
    if (!v) return v;
    const s = String(v);
    return s.length <= 4 ? s : '*'.repeat(s.length - 4) + s.slice(-4);
};