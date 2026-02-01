export function uploadRateLimit() {
    const rateLimitOptions = {
        max: 20,
        timeWindow: '8 minute'
    };
    return rateLimitOptions;
}