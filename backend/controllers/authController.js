const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) return res.status(400).json({ message: 'Email already registered' });

        const userExists = await User.findOne({ where: { username } });
        if (userExists) return res.status(400).json({ message: 'Username already taken' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'customer',
        });

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(400).json({ message: error.message || 'Validation failed' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login };
