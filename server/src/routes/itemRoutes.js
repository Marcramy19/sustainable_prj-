const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { validateItem } = require('../validators/itemValidator');
const itemController = require('../controllers/itemController');

router.get('/', itemController.list);                          // Public — browse items
router.get('/mine', auth, itemController.listMine);            // User — my items
router.get('/:id', itemController.getById);                    // Public — item detail
router.post('/', auth, validateItem, itemController.create);   // User — create item
router.put('/:id', auth, validateItem, itemController.update); // Owner — edit item
router.delete('/:id', auth, itemController.remove);            // Owner/Admin — delete item

module.exports = router;
