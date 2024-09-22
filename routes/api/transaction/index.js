var express = require('express');
var controller = require('./transaction');
var models = require('../../../models');
var router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const jwt = require('jsonwebtoken');


function authenticateToken(req, res, next) {
    const token = req.headers['x-at-sessiontoken'];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized, token is missing' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        req.user = user;  // Store user info in request object
        next();
    });
}

router.get('/get', authenticateToken, controller.getTransaction);
router.post('/add', authenticateToken, controller.addTransaction);
router.put('/update/:id', authenticateToken, controller.updateTransaction);
router.delete('/delete/:id', authenticateToken, controller.deleteTransaction);

module.exports = router;