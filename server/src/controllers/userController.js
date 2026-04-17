const userService = require('../services/userService');

const getMe = async (req, res, next) => {
    try {
        const user = await userService.getMe(req.user.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

const updateMe = async (req, res, next) => {
    try {
        const user = await userService.updateMe(req.user.id, req.body);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

const deleteMe = async (req, res, next) => {
    try {
        await userService.deleteMe(req.user.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

const listAll = async (req, res, next) => {
    try {
        const users = await userService.listAll();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

const getStats = async (req, res, next) => {
    try {
        const stats = await userService.getStats();
        res.json(stats);
    } catch (err) {
        next(err);
    }
};

module.exports = { getMe, updateMe, deleteMe, listAll, deleteUser, getStats };
