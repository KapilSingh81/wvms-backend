import validator from "validator";

const errorBody = (code, message) => ({
    status: { code, type: "error", message },
    message,
    error: null,
});

const validateRedirectUrl = (value) => {
    const url = String(value ?? "").trim();
    if (!url) return "redirectUrl is required";
    if (
        !validator.isURL(url, {
            protocols: ["http", "https"],
            require_protocol: true,
            require_tld: false, // localhost allow
        })
    ) {
        return "Invalid redirectUrl";
    }
    return null;
};

const validateCommon = (body) => {
    const aadhaar = String(body.aadhaar_number || "").replace(/\s/g, "");
    const mobile = String(body.mobile_number || "").replace(/\s/g, "");
    const redirectUrl = String(body.redirectUrl ?? "").trim();

    let error = null;
    if (!aadhaar || !mobile) {
        error = "aadhaar_number and mobile_number are required";
    } else if (!validator.isNumeric(aadhaar, { no_symbols: true }) || aadhaar.length !== 12) {
        error = "Aadhaar must be 12 digits";
    } else if (!validator.isMobilePhone(mobile, "en-IN")) {
        error = "Invalid mobile number";
    } else {
        error = validateRedirectUrl(redirectUrl);
    }
    return { aadhaar, mobile, redirectUrl, error };
};

const postToProvider = async (payload, timeoutMs) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(process.env.DGKYC_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                api_id: process.env.WAPI_ID,
                api_key: process.env.WAPI_KEY,
                token_id: process.env.WTOKEN_ID,
                ...payload,
            }),
            signal: controller.signal,
        });
        const data = await response.json().catch(() => null);
        return { status: response.status, data };
    } finally {
        clearTimeout(timer);
    }
};

const sendFailure = (res, error) => {
    const timedOut = error.name === "AbortError";
    const code = timedOut ? 504 : 502;
    return res
        .status(code)
        .json(errorBody(code, timedOut ? "Verification service timed out" : "Unable to reach verification service"));
};

const StartKyc = async (req, res) => {
    try {
        const { aadhaar, mobile, redirectUrl, error } = validateCommon(req.body);
        if (error) return res.status(400).json(errorBody(400, error));

        const { status, data } = await postToProvider(
            {
                methodName: "generateToken",
                redirectUrl: redirectUrl,
                mobile_number: mobile,
                aadhar_number: aadhaar,
            },
            18000
        );

        if (data === null) {
            return res.status(502).json(errorBody(502, "Invalid response from verification service"));
        }
        return res.status(status).json(data);
    } catch (error) {
        return sendFailure(res, error);
    }
};

const fetchData = async (req, res) => {
    try {
        const clientId = String(req.body.client_id || "").trim();
        if (!clientId) {
            return res.status(400).json(errorBody(400, "client_id is required"));
        }
        if (!validator.isUUID(clientId)) {
            return res.status(400).json(errorBody(400, "Invalid client_id"));
        }

        const { aadhaar, mobile, redirectUrl, error } = validateCommon(req.body);
        if (error) return res.status(400).json(errorBody(400, error));

        const { status, data } = await postToProvider(
            {
                methodName: "fetchDetails",
                redirectUrl: redirectUrl,
                client_id: clientId,
                mobile_number: mobile,
                aadhar_number: aadhaar,
            },
            18000
        );

        if (data === null) {
            return res.status(502).json(errorBody(502, "Invalid response from verification service"));
        }

        // Provider ke do error shapes: error.data.code aur error.error.code
        const providerCode = data?.error?.data?.code ?? data?.error?.error?.code;

        if (providerCode === "1001") {
            return res.status(410).json(data); // session expired
        }
        if (providerCode === "INVALID_TRANSACTION_ID") {
            return res.status(404).json(data); // client_id ka session nahi mila
        }
        return res.status(status).json(data);
    } catch (error) {
        return sendFailure(res, error);
    }
};

export { StartKyc, fetchData };