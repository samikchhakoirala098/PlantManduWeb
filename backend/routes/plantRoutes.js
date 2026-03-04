const express = require('express');
const { getPlants, getPlantById, createPlant, updatePlant, deletePlant } = require('../controllers/plantController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/', getPlants);
router.get('/:id', getPlantById);
router.post('/', protect, admin, upload.single('image'), createPlant);
router.put('/:id', protect, admin, upload.single('image'), updatePlant);
router.delete('/:id', protect, admin, deletePlant);

module.exports = router;
