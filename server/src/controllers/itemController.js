const itemService = require('../services/itemService');

const create = async (req, res, next) => {
    try {
        const item = await itemService.create(req.user.id, req.body);
        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
};

const list = async (req, res, next) => {
    try {
        const { category, page } = req.query;
        const result = await itemService.list({ category, page: parseInt(page) || 1 });
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const getById = async (req, res, next) => {
    try {
        const item = await itemService.getById(req.params.id);
        res.json(item);
    } catch (err) {
        next(err);
    }
};

const listMine = async (req, res, next) => {
    try {
        const items = await itemService.listMine(req.user.id);
        res.json(items);
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        const item = await itemService.update(req.params.id, req.user.id, req.body);
        res.json(item);
    } catch (err) {
        next(err);
    }
};

const remove = async (req, res, next) => {
    try {
        await itemService.remove(req.params.id, req.user.id, req.user.isAdmin);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

module.exports = { create, list, getById, listMine, update, remove };
