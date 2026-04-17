const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const userController = require('../controllers/userController');

router.get('/me', auth, userController.getMe);
router.put('/me', auth, userController.updateMe);
router.delete('/me', auth, userController.deleteMe);
router.get('/', auth, admin, userController.listAll);
router.get('/stats', auth, admin, userController.getStats);
router.delete('/:id', auth, admin, userController.deleteUser);

module.exports = router;
