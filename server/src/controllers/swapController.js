const swapService = require('../services/swapService');

const create = async (req, res, next) => {
    try {
        const swap = await swapService.create(req.user.id, req.body);
        res.status(201).json(swap);
    } catch (err) {
        next(err);
    }
};

const listMine = async (req, res, next) => {
    try {
        const swaps = await swapService.listMine(req.user.id);
        res.json(swaps);
    } catch (err) {
        next(err);
    }
};

const updateStatus = async (req, res, next) => {
    try {
        const swap = await swapService.updateStatus(req.params.id, req.user.id, req.body.status);
        res.json(swap);
    } catch (err) {
        next(err);
    }
};

module.exports = { create, listMine, updateStatus };
