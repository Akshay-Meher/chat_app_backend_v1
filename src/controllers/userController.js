const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Extract only error messages
        const errorMessages = errors.array().map(err => err.msg);
        return res.status(400).json({ errors: errorMessages });
    }

    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ errors: ['User already exists'] });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors: ['Server error'] });
    }
};

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Extract only error messages
        const errorMessages = errors.array().map(err => err.msg);
        return res.status(400).json({ errors: errorMessages });
    }

    const { email, password } = req.body;
    // console.log("level 1: ", req.body);

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ errors: ['User not found'] });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ errors: ['Invalid credentials'] });

        const token = jwt.sign({ id: user.id, user }, process.env.JWT_SECRET);
        // const token = jwt.sign({ id: user.id, user }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.status(200).json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.log('err', error);
        res.status(500).json({ errors: ['Server error'] });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.findAll();
        return res.status(200).json({ allUsers });
    } catch (error) {
        console.log('err', error);
        res.status(500).json({ errors: ['Server error'] });
    }
}

module.exports = { register, login, getAllUsers };
