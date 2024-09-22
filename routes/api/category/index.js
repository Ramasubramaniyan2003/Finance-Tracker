var express = require('express');
var controller = require('./category');
var models = require('../../../models');
var router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const jwt = require('jsonwebtoken');


function authenticateToken(req, res, next) {
    const token = req.headers['x-at-sessiontoken'];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized, token is missing' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;  // Store user info in request object
        next();
    });
}

router.get('/get',authenticateToken, controller.getCategory); //table view
router.post('/add',authenticateToken, controller.addCategory);
router.put('/update/:id',authenticateToken, controller.updateCategory);
router.delete('/delete/:id',authenticateToken, controller.deleteCategory);
router.get('/get/category', authenticateToken, controller.getSelectCategory)

module.exports = router;