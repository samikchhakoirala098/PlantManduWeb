const { Plant } = require('../models');

const getPlants = async (req, res) => {
    try {
        const plants = await Plant.findAll();
        res.json(plants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPlantById = async (req, res) => {
    try {
        const plant = await Plant.findByPk(req.params.id);
        if (plant) res.json(plant);
        else res.status(404).json({ message: 'Plant not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPlant = async (req, res) => {
    const { name, price, description, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const plant = await Plant.create({ name, price, description, category, image });
        res.status(201).json(plant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePlant = async (req, res) => {
    const { name, price, description, category } = req.body;
    try {
        const plant = await Plant.findByPk(req.params.id);
        if (plant) {
            plant.name = name || plant.name;
            plant.price = price || plant.price;
            plant.description = description || plant.description;
            plant.category = category || plant.category;
            if (req.file) {
                plant.image = `/uploads/${req.file.filename}`;
            }
            await plant.save();
            res.json(plant);
        } else {
            res.status(404).json({ message: 'Plant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePlant = async (req, res) => {
    try {
        const plant = await Plant.findByPk(req.params.id);
        if (plant) {
            await plant.destroy();
            res.json({ message: 'Plant removed' });
        } else {
            res.status(404).json({ message: 'Plant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPlants, getPlantById, createPlant, updatePlant, deletePlant };
