const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validateSwapCreate, validateSwapUpdate } = require('../validators/swapValidator');
const swapController = require('../controllers/swapController');

router.post('/', auth, validateSwapCreate, swapController.create);       // User — request swap
router.get('/mine', auth, swapController.listMine);                       // User — my swaps
router.patch('/:id', auth, validateSwapUpdate, swapController.updateStatus); // Owner — accept/reject

module.exports = router;
