var models = require('../../../models');


exports.getCategory = async function (req, res) {
    try {
        const transaction = await models.Category.findAll({
            where: {
                userId: req.user.id
            }
        });
        res.send({ success: true, data: transaction });
    } catch (e) {
        console.log('Error in /api/category/getCategory', e);
        res.send({ success: false, data: `error loading data ${e}` });
    }
}

exports.addCategory = async function (req, res) {
    try {
        const { name, type, notes } = req.body
        const transaction = await models.Category.create({ name: name, type: type, notes: notes, userId: req.user.id });
        res.send({ success: true, data: transaction });
    } catch (e) {
        console.log('error', e);
        console.log('Error in /api/category/addCategory', e);
        res.send({ success: false, data: `error loading data ${e}` });
    }
}

exports.updateCategory = async function (req, res) {
    try {
        const { id, category, type, amount, notes, date } = req.body

        const Transaction = await models.Category.update({ category: category, amount: amount, type: type, notes: notes, date: date },
            {
                where: {
                    id: req.params.id,
                    userId: req.user.id
                }
            }
        );
        res.send({ success: true, data: Transaction });
    } catch (e) {
        console.log('error', e);
        console.log('Error in /api/category/updateCategory', e);
        res.send({ success: false, data: `error loading data ${e}` });

    }
}


exports.deleteCategory = async function (req, res) {
    try {
        const Transaction = await models.Category.destroy(
            {
                where: {
                    id: req.params.id,
                    userId: req.user.id
                }
            }
        );
        res.send({ success: true, data: Transaction });
    } catch (e) {
        console.log('error', e);
        console.log('Error in /api/category/deleteCategory', e);
        res.send({ success: false, data: `error loading data ${e}` });
    }
}

exports.getSelectCategory = async function (req, res) {
    try {
        const Categories = await models.Category.findAll({
            attributes: ['id', 'name', 'type'],
            where: {
                userId: req.user.id
            }
        });
        res.send({ success: true, data: Categories });
    } catch (e) {
        console.log('error', e);
        console.log('Error in /api/category/getSelectCategory', e);
        res.send({ success: false, data: `error loading data ${e}` });
    }
}