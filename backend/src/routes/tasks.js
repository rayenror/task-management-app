const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.get('/', auth, taskController.getTasks);
router.post('/', auth, taskController.addTask);
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;
