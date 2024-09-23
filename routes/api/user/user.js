
var models = require('../../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

exports.signup = async function (req, res) {
    try{
        const { email, password } = req.body;
        // Validate if email or username is missing
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide all required fields.' });
        }
        try {
            // Check if the user already exists
            const userExists = await models.User.findOne({ where: { email: email } });
            if (userExists) {
                return res.status(400).json({success: false, error: 'User already exists with this email.' });
            }
    
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Create a new user
            const user = await models.User.create({
                username: '',
                email,
                password: hashedPassword,
            });
            
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '12h' });
            return res.json({
                success: true,
                message: 'User created successfully!',
                data: {
                id: user.id,
                email: user.email,
                token, 
                }
            });
            // return res.status(201).json({success: true ,message: 'User created successfully!', data: req.user });
        } catch (error) {
            console.error('Error creating user: ', error);
            return res.status(500).json({ success: false, error: 'Internal server error' });
        }
    } catch(e) {
        console.log('error', e);
    }
}

exports.login = async function (req, res) {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide email and password.' });
    }

    try {
        // Find the user by email
        const user = await models.User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid email or password.' });
        }

        // Compare password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: 'Invalid email or password.' });
        }

        // Generate a JWT token (valid for 1 hour)
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '12h' });

        return res.json({
            success: true,
            message: 'Login successful!',
            id: user.id,
            email: user.email,
            token, 
        });
    } catch (error) {
        console.error('Error logging in: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
