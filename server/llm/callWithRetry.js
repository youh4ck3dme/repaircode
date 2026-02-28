export async function callWithRetry({ fn, validate, maxRetries = 3 }) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const res = await fn();
            const valid = validate(res);
            if (!valid) {
                console.warn(`Validation failed (Attempt ${i + 1}/${maxRetries}):`, validate.errors);
                throw new Error("Schema validation failed");
            }
            return res;
        } catch (e) {
            lastError = e;
            console.error(`Retry attempt ${i + 1} failed:`, e.message);
        }
    }
    throw lastError;
}
