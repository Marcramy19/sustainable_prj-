const errorHandler = (err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error:`, err.message);

    // Prisma known errors
    if (err.code === 'P2002') {
        return res.status(409).json({ error: 'A record with this value already exists' });
    }
    if (err.code === 'P2025') {
        return res.status(404).json({ error: 'Record not found' });
    }

    const status = err.statusCode || 500;
    const message = err.statusCode ? err.message : 'Internal server error';

    res.status(status).json({ error: message });
};

// Helper to create errors with status codes
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = { errorHandler, AppError };
