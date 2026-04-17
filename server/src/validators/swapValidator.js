const validateSwapCreate = (req, res, next) => {
    const { offeredItemId, requestedItemId } = req.body;
    const errors = [];

    if (!offeredItemId || typeof offeredItemId !== 'string') {
        errors.push('offeredItemId is required');
    }
    if (!requestedItemId || typeof requestedItemId !== 'string') {
        errors.push('requestedItemId is required');
    }
    if (offeredItemId && requestedItemId && offeredItemId === requestedItemId) {
        errors.push('Cannot swap an item with itself');
    }

    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join('. ') });
    }
    next();
};

const validateSwapUpdate = (req, res, next) => {
    const { status } = req.body;

    if (!status || !['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Status must be "accepted" or "rejected"' });
    }
    next();
};

module.exports = { validateSwapCreate, validateSwapUpdate };
