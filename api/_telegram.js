const TELEGRAM_TOKEN   = "8687640961:AAFRHGV5uGvE71wUtpYgwWczToU3rXpTcdA";
const TELEGRAM_CHAT_ID = "6483043491";

export async function sendTelegram(text) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text,
                parse_mode: "HTML"
            })
        });
        return await res.json();
    } catch (err) {
        console.error("Telegram error:", err);
        return null;
    }
}
