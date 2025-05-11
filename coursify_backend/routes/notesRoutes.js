const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const authenticate = require('../middleware/authenticateStudent'); // your JWT middleware

router.post('/:lessonId', authenticate, notesController.saveOrUpdateNote);
router.get('/:lessonId', authenticate, notesController.getNoteByLesson);

module.exports = router;