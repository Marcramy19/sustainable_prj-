const VALID_CATEGORIES = ['electronics', 'books', 'clothing', 'furniture', 'sports', 'toys', 'kitchen', 'other'];
const VALID_CONDITIONS = ['new', 'like_new', 'good', 'fair'];

const validateItem = (req, res, next) => {
    const { title, category, condition } = req.body;
    const errors = [];

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.push('Title is required');
    } else if (title.trim().length > 200) {
        errors.push('Title must be 200 characters or less');
    }

    if (!category || !VALID_CATEGORIES.includes(category)) {
        errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
    }

    if (!condition || !VALID_CONDITIONS.includes(condition)) {
        errors.push(`Condition must be one of: ${VALID_CONDITIONS.join(', ')}`);
    }

    if (req.body.description && req.body.description.length > 1000) {
        errors.push('Description must be 1000 characters or less');
    }

    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join('. ') });
    }

    req.body.title = title.trim();
    if (req.body.description) req.body.description = req.body.description.trim();
    next();
};

module.exports = { validateItem, VALID_CATEGORIES, VALID_CONDITIONS };
