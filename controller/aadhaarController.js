import validator from "validator";

const errorBody = (code, message) => ({
    status: { code, type: "error", message },
    message,
    error: null,
});

const Verify = async (req, res) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    try {
        const aadhaar = String(req.body.aadhaar || "").replace(/\s/g, "");

        if (!aadhaar) {
            return res.status(400).json(errorBody(400, "Aadhaar number is required"));
        }
        if (!validator.isNumeric(aadhaar, { no_symbols: true }) || aadhaar.length !== 12) {
            return res.status(400).json(errorBody(400, "Aadhaar must be 12 digits"));
        }

        const response = await fetch(process.env.IDSPAY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                api_id: process.env.API_ID,
                api_key: process.env.API_KEY,
                token_id: process.env.TOKEN_ID,
                aadhaar,
            }),
            signal: controller.signal,
        });

        const data = await response.json().catch(() => null);

        if (data === null) {
            return res.status(502).json(errorBody(502, "Invalid response from verification service"));
        }
        return res.status(response.status).json(data);
    } catch (error) {
        const timedOut = error.name === "AbortError";
        const code = timedOut ? 504 : 502;
        return res.status(code).json(
            errorBody(code, timedOut ? "Verification service timed out" : "Unable to reach verification service")
        );
    } finally {
        clearTimeout(timer);
    }
};

export { Verify };