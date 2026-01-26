import rateLimit from "express-rate-limit";

export function makeRateLimiter() {
    const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Janela de 15 minutos
	max: 50, // Limite de 50 requisições por IP por janela
	standardHeaders: true, // Retorna info de limite nos headers `RateLimit-*`
	legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
    });

    return rateLimiter;
}