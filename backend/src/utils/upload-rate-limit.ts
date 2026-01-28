export function uploadRateLimit() {
    const rateLimitOptions = {
        max: 15,
        timeWindow: '10 minute'
    };
    return rateLimitOptions;
}