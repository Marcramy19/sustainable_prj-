const { AppError } = require('../middleware/errorHandler');

const validateRegister = (req, res, next) => {
    const { email, password, name } = req.body;
    const errors = [];

    if (!email || typeof email !== 'string') {
        errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Invalid email format');
    }

    if (!password || typeof password !== 'string') {
        errors.push('Password is required');
    } else if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        errors.push('Name is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join('. ') });
    }

    // Sanitize
    req.body.email = email.trim().toLowerCase();
    req.body.name = name.trim();
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    req.body.email = email.trim().toLowerCase();
    next();
};

module.exports = { validateRegister, validateLogin };
